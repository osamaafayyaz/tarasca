import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {Link, withRouter} from 'react-router-dom';
import './login.css';
import {fakeAuth} from './auth';
import {decrypt} from './storage';
import {validatePassPhrase} from '../common/validators';
import Grid from '@material-ui/core/Grid';
import NativeSelect from '@material-ui/core/NativeSelect';
import OutlinedInput from '@material-ui/core/OutlinedInput';


class LoginForm extends Component {
  constructor(props){
    super(props);

    this.state={
      inPin:"",
      selectedOption:"",
      loginStatus:{invalid:false,error:""}
    }
  }
  
  login = (event) => {
    var self = this;

    if (this.props.user && this.props.user.usePin) {
      let passPhrase = "";
      try {
        passPhrase = decrypt(this.props.user.token,this.state.inPin);
      }
      catch(exception) {
        self.setState({loginStatus:{invalid:true,error:exception.message}});
        return false;
      }
      let status = validatePassPhrase(passPhrase,{invalid:true,error:"not decrypted yet"},this.props.user.accountRs);
      if (status.invalid) {
        console.log("some sort of authentication failed.");
      }
      else if (!status.invalid) {
        fakeAuth.authenticate(this.props.user);
        self.props.history.push('/game');
      }
    }
    else {
      fakeAuth.authenticate(this.props.user);
      self.props.history.push('/game');
    }
  }
  
  render(){
    var self=this;
    const options = (this.props.userList) ? 
                      this.props.userList.map((user)=>({value:user,label:user}))
                      : [{value:"", label:"No users"}];
                  
    if (fakeAuth.isAuthenticated) {
      return (
      <div style={{textAlign:"center", padding:20, display:"inline-block"}}>
        <Grid container
        justify="center"
        alignItems="stretch"
        direction="column"
        spacing={24}
        >
          <Grid item>
            <Typography>Logged in as {this.props.user.name}</Typography>
          </Grid>
          <Grid item>
            <Link to="/game">
              <Button variant="outlined">Return to the Game</Button>
            </Link>
          </Grid>
          <Grid item>
            <Link to="/logout">
              <Button variant="outlined">Logout</Button>
            </Link>
          </Grid>
        </Grid>
      </div>
      )
    }
    else {
      return (
        <form onSubmit={(e)=>e.preventDefault()} >
          <div style={{textAlign:"center", display:"inline-block"}}>
          <Grid container
            justify="center"
            alignItems="stretch"
            direction="column"
            spacing={24}
          >
            <Grid item>
              <Typography style={{textAlign:"right"}}><Link className="link" to="/login/new">New User</Link>{' '} 
                  or <Link className="link" to="/login/returning">Restore User</Link></Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5">
                Welcome to the Tarasca Trading Card Game
              </Typography>
            </Grid>
            <Grid item>
                  <Typography style={{textAlign:"left"}}>Select User</Typography>
                  <NativeSelect fullWidth
                      value={this.state.selectedOption}
                      input={<OutlinedInput fullWidth name="user" id="user" labelWidth={10}/>}
                      onChange={(event) => {
                        this.setState({selectedOption:event.target.value})
                        this.props.setUser(event.target.value)}
                      } 
                    >
                      {options.map((option)=>(<option key={option.value} value={option.value}>{option.label}</option>))}
                  </NativeSelect>                               
            </Grid>
            <Grid item>
                <TextField fullWidth
                  id="pin"
                  label="PIN"
                  disabled={this.props.user && !this.props.user.usePin}
                  value={this.props.user && this.props.user.usePin?this.state.inPin:"Not required"}
                  onChange={(e)=>{
                    let value = e.target.value;
                    self.setState(
                      {inPin:value})}}
                  type="tel"
                  inputProps={{style:{fontFamily: 'password-mask'},className:'numeric-password'}}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                  variant="outlined" 
                  error={this.state.loginStatus.invalid} 
                  helperText={this.state.loginStatus.error}
                  autoComplete="off"
                />                
            </Grid>
            <Grid item>
                <Button fullWidth variant="outlined" type="submit" onClick={(event) => this.login(event)}>
                  Enter
                </Button>
            </Grid>
          </Grid>
        </div>
      </form>
      );
    }
  }
}

export default withRouter(LoginForm);