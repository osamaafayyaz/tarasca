import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import {Link, withRouter} from 'react-router-dom';

import {initUser} from './storage';
import {secretPhraseToAccountId} from 'ardorjs';
import {generatePassphrase} from './generatePassphrase';
import { validatePin, validateUsername } from '../common/validators';


class NewUser_ extends Component {
  constructor(props) {
    super(props);
    this.state={
      name:"",
      nameStatus:{invalid:false,error:""},
      accountRs:"",
      accountRsStatus:{invalid:false,error:""},
      passPhrase:"",
      usePin:true,
      Pin:"",
      PinStatus:{invalid:false,error:""},
      generateStatus:{invalid:false,error:""},
      formValid:false
    }
  }

  generateAccount = () => {
    let phrase = generatePassphrase();
    let accountRs = secretPhraseToAccountId(phrase,false);
    this.setState({passPhrase:phrase, accountRs:accountRs, generateStatus:{invalid:false,error:""}});
  }

  validateForm(){
    const PinValid = !this.state.PinStatus.invalid;
    const nameValid = !this.state.nameStatus.invalid;
    const ardorValid = !this.state.generateStatus.invalid;
    this.setState({formValid:(PinValid & nameValid & ardorValid)});
  }

  onClick = () => {
    // function will only be called if all fields are valid. 
    // Hence only checking for usePin == true to start encryption.
    let nameStatus = validateUsername(this.state.name,this.state.nameStatus,this.props.userList);
    let pinStatus = validatePin(this.state.Pin,this.state.PinStatus);
    let generateStatus = ((this.state.accountRs.length === 0) | (this.state.passPhrase.length===0)) 
                ? {invalid:true,error:"Please generate an Ardor wallet."}
                : {invalid:false,error:""};

    if (nameStatus.invalid | (this.state.usePin & pinStatus.invalid) | generateStatus.invalid){
      this.setState({nameStatus:nameStatus, PinStatus:pinStatus, generateStatus:generateStatus});
    }
    else {
      // let user = {
      //   name:this.state.name, 
      //   accountRs:this.state.accountRs,
      //   usePin:this.state.usePin,
      //   token: (this.state.usePin) 
      //               ? encrypt(this.state.passPhrase,this.state.Pin) : ""
      // } 
      let user = initUser(this.state.name,this.state.accountRs,this.state.usePin,this.state.passPhrase,this.state.Pin);
      this.props.registerNewUser(user);
      this.props.history.push("/login");
    }
  }
    
  render(){
    var self = this;
    //console.log(this.props);
    return (
      <form>
        <div style={{textAlign:"center", display:"inline-block"}}>
        <Grid container
            justify="center"
            alignItems="stretch"
            direction="column"
            spacing={24}
          >
            <Grid item>
              <Typography style={{textAlign:"right"}}><Link className="link" to="/login">Back to Login</Link>{' '} 
                  or <Link className="link" to="/login/returning">Restore User</Link></Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5">Create a new Account</Typography>
            </Grid>
            <Grid item>
              <TextField
                id="outlined-full-width"
                label="Name"
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
            </Grid>
            <Grid item>
              <Button fullWidth variant="outlined" onClick={() => this.generateAccount()}>
                  Generate Wallet
              </Button>
            </Grid>
            <Grid item>
              <TextField disabled
                id="account"
                label="Account"
                helperText="Ardor Account ID"
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  readOnly: true,
                }}
                value={this.state.accountRs}
                error={this.state.generateStatus.invalid}
              />

              <TextField disabled multiline fullWidth
                id="passphrase"
                label="Pass Phrase"
                rows="4"
                defaultValue="your pass phrase"
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  readOnly: true,
                }}
                value={this.state.passPhrase}
                error={this.state.generateStatus.invalid}
              />
            </Grid>
            
            {
              this.state.usePin ? (
                <Grid item>
                  <TextField 
                    fullWidth
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
                </Grid>
                ) : null
            }
            <Grid item>
              <Button fullWidth variant="outlined" onClick={()=>this.onClick()}>
                Register!
              </Button>
            </Grid>
          </Grid>
        </div>
      </form>  
    );
  }
}

export const NewUser = withRouter(NewUser_);

