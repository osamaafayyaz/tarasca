import React, { Component, Fragment } from "react";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { decrypt } from "../login/storage";

export function PinField({pin,status,onChange,onClick,label}){
  return (
    <Grid container
        justify="center"
        alignItems="stretch"
        direction="column"
        spacing={24}>
      <Grid item>
        <TextField
          fullWidth
          id="pin"
          label="PIN"
          value={pin}
          onChange={event => onChange(event.target.value)}
          type="tel"
          inputProps={{style:{fontFamily: 'password-mask'},className:'numeric-password'}}
          className="numeric-password"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          variant="outlined"
          error={status.invalid}
          helperText={status.error} 
          autoComplete="off" 
        />
      </Grid>
      <Grid item>
        <Button fullWidth type="submit" variant="outlined" onClick={onClick}>
            {label}
        </Button>
      </Grid>
    </Grid>
  );
}

export function PassPhraseField({passPhrase,status,onChange,onClick,label}){
  return (
    <Fragment>
        <TextField multiline
          id="passphrase"
          label="Pass Phrase"
          rows="4"
          defaultValue="your pass phrase"
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            readOnly: true,
            shrink: true,
          }}
          value={passPhrase}
          onChange={event => onChange(event.target.value)}
          error={status.invalid}
          helperText={status.error} 
          autoComplete="off"
        />
        <Button type="submit" variant="outlined" onClick={onClick}>
            {label}
        </Button>
    </Fragment>
  );
}


export class SignActionField extends Component {
  constructor(props){
    super(props);
    this.state = {
      pin:"",
      pinStatus:{invalid:false,error:""},
    }
  }

  submit = ()=>{
    if (this.props.user.usePin) {
      console.log("submit() called");
      let passPhrase = "";
      try {
        passPhrase = decrypt(this.props.user.token,this.state.pin);
        this.props.handlePassphraseChange(passPhrase);
      }
      catch(exception) {
        this.setState({pinStatus:{invalid:true,error:exception.message}});
        return false;
      }
    }      
  } 

  render(){
    //TODO onChange and state for pin need to be handled locally.
    let pin = this.props.user.usePin;
    let label = this.props.label ? this.props.label : "Submit";
    if (pin) {
      return (
        <PinField pin={this.state.pin} 
                  status={this.state.pinStatus}
                  onChange={(value)=>this.setState({pin:value})}
                  onClick={()=>this.submit()}
                  label={label}
                  />
      );
    }
    else {
      return (
        <PassPhraseField passPhrase={this.props.passPhrase} 
                      status={this.props.passPhraseStatus}
                      onChange={this.props.handlePassphraseChange}
                      onClick={this.props.action}
                      label={label}
                      />
      )
    }    
  }
}