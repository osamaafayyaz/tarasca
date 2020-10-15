import React, {Component} from 'react';
import {Button, Input, FormGroup, FormFeedback, Form, Label} from 'reactstrap';
import {Link, withRouter} from 'react-router-dom';

import {encrypt} from './storage';
import { validatePin, validatePassPhrase, validatePhraseLength, validateUsername , validateAddress} from '../common/validators';
import { QrAccountField } from '../common/accountfield';



class Scanner_ extends Component {
  constructor(props) {
    super(props);
    this.state={
      name:"",
      nameStatus:{invalid:false,error:""},
      accountRs:"",
      accountRsStatus:{invalid:false,error:""},
      passPhrase:"",
      passPhraseStatus:{invalid:false,error:""},
      usePin:false,
      Pin:"",
      PinStatus:{invalid:false,error:""},
      formValid:false      
    }
  }

  onAccountChange = (e) => {
    console.log(e)
    var self = this;
    let value = e;
    this.setState({accountRs:value}, () => {
      self.setState({
          accountRsStatus:validateAddress(value,self.state.accountRsStatus)},
          self.validateForm)    
  })}

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
                    ? encrypt(this.state.passPhrase,this.statePin) : ""
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
      <div>
        <div className="text-muted" style={{textAlign:"right"}}><small><Link to="/login">Back to Login</Link>{' '} 
              or <Link to="/login/new">New User</Link></small></div>
        <h2>Scanner</h2>
        <Form>
          <FormGroup>
            <Label>
              Name
              <Input type="text" value={this.state.name} 
                    invalid={self.state.nameStatus.invalid}
                    onChange={this.onAccountChange}
                    />
                    <FormFeedback invalid={self.state.nameStatus.invalid}>
                      {self.state.nameStatus.error}
                    </FormFeedback>
            </Label>
          </FormGroup>
          <FormGroup>
            <Label>
              Account
              <QrAccountField value={this.state.accountRs} 
                            onChange={this.onAccountChange} 
                            status={this.state.accountRsStatus}/>
                    
                    
                  <FormFeedback invalid={self.state.accountRsStatus.invalid}>
                    {self.state.accountRsStatus.error}
                  </FormFeedback>
            </Label>
          </FormGroup>
          <FormGroup>
            <Label>
              Passphrase
              <Input type="textarea" value={self.state.passPhrase} rows="4"
                    invalid={this.state.passPhraseStatus.invalid}
                    onChange={(e)=>{
                      let value = e.target.value;
                      self.setState({passPhrase:value},()=>{
                        self.setState({
                        passPhraseStatus:validatePhraseLength(value,self.state.passPhraseStatus)},
                        self.validateForm)
                      })}}
                    />
                    <FormFeedback invalid={self.state.passPhraseStatus.invalid}>
                      {self.state.passPhraseStatus.error}
                    </FormFeedback>
            </Label>
          </FormGroup>
          <FormGroup>
            <Label>
              <input type="checkbox" name="usePin" checked={this.state.usePin}
                            onChange = {() => this.setState({usePin:!this.state.usePin},self.validateForm)}/>
              Store pass phrase on device.
            </Label>
          </FormGroup> 
          {
            this.state.usePin ? (
              <FormGroup>
                <Label>
                  PIN
                  <Input type="password" value={self.state.Pin} 
                          invalid={this.state.PinStatus.invalid}
                          onChange={(e)=>{
                            let value = e.target.value;
                            self.setState(
                              {Pin:value},
                              ()=>{
                                self.setState({PinStatus:validatePin(value,self.state.PinStatus)}, self.validateForm)
                              })}}
                          />
                          <FormFeedback invalid={this.state.PinStatus.invalid}>{self.state.PinStatus.error}</FormFeedback>
                </Label>                  
              </FormGroup>
              ) : null
          }
          <FormGroup>
            <Button disabled={!self.state.formValid} onClick={()=>this.onClick()}>
                Register User
            </Button>
          </FormGroup>
        </Form>
      </div>  
    );
  }
}

export const Scanner = withRouter(Scanner_);