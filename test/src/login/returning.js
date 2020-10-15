import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import {Link, withRouter} from 'react-router-dom';

import {encrypt} from './storage';
import { validatePin, validatePassPhrase, validatePhraseLength, validateUsername , validateAddress} from '../common/validators';


class ReturningUser_ extends Component {
  constructor(props) {
    super(props);
    this.state={
      name:"",
      nameStatus:{invalid:false,error:""},
      accountRs:"",
      accountRsStatus:{invalid:false,error:""},
      passPhrase:"",
      passPhraseStatus:{invalid:false,error:""},
      usePin:true,
      Pin:"",
      PinStatus:{invalid:false,error:""},
      formValid:false      
    }
  }

  onClick = () => {
    let status = validatePassPhrase(this.state.passPhrase,this.state.passPhraseStatus, this.state.accountRs);
    let nameStatus = validateUsername(this.state.name,this.state.nameStatus,this.props.userList);
    console.log(nameStatus);
    if (status.invalid | nameStatus.invalid) {
      this.setState({passPhraseStatus:status,nameStatus:nameStatus});
    }
    else {
      let user = { 
        name:this.state.name, 
        accountRs:this.state.accountRs,
        usePin:this.state.usePin,
        token: (this.state.usePin && this.state.passPhrase && this.state.Pin) 
                    ? encrypt(this.state.passPhrase,this.state.Pin) : ""
      } 
      this.props.registerNewUser(user);
      this.props.history.push("/login");
    }
  }

  validateForm(){
    const nameValid = !this.state.nameStatus.invalid;
    const PinValid = this.state.usePin ? !this.state.PinStatus.invalid : true;
    const passPhraseValid = !this.state.passPhraseStatus.invalid;
    this.setState({formValid:PinValid & passPhraseValid & nameValid});
  }
  
  render() {
    var self = this;
    return (
      <div style={{textAlign:"center", display:"inline-block"}}>
        <Grid container
            justify="center"
            alignItems="stretch"
            direction="column"
            spacing={24}
          >
            <Grid item>
              <Typography style={{textAlign:"right"}}><Link className="link" to="/login">Back to Login</Link>{' '} 
                    or <Link className="link" to="/login/new">New User</Link></Typography>
              <Typography variant="h5">Restore your account on this device</Typography>
              <form>
                <TextField
                  id="outlined-full-width"
                  label="Name"
                  style={{ margin: 8 }}
                  placeholder="Enter your name"
                  helperText="used to identify you on this device"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e)=>{
                    let value = e.target.value;
                    self.setState({name:value}, ()=>{
                      self.setState({nameStatus:validateUsername(value,self.state.nameStatus,self.props.userList)}, 
                      self.validateForm)
                  })}}
                  value={this.state.name}
                  error={this.state.nameStatus.invalid}
                />
                <FormGroup>
                  <TextField
                    id="account"
                    label="Account"
                    style={{ margin: 8 }}
                    helperText="Ardor Account ID"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={this.state.accountRs}
                    onChange={(e)=>{
                      let value = e.target.value;
                      this.setState({accountRs:value}, () => {
                        self.setState({
                            accountRsStatus:validateAddress(value,self.state.accountRsStatus)},
                            self.validateForm)
                      
                    })}}
                    error={this.state.accountRsStatus.invalid}
                  />

                  <TextField multiline
                    id="passphrase"
                    label="Pass Phrase"
                    rows="4"
                    defaultValue="your pass phrase"
                    margin="normal"
                    variant="outlined"
                    value={this.state.passPhrase}
                    onChange={(e)=>{
                      let value = e.target.value;
                      self.setState({passPhrase:value},()=>{
                        self.setState({
                        passPhraseStatus:validatePhraseLength(value,self.state.passPhraseStatus)},
                        self.validateForm)
                      })}}
                    error={this.state.passPhraseStatus.invalid}
                  />
                </FormGroup>
                 
                {
                  this.state.usePin ? (
                    <FormGroup>
                      <TextField
                        id="pin"
                        label="PIN"
                        value={this.state.Pin}
                        onChange={(e)=>{
                          let value = e.target.value;
                          self.setState(
                            {Pin:value},
                            ()=>{
                              self.setState({PinStatus:validatePin(value,self.state.PinStatus)}, self.validateForm)
                            })}}
                        type="tel"
                        className="numeric-password"
                        InputLabelProps={{
                          type:"tel",
                          shrink: true,
                        }}
                        margin="normal"
                        variant="outlined"
                        error={this.state.PinStatus.invalid}
                        autoComplete="off"
                      />                
                    </FormGroup>
                    ) : null
                }
                <FormGroup>
                  <Button variant="outlined" disabled={!self.state.formValid} onClick={()=>this.onClick()}>
                      Register User
                  </Button>
                </FormGroup>
              </form>
          </Grid>
        </Grid>
      </div>  
    );
  }
}

export const ReturningUser = withRouter(ReturningUser_);