import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';

import { withSnackbar } from 'notistack';

import { LoginRoutes } from './login/login';
import {registerUser, getUser, getAllUsers, addToAllUsers} from './login/storage';

import {PrivateRoute, fakeAuth} from './login/auth';
import {Scanner} from './login/scanner';
import './App.css';
import { NODEURL, COLLECTIONACCOUNT } from './common/constants';
import { getBlockchainStatus } from './common/ardorinterface';
import GameRoutes from './game';



const gamezero = COLLECTIONACCOUNT;


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      nodeurl:NODEURL,
      epoch_beginning: new Date(),
      userList: getAllUsers(),
      user: {accountRs:"", name:"",usePin:false,token:""},
      collectionAccount: gamezero,
      blockchainStatus:{}
    }
    this.refresh = this.refresh.bind(this);
  }


  loadUser = (event) => {
    // event : user.name
    console.log(event);
    let user = getUser(event);
    this.setState({user:user});
  }


  setUser = (name) => {
    // event : user.name
    //console.log(event);
    let user = getUser(name);
    this.setState({user:user});
  }


  setCollection = (acc) => {
    console.log(acc);
    this.setState({collectionAccount:acc});
  }


  registerNewUser = (user) => {
    // user_phrase is user object with phrase instead of token.
    console.log(user);
    registerUser(user);
    addToAllUsers(user);
    this.setState({user:user,userList:getAllUsers()});
  }


  refresh(){
    var self = this;
    getBlockchainStatus(NODEURL)
    .then((response)=>{
      let EPOCH_BEGINNING = new Date(response.data.isTestnet ? Date.UTC(2017,11,26,14,0,0) : Date.UTC(2018,0,1,0,0,0));      
      console.log(EPOCH_BEGINNING);
      console.log(response);
      self.setState({blockchainStatus:response.data, epoch_beginning:EPOCH_BEGINNING});
    })
  }


  componentDidMount() {
    // If users already exist, load the first (that is also displayed), as current)
    if (this.state.userList.length>0){
      this.setUser(this.state.userList[0]);
    }
    this.refresh()
    //this.timer = setInterval(this.refresh, 12000)    
  }
  
  
  componentWillUnmount(){
    console.log("App: stop refresh");
    clearInterval(this.timer);
  }

  
  render(){
    console.log(this.state.user,'fasfasfasfasfas');
    return (
        <div style={{textAlign:"center", width:"100%"}}>
              <Switch>
                <Route path="/login" render={() => (
                      <LoginRoutes {...this.state}
                                    registerNewUser={this.registerNewUser}  
                                    setCollection={this.setCollection} 
                                    setUser={this.setUser} />)} />
                <Route path="/scanner" component={Scanner} />
                <PrivateRoute path="/game" component={GameRoutes} props={{...this.props,...this.state}}/>
                <Route exact path="/">
                  <Redirect to="/login"/>
                </Route>
                <Route path="/logout" render={()=>{ 
                      this.setState({collectionAccount:gamezero,userList: getAllUsers()});
                      fakeAuth.signout();
                      this.setUser(this.state.userList[0]);
                      return (<Redirect to="/login"/>)
                    }} />
              </Switch>
        </div>
    );
  }
}


export default withSnackbar(App);


                