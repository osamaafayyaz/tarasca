import React, { Component, Fragment } from "react";
import QrReader from "react-qr-reader";

import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import {validateAddress} from './validators';
import QrIcon from './images/qr_icon.svg';
import InputAdornment from '@material-ui/core/InputAdornment';



export class QrAccountField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      delay: 300,
      result: "ARDOR-xxxx-xxxx-xxxx-xxxxx",
      found:false,
      scanStatus:{invalid:true,error:""}
    };

    this.toggle = this.toggle.bind(this);
  }

  handleScan = (data) => {
    var self = this;
    console.log(data);
    if (data) {
      self.setState({result:data});
      const newStatus = validateAddress(data,this.state.scanStatus);
      if (newStatus.invalid === false) {
        //TODO delay, show address below camera feed and close
        self.setState({found:true});
        //const ret = {target:{value:data}}; // compatibility with manual entry of address.
        self.props.onChange(data);
        
      }
    }
  }

  handleError(err) {
    console.error(err);
  }
  
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  cancel = ()=> {
    this.props.onChange("");
    this.toggle();
  }

  render() {

    let color = this.state.found ? "success" : "secondary";
    let buttontext = this.state.found ? this.props.value : "ARDOR-xxxx-xxxx-xxxx-xxxxx";

    return (
      <Fragment>
          <TextField 
            fullWidth
            type="text" 
            size="28" 
            variant="filled" 
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                <IconButton aria-label="QR code reader" 
                            onClick={this.toggle}>
                    <img src={QrIcon} alt="QR Icon" width={"20px"}/> 
                </IconButton>
              </InputAdornment>
              ),
            }}
            error={this.props.status.invalid}
            helperText={this.props.status.error}
            label={this.props.children}              
            value={this.props.value}
            onChange={event => this.props.onChange(event.target.value)}
          />
          <Dialog open={this.state.modal} onClose={this.toggle}>
            <QrReader
              ref="reader"
              maxImageSize={600}
              delay={this.state.delay}
              constraints={{ deviceId: 2 }}
              facingMode={"environment"} 
              onError={this.handleError}
              onScan={this.handleScan}
              style={{ width: "100%" }}
            /> 
            <Button outline color={color} >{buttontext}</Button>
            <Button outline color={color} onClick={this.toggle} disabled={!this.state.found}>Select</Button>
            <Button outline color="secondary" onClick={this.cancel}>Cancel</Button>
          </Dialog>
      </Fragment>
    );
  }
}