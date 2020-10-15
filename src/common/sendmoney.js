//sendmoney

import React, { Component } from 'react';
import {sendIgnis, transferCurrency, transferCurrencyZeroFee} from './ardorinterface';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {validateAddress,validatePassPhrase,validateQuantity} from './validators';

import {SignActionField} from './signactionfield';
import {QrAccountField} from './accountfield';
import { NQTDIVIDER,CURRENCY } from './constants';
import {TxSuccess} from './txsuccess';
import { Typography } from '@material-ui/core';
import { round } from './common';


function SendCoinsForm(props){
  const ignisAvailableBalance = Math.min(props.wallet.balanceNQT,props.wallet.unconfirmedBalanceNQT)/NQTDIVIDER;
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
            <Typography variant="display2">Send Coins</Typography>
          </Grid>
          <Grid item>
              <TextField fullWidth
                  invalid={props.amountNQTStatus.invalid} 
                  type="number" 
                  name="amountNQT"
                  label={"Amount to send (max:"+round(ignisAvailableBalance,2)+")"}
                  variant="outlined"
                  InputLabelProps={{
                    type:"number",
                    shrink: true
                  }}
                  id="priceNQTPerShare" onChange={(event) => props.handleAmountChange(event)}
                  value={props.amount}
                  error={props.amountNQTStatus.error}
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


export class SendIgnis extends Component {
  constructor (props){
    super(props);
    this.state = {
      passPhrase:"",
      passPhraseStatus:{invalid:undefined,error:''},
      receiverRS:"",
      receiverRsStatus:{invalid:undefined,error:''},
      amountNQT:1,
      amountNQTStatus:{invalid:undefined,error:""},
      message:"not yet implemented",
      bought:false,
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
      console.log('sendCoin(): passphrase OK, sendIgnis');
      let amount = self.state.amountNQT*NQTDIVIDER;
      sendIgnis(self.props.nodeurl, amount, self.state.receiverRS, self.state.passPhrase, "")
          .then(function(response){
            self.setState({response:response,responseTime:response.data.requestProcessingTime,bought:true,status:"success"});
          })
          .catch(function(error) {
            console.log("error caught!");
            console.log(error);
          });

  }

  validateForm() {
    this.setState({formValid: (this.state.passPhraseStatus.invalid===false) && (this.state.amountNQTStatus.invalid===false) && (this.state.receiverRsStatus.invalid===false)});
  }

  handlePassphraseChange(value){
    this.setState(
      {passPhrase:value},
      ()=>{let fieldStatus = validatePassPhrase(value,this.state.passPhraseStatus);
            this.setState({passPhraseStatus:fieldStatus},this.validateForm);}
    );
  }

  handleAmountChange(event){
    let value = event.target.value;
    let max=Math.min(this.props.wallet.balanceNQT,this.props.wallet.unconfirmedBalanceNQT)/NQTDIVIDER;
    let min=1;
    this.setState(
      {amountNQT:value},
      ()=>{let fieldStatus = validateQuantity(value,max,min,this.state.amountNQTStatus);
            this.setState({amountNQTStatus:fieldStatus},this.validateForm);}
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
          <SendCoinsForm amountNQT={this.state.amountNQT}
                    amountNQTStatus={this.state.amountNQTStatus}
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
                    wallet={this.props.wallet}
                    NQTdivider={this.props.NQTdivider}
                    formValid={this.state.formValid}
                    {...this.props}/>
      )
    }
    else {
      return (<TxSuccess responseTime={this.state.responseTime}/>)
    }
  }
}


