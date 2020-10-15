
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {transferAsset} from './ardorinterface';
import {validateAddress,validatePassPhrase,validateQuantity} from './validators';

import {SignActionField} from './signactionfield';
import {QrAccountField} from './accountfield';
import { fetchCard } from './common';
import { CardInfo, CardImage } from './cardinfo';
import { Typography } from '@material-ui/core';
import {TxSuccess} from './txsuccess';


export function SendForm(props){
  return(
    <form onSubmit={(event)=>{event.preventDefault();props.handleSendCard()}}>
      <Grid container
        justify="center"
        alignItems="stretch"
        direction="column" 
        spacing={24} 
      >
        <Grid item>
          <Typography variant="h4">Send card</Typography>              
        </Grid>
        <Grid item>
          <TextField fullWidth 
                  invalid={props.noCardsStatus.invalid} 
                  type="number" 
                  name="noCards"
                  label={"Number of Cards (max: "+props.card.quantityQNT+")"}
                  variant="outlined"
                  InputLabelProps={{
                    type:"number",
                    shrink: true
                  }}
                  id="noCards" onChange={(event) => props.handleNoCardsChange(event)}
                  value={props.noCards}
                  placeholder="Number of cards you want to send" />
          <Typography>{props.noCardsStatus.error}</Typography>
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
                            action={props.handleSendCard}
                            />
        </Grid>      
      </Grid>
    </form>
  )
}



export class SendCard extends Component {
  constructor (props){
    console.log(props);
    super(props);
    this.state = {
      card:{},
      noCards:1,
      noCardsStatus:{invalid:false,error:''},
      passPhrase:"",
      passPhraseStatus:{invalid:undefined,error:''},
      receiverRS:"",
      receiverRsStatus:{invalid:undefined,error:''},
      message:"not yet implemented",
      displayQrReader:false
    };
    this.sendCard = this.sendCard.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  refresh(){
    var self = this;
    fetchCard(this.props.nodeurl,this.props.user.accountRs,this.props.match.params.asset)
    .then((response)=>{
      self.setState({card:response});
    })
    .catch((err)=>{console.log(err)});
  }

  componentDidMount(){
    this.refresh();
    this.timer = setInterval(this.refresh,9000);
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }


  sendCard(event) {
      var self = this;
      console.log(self);
      let phraseValidated = validatePassPhrase(self.state.passPhrase,self.state.passPhraseStatus,self.props.user.accountRs);
      if  (phraseValidated.invalid){
        console.log("sendCard(): passphrase invalid, exiting.")
        self.setState({passPhraseStatus:phraseValidated},this.validateForm);
        return;
      }
      console.log("sendCard(): passphrase ok.")
      console.log('send '+self.state.noCards+' cards.');
      console.log('get publicKey');
      
      transferAsset(self.props.nodeurl,self.state.card.asset,self.state.noCards,self.state.receiverRS,self.state.passPhrase)
      .then(function(response) {
        self.setState({response:response,responseTime:response.data.requestProcessingTime,bought:true,status:"success"});
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  validateForm() {
    this.setState({formValid: (this.state.passPhraseStatus.invalid===false) && (this.state.noCardsStatus.invalid===false) && (this.state.receiverRsStatus.invalid===false)});
  }

  handlePassphraseChange(event){
    let value = event;
    this.setState(
      {passPhrase:value},
      ()=>{let fieldStatus = validatePassPhrase(value,this.state.passPhraseStatus);
            this.setState({passPhraseStatus:fieldStatus},this.validateForm);}
    );
  }

  handleNoCardsChange(event){
    let value = event.target.value;
    let max=this.state.card.quantityQNT;
    let min=1;
    this.setState(
      {noCards:value},
      ()=>{let fieldStatus = validateQuantity(value,max,min,this.state.noCardsStatus);
            this.setState({noCardsStatus:fieldStatus},this.validateForm);}
    );
  }

  // handlePassphraseChange(event){
  //     this.setState({passPhrase:event.target.value})
  // }

  handleReceiverRsChange(value){
      //let value = event.target.value;
      this.setState(
          {receiverRS:value},
          ()=>{let fieldStatus = validateAddress(value,this.state.receiverRsStatus);
              this.setState({receiverRsStatus:fieldStatus},this.validateForm);}
      );
  }

  toggler(props){
    this.setState({bought:false});
    this.props.toggle(!this.props.modalOpen);
  }

  render(){
    console.log(this.state);
    return(
      <div style={{textAlign:"center", padding:20, width:"90%", display:"inline-block"}}>
        <Grid container
          justify="center"
          alignItems="stretch"
          direction="row"
          spacing={24}
        >
          <Grid item className="boxed" style={{marginTop: 10, marginBottom:10, backgroundColor:'rgb(16 57 43)', border:'1px solid', borderColor:'#ffffff3b'}}>
            <CardInfo card={this.state.card}/>    
          </Grid>
          <Grid item>
            <CardImage card={this.state.card}/>      
          </Grid>
          <Grid item className="boxed" style={{marginTop: 10, marginBottom:10, backgroundColor:'rgb(16 57 43)', border:'1px solid', borderColor:'#ffffff3b'}}>
          { this.state.bought ? (
              <TxSuccess/>
            ):(
              <SendForm {...this.state}
                      {...this.props}
                      handleNoCardsChange={(event) => this.handleNoCardsChange(event)}
                      handlePassphraseChange={(event)=> this.handlePassphraseChange(event)}
                      handleReceiverRsChange={(event)=> this.handleReceiverRsChange(event)}
                      handleSendCard={()=>this.sendCard()}
                      openQRCamera={this.openQRCamera}
                      handleToggle={this.toggler}
                      formValid={this.state.formValid}/>
            )
          }          
          </Grid>
        </Grid>
      </div>
    )
  }
}

