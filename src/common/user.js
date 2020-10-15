import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { SignActionField } from './signactionfield';
import { PassphraseDialog } from './confirmdialog';
import { validatePassPhrase } from './validators';
import { setBackupDone, removeFromAllUsers } from '../login/storage';



class BackupPassphrase extends Component {
  constructor(props){
    super(props);
    this.state={
      dialogOpen:false,
      passPhrase:"",
      passPhraseStatus:{invalid:undefined,error:''}     
    }
    this.showPassphrase = this.showPassphrase.bind(this);
    this.handleConfirmed = this.handleConfirmed.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handlePassphraseChange = this.handlePassphraseChange.bind(this);
  }

  handleConfirmed(){
    setBackupDone(this.props.user.name);
    this.setState({dialogOpen:false})
  }
  
  handleToggle(){
    this.setState({dialogOpen:false})
  }

  handlePassphraseChange(event){
    let value = event;
    this.setState(
      {passPhrase:value},
      ()=>{let fieldStatus = validatePassPhrase(value,this.state.passPhraseStatus,this.props.user.accountRs);
            this.setState({passPhraseStatus:fieldStatus},this.validateForm);}
    );
  }

  showPassphrase(){
    console.log("showpassphrase");
    console.log(this.state);
    if (this.state.passPhraseStatus.invalid === false){
      this.setState({dialogOpen:true})
      //console.log(this.state.passPhrase);
    }    
  }

  render (){
    return (
      <div>
        <form onSubmit={(event)=>{event.preventDefault();this.showPassphrase()}}>
          <SignActionField  
                    user={this.props.user}
                    action={this.setDialogOpen}
                    label="Export Passphrase"
                    handlePassphraseChange={this.handlePassphraseChange}
          />
        </form>
        <PassphraseDialog open={this.state.dialogOpen}
                  passphrase={this.state.passPhrase}
                  handleConfirmed={this.handleConfirmed}
                  handleToggle={this.handleToggle}
        />
      </div>
    )
  }
    
}


class DeleteUser extends Component {
  constructor(props){
    super(props);
    this.state={
      passPhrase:"",
      passPhraseStatus:{invalid:undefined,error:''}     
    }
    this.deleteUser = this.deleteUser.bind(this);
    this.handlePassphraseChange = this.handlePassphraseChange.bind(this);
  }

  handlePassphraseChange(event){
    let value = event;
    this.setState(
      {passPhrase:value},
      ()=>{let fieldStatus = validatePassPhrase(value,this.state.passPhraseStatus,this.props.user.accountRs);
            this.setState({passPhraseStatus:fieldStatus},this.validateForm);}
    );
  }

  deleteUser(){
    console.log("deleteuser");
    console.log(this.state);
    if (this.state.passPhraseStatus.invalid === false){
      //deeeeeleeeeeteee
      removeFromAllUsers(this.props.user.name);
      this.props.history.push("/logout");
    }    
  }

  render (){
    return (
      <div>
        <form onSubmit={(event)=>{event.preventDefault();this.deleteUser()}}>
          <SignActionField  
                    user={this.props.user}
                    action={this.setDialogOpen}
                    label="Delete Account"
                    handlePassphraseChange={this.handlePassphraseChange}
          />
        </form>
      </div>
    )
  }
}


export const UserDisplay = (props) => {

  return(
    <div style={{textAlign:"center", padding:20, width:"90%", display:"inline-block", paddingTop:40}}>
      <Grid container
        justify="flex-start"
        direction="row"
        alignItems="stretch"
        spacing={24}
      >
        <Grid item xs={3} style={{marginRight:10}}>
          <Grid container
            justify="flex-start"
            direction="column"
            alignItems="stretch"
            spacing={24}
          >
            <Grid item className="boxed" style={{textAlign:"left",marginBottom:10}}>
              <Typography variant="display1">User</Typography>
              <Typography variant="h6">{props.user.name}</Typography>
              <Typography variant="display1">Your Ardor account</Typography>
              <Typography variant="h6">{props.user.accountRs}</Typography>
            </Grid>
            <Grid item className="boxed" style={{textAlign:"left"}}>
                <Typography variant="display1">Disclaimer</Typography>
                <Typography component="p">This is a blockchain based game and your user and password details are not stored on a tarasca server. Actually, there is no tarasca server at the moment.</Typography>
                <Typography component="p">Your user information is stored on the device you're using at the moment.</Typography>
                <Typography component="p">If you ever lose this device, your cards and funds may be lost.</Typography>
                <Typography component="p">If others use this device, this is a potential security risk.</Typography>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={4}>
          <Grid container
            justify="flex-start"
            direction="column"
            alignItems="stretch"
            spacing={24}
          > */}
            {
              props.user.usePin ? (
                <Grid item xs={4} className="boxed" style={{textAlign:"left"}}>
                  <Typography variant="display1">Backup Your Passphrase</Typography>
                  <Typography>
                    Risk of loosing your funds and cards: You store your pass phrase on device. You should export the passphrase and store it somewhere safe.
                  </Typography>
                  <Typography>
                    The passphrase is stored encrypted, however you shouldnt use the game wallet for significant funds. If you ever give this device to somebody else, you should delete your information from it.
                  </Typography>
                  <BackupPassphrase {...props}/>
                </Grid>
              ) : 
                <Grid item xs={4} className="boxed" style={{textAlign:"left"}}>
                    <Typography>
                      You don't store your pass phrase on device.
                    </Typography>
                </Grid>
            }
            <Grid item xs={4} className="boxed" style={{marginLeft:10}}>
              <Typography variant="display1">Delete your Account from Device</Typography>
              <Typography>
                This deletes stored information from this device. Your account remains available on the network, use Backup Passphrase to save your private key for later use.
              </Typography>
              <DeleteUser {...props}/>
            </Grid>
          {/* </Grid>
        </Grid> */}
      </Grid>
    </div>
  )
}