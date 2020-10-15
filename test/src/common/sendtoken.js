//sendmoney

import React, { Component } from 'react';
import {transferCurrency, transferCurrencyZeroFee} from './ardorinterface';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {validateAddress,validatePassPhrase,validateQuantity} from './validators';

import {SignActionField} from './signactionfield';
import {QrAccountField} from './accountfield';
import { NQTDIVIDER,CURRENCY } from './constants';
import {TxSuccess} from './txsuccess';
import { Typography } from '@material-ui/core';



function SendTokenForm(props){
  //console.log(props);
  return(
      <div style={{textAlign:"center", padding:20, width:"90%", maxWidth:"540px", display:"inline-block", paddingTop: 40}}>
        <form onSubmit={(event)=>{event.preventDefault();props.handleSendCoin()}}>
        <Grid container
          justify="center"
          alignItems="stretch" 
          direction="column"
          spacing={24} 
          className="boxed"
        >
            <Grid item style={{textAlign:"left"}}>
              <Typography variant="display2">Send Tokens</Typography>
            </Grid>
            <Grid item>
              <TextField fullWidth 
                    invalid={props.unitsQNTStatus.invalid} 
                    type="number" 
                    name="amountNQT"
                    label={"Amount to send (max. "+props.walletCurrency.unitsQNT+")"}
                    variant="outlined"
                    InputLabelProps={{
                      type:"number",
                      shrink: true
                    }}
                    id="priceQNTPerShare" onChange={(event) => props.handleAmountChange(event)}
                    value={props.unitsQNT}
                    error={props.unitsQNTStatus.error}
                    placeholder="Enter amount to send" />
            </Grid>
            <Grid item>  
                <QrAccountField value={props.receiverRS} 
                              status={props.receiverRsStatus} 
                              onChange={props.handleReceiverRsChange}>
                  Recipient
                </QrAccountField>                         
            </Grid>
            <Grid item>            
                <SignActionField  {...props} 
                                action={props.handleSendCoin}
                                />            
            </Grid>
          </Grid>
        </form>
      </div>
    )
}


export class SendToken extends Component {
  constructor (props){
    super(props);
    this.state = {
      passPhrase:"",
      passPhraseStatus:{invalid:undefined,error:''},
      receiverRS:"",
      receiverRsStatus:{invalid:undefined,error:''},
      unitsQNT:1,
      unitsQNTStatus:{invalid:undefined,error:""},
      message:"not yet implemented",
      displayQrReader:false
    };
    this.sendCoin = this.sendCoin.bind(this);
    //this.readQR = this.sendCard.bind(this);
    //this.openQRCamera = this.openQRCamera.bind(this);
    this.toggler = this.toggler.bind(this);
  }

  sendCoin(event) {
      var self = this;
      let phraseValidated = validatePassPhrase(self.state.passPhrase,self.state.passPhraseStatus,self.props.user.accountRs);
      if  (phraseValidated.invalid){
        console.log("sendCoin(): passphrase invalid, exiting.")
        self.setState({passPhraseStatus:phraseValidated},this.validateForm);
        return;
      }

      console.log('sendCoin() calling transferCurrency');
      // transferCurrency(self.props.nodeurl, CURRENCY, self.state.unitsQNT, self.state.receiverRS, self.state.passPhrase, "")
      //     .then(function(response){
      //       self.setState({response:response,responseTime:response.data.requestProcessingTime,bought:true,status:"success"});
      //     });


      if (this.props.wallet.balanceNQT < 0.1*NQTDIVIDER){
        transferCurrencyZeroFee(self.props.nodeurl, CURRENCY, self.state.unitsQNT, self.state.receiverRS, self.state.passPhrase, "")
        .then(function(response){
          console.log(response);
          self.setState({response:response,responseTime:response.data.requestProcessingTime,bought:true,status:"success"});
        })
        .catch(function (error) {
            console.log('ohje transferCurrencyZeroFee (from sendmoney Dialog):');
            console.log(error.message);
            self.setState({status:"ERROR"})
          });
      }
      else {
        transferCurrency(self.props.nodeurl, CURRENCY, self.state.unitsQNT, self.state.receiverRS, self.state.passPhrase, "")
        .then(function(response){
          console.log(response);
          self.setState({response:response,responseTime:response.data.requestProcessingTime,bought:true,status:"success"});
        })
        .catch(function (error) {
            console.log('ohje transferCurrency (from sendmoney Dialog):');
            console.log(error.message);
            self.setState({status:"ERROR"})
        });
      }
  }

  validateForm() {
    this.setState({formValid: (this.state.passPhraseStatus.invalid===false) && (this.state.unitsQNTStatus.invalid===false) && (this.state.receiverRsStatus.invalid===false)});
  }

  handlePassphraseChange(value){
    //let value = event.target.value;
    this.setState(
      {passPhrase:value},
      ()=>{let fieldStatus = validatePassPhrase(value,this.state.passPhraseStatus);
            this.setState({passPhraseStatus:fieldStatus},this.validateForm);}
    );
  }

  handleAmountChange(event){
    let value = event.target.value;
    let max=this.props.walletCurrency.unitsQNT;
    let min=1;
    this.setState(
      {unitsQNT:value},
      ()=>{let fieldStatus = validateQuantity(value,max,min,this.state.unitsQNTStatus);
            this.setState({unitsQNTStatus:fieldStatus},this.validateForm);}
    );
  }

  handleReceiverRsChange(value){
      this.setState(
          {receiverRS:value},
          ()=>{let fieldStatus = validateAddress(value,this.state.receiverRsStatus);
              this.setState({receiverRsStatus:fieldStatus},this.validateForm);}
      );
  }

  toggler(props){
    this.setState({bought:false});
    this.props.toggleModal();
  }

  render(){
    if (!this.state.bought){
      return (
          <SendTokenForm unitsQNT={this.state.unitsQNT}
                    unitsQNTStatus={this.state.unitsQNTStatus}
                    passPhrase={this.state.passPhrase}
                    passPhraseStatus={this.state.passPhraseStatus}
                    receiverRS={this.state.receiverRS}
                    receiverRsStatus={this.state.receiverRsStatus}
                    handleAmountChange={(event) => this.handleAmountChange(event)}
                    handlePassphraseChange={(event)=> this.handlePassphraseChange(event)}
                    handleReceiverRsChange={(event)=> this.handleReceiverRsChange(event)}
                    handleSendCoin={()=>this.sendCoin()}
                    openQRCamera={this.openQRCamera}
                    handleToggle={this.toggler}
                    walletCurrency={this.props.walletCurrency}
                    formValid={this.state.formValid}
                    {...this.props}/>
      )
    }
    else {
      return (<TxSuccess/>
      )
    }
  }
}
