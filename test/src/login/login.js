import React from 'react';
import {Switch,Route,Link} from 'react-router-dom';

import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { MySnackbarContentNoClose } from '../common/snackbar';


import {getAllUsers} from './storage';
import {NewUser} from './new';
import {ReturningUser} from './returning';
import LoginForm from './loginform';

import logo from './images/tarasca_logo01_flat-white_transparent-480px.png';
import { fakeAuth } from './auth';


export const Login = (props) => {
  const users = getAllUsers();
  if (fakeAuth.isAuthenticated) console.log("user is authenticated");
  return (
    <div>
      {
        (users.length > 0) ? (
          <LoginForm {...props}/>
        ) : (
          <Landing/>
        )
      }
    </div>
    );
}

export const LoginRoutes = (props) => {
  console.log(props.blockchainStatus.isTestnet);
  //const users = getAllUsers();
      
  let testnetAlert = "";
  if (props.blockchainStatus.isTestnet){
    testnetAlert = (
          <MySnackbarContentNoClose 
            variant="warning"
            message="You're connected to Testnet"
          />
      
    )
  }
  
  return (
    <div className="App" style={{display:"inline-block", width:"100%"}}>
      <div className="boxed" style={{textAlign:"center", padding:20, width:"90%", maxWidth:"440px", display:"inline-block", backgroundColor:'rgb(16 57 43)', border:'1px solid', borderColor:'#ffffff3b', marginTop:40, marginBottom:40}}>
        <Grid container
          justify="center"
          alignItems="center"
          direction="column"
          spacing={24}
        >
          <Grid item>
            <img src={logo} alt="Logo" style={{width:"80%",maxWidth:"440px"}}/>  
          </Grid>
          <Grid item>
            <Switch>
              <Route exact path="/login" render={() => (<Login {...props}/>)}/>  
              <Route exact path="/login/new" render={() => <NewUser {...props} />}/>  
              <Route exact path="/login/returning" render={() => <ReturningUser {...props} />}/>        
            </Switch>
          </Grid>
          <Grid item>
            {testnetAlert}
          </Grid>
        </Grid>        
      </div>
    </div>
    );
}

          
export const Landing = () => (
  <div style={{textAlign:"center", padding:20, display:"inline-block"}}> 
    <Grid container
        justify="center"
        alignItems="center"
        direction="column"
        spacing={24}>
      <Grid item>
        <Typography variant="h5">Welcome to Tarasca Wallet</Typography>
      </Grid>
      <Grid item>
        <Link to="/login/new">
          <FormGroup>
            <Button variant="outlined">New User</Button>
          </FormGroup>
        </Link>
        <Typography variant="h6">or</Typography>
        <Link to="/login/returning">
          <FormGroup>
            <Button variant="outlined">
              Returning User?
            </Button>
          </FormGroup>
        </Link>
      </Grid>      
    </Grid>  
  </div>
);

