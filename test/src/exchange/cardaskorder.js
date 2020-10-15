import React, { Component } from 'react';
import {secretPhraseToPublicKey,signTransactionBytes} from 'ardorjs';
import Grid from '@material-ui/core/Grid';
import {validatePrice, validatePassPhrase, validateQuantity} from '../common/validators';
import axios from 'axios';
import qs from 'qs';

import TextField from '@material-ui/core/TextField';
import {getAskOrders, getBidOrders, getIgnisBalance } from '../common/ardorinterface';
import {SignActionField} from '../common/signactionfield';
import { fetchCard } from '../common/common';
import { CardInfo, CardImageNoButton } from '../common/cardinfo';
import { Typography } from '@material-ui/core';

import { NQTDIVIDER } from '../common/constants';
import { TxSuccess } from '../common/txsuccess';
import {OrderBooks} from './orderbook';


const ORDERTYPE = "placeAskOrder"



class PlaceAskOrderForm extends Component {
  constructor (props){
    super(props);
    this.state = {
      bought:false,
      priceNQTPerShare:1.00,
      priceNQTPerShareStatus:{invalid:undefined,error:''},

      passPhrase:"",
      passPhraseStatus:{invalid:undefined,error:''},

      tradeQuantityQNT:1,
      tradeQuantityQNTStatus:{invalid:false,error:''},

      maxPrice:undefined,
      formValid:false,

    };
    this.placeOrder = this.placeOrder.bind(this);
    this.handlePassphraseChange = this.handlePassphraseChange.bind(this);
  }

  placeOrder(event){
    var self = this;
    console.log(self.state);
    let phraseValidated = validatePassPhrase(self.state.passPhrase,self.state.passPhraseStatus,self.props.user.accountRs);
    if  (phraseValidated.invalid){
      console.log("placeOrder(): passphrase invalid, exiting.")
      self.setState({passPhraseStatus:phraseValidated},this.validateForm);
      return;
    }
    console.log("placeOrder(): passphrase ok.")
    console.log('postOrder(): type:'+self.props.orderType);
    const publicKey = secretPhraseToPublicKey(self.state.passPhrase);
    const passPhrase = self.state.passPhrase;

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    var query = {
      requestType:self.props.orderType,
      asset:self.props.card.asset,
      priceNQTPerShare:self.state.priceNQTPerShare*NQTDIVIDER,
      publicKey:publicKey,
      chain:2,
      quantityQNT:self.state.tradeQuantityQNT,
      feeNQT:-1,
      feeRateNQTPerFXT: -1,
      deadline:15,
      broadcast:false,
    }

    console.log('get minimumFee');
    const url_postOrder = self.props.nodeurl+'?requestType='+ORDERTYPE;
    const url_broadcast = self.props.nodeurl+'?requestType=broadcastTransaction';
    axios.post(url_postOrder, qs.stringify(query), config)
          .then(function(response) {
            //query.feeNQT = JSON.parse(data).minimumFeeFQT;response.data.minimumFeeFQT *response.data.bundlerRateNQTPerFXT*0.00000001;

            query.feeNQT = response.data.minimumFeeFQT*response.data.bundlerRateNQTPerFXT*0.00000001;
            query.broadcast = false;
            console.log('get transactionBytes');
            axios.post(url_postOrder, qs.stringify(query), config)
              .then(function(response){
                const signed = signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                let txdata = {transactionBytes:signed};
                console.log("sending signed transaction");
                axios.post(url_broadcast, qs.stringify(txdata), config)
                    .then(function(response){
                      console.log(response);
                      self.setState({response:response,responseTime:response.data.requestProcessingTime,bought:true,status:"success"});
                    })
              })
          })
          .catch(function (error) {
            console.log('ohje refresh state:');
            console.log(error.message);
            self.setState({status:"ERROR"})
          });
  }


  validateForm() {
    //console.log(this.state);
    this.setState({formValid: (this.state.tradeQuantityQNTStatus.invalid===false) && (this.state.passPhraseStatus.invalid===false) && (this.state.priceNQTPerShareStatus.invalid===false)});
  }

  
  handlePriceChange(event){
    let value = event.target.value;
    let max=this.props.orderType==="placeBidOrder" ? this.state.maxPrice : undefined;
    let min=0;
    this.setState(
      {priceNQTPerShare:value},
      ()=> {let fieldStatus = validatePrice(value,max,min,this.state.priceNQTPerShareStatus);
            this.setState({priceNQTPerShareStatus:fieldStatus},this.validateForm);}
    );
  }


  handlePassphraseChange(value){
    this.setState(
      {passPhrase:value},
      ()=>{let fieldStatus = validatePassPhrase(value,this.state.passPhraseStatus);
            this.setState({passPhraseStatus:fieldStatus},this.validateForm);}
    );
  }


  handleQuantityChange(event){
    let value = event.target.value;
    let max=this.props.orderType==="placeAskOrder" ? this.props.card.quantityQNT : undefined;
    let min=1;
    this.setState(
      {tradeQuantityQNT:value},
      ()=>{let fieldStatus = validateQuantity(value,max,min,this.state.tradeQuantityQNTStatus);
            this.setState({tradeQuantityQNTStatus:fieldStatus},this.validateForm);}
    );
  }


  componentDidUpdate(){
    let newMax = (this.props.wallet.balanceNQT/this.props.NQTdivider)/this.state.tradeQuantityQNT;
    if (isNaN(newMax) === false & newMax !== this.state.maxPrice) {
      this.setState({maxPrice:newMax});
    }
  }


  render(){
    //console.log(this.state);
    //console.log(this.props);
    if (!this.state.bought){
      if (this.props.card.quantityQNT<1){
        return(
          <Typography variant="body1">
            Insufficient balance to create an ask order.
          </Typography>
        )
      }
      return (
        <form onSubmit={(event)=>{event.preventDefault();this.placeOrder()}}>
          <Grid container spacing={24} 
                  justify="center"
                  alignItems="center"
                  direction="column">
            <Grid item>
                <TextField invalid={this.state.tradeQuantityQNTStatus.invalid} 
                    type="number" 
                    name="tradeQuantityQNT"
                    label={"Amount of Cards (max: "+this.props.card.quantityQNT+")"}
                    error={this.state.tradeQuantityQNTStatus.invalid}
                    helperText={this.state.tradeQuantityQNTStatus.error}
                    variant="outlined"
                    InputLabelProps={{
                      type:"number",
                      shrink: true
                    }}
                    id="priceNQTPerShare" onChange={(event) => this.handleQuantityChange(event)}
                    value={this.state.tradeQuantityQNT}
                    placeholder="Enter price" />
              </Grid>
              <Grid item>
                <TextField invalid={this.state.priceNQTPerShareStatus.invalid} 
                    type="number" 
                    name="priceNQTPerShare"
                    label={"Price per Card"}
                    variant="outlined"
                    InputLabelProps={{
                      type:"number",
                      shrink: true
                    }}
                    id="priceNQTPerShare" onChange={(event) => this.handlePriceChange(event)}
                    value={this.state.priceNQTPerShare}
                    error={this.state.priceNQTPerShareStatus.invalid} 
                    helperText={this.state.priceNQTPerShareStatus.error}
                    placeholder="Enter price (IGNIS)" />
              </Grid>
              <Grid item>
                <SignActionField  {...this.props} {...this.state}
                    handlePassphraseChange={this.handlePassphraseChange}
                    action={this.placeOrder}/>
              </Grid>
          </Grid>
        </form>
      )
    }
    else {
       return (<TxSuccess response={this.state.response}/>)
    }
  }
}


export class PlaceAskOrder extends Component {
  constructor (props){
    super(props);
    this.state={
      card:{},
      askOrders:[],
      bidOrders:[],
      wallet: {unconfirmedBalanceNQT:0, balanceNQT:0},
      response:{errorCode:undefined,error:""}
    }
    this.refresh = this.refresh.bind(this);
  }


  refresh(){
    console.log("cardAskOrder refresh()");
    var self = this;

    fetchCard(this.props.nodeurl,this.props.user.accountRs,this.props.match.params.asset)
    .then((response)=>{
      self.setState({card:response});
      getAskOrders(this.props.nodeurl,response.asset)
      .then((response) => {
        self.setState({askOrders:response.askOrders});
      });
      getBidOrders(this.props.nodeurl,response.asset)
      .then((response) => {
        console.log(response);
        self.setState({bidOrders:response.bidOrders});
      });
    })
    .catch((err)=>{console.log(err)});

    getIgnisBalance(self.props.nodeurl,self.props.user.accountRs)
    .then(function(response){
        self.setState({wallet:response})
    });
  }

  componentDidMount(){
    this.refresh();
    this.timer = setInterval(this.refresh,9000);
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }


  render() {
    return (
        <Grid container
            justify="center"
            alignItems="stretch"
            direction="row"
            spacing={24}
        >
          <Grid item className="boxed" style={{marginTop: 10, marginBottom:10, backgroundColor:'rgb(16 57 43)', border:'1px solid', borderColor:'#ffffff3b'}}>
              <CardInfo card={this.state.card}/>
              <OrderBooks {...this.props}/>
          </Grid>
          <Grid item>
              <CardImageNoButton card={this.state.card}/>      
          </Grid>
          <Grid item className="boxed" style={{marginTop: 10, marginBottom:10, backgroundColor:'rgb(16 57 43)', border:'1px solid', borderColor:'#ffffff3b'}}>
            <Grid container spacing={8}
              justify="center"
              alignItems="center"
              direction="column"
            >
              <Grid item>
                <Typography variant="h4">Ask</Typography>
              </Grid>
              <Grid item>                
                <PlaceAskOrderForm {...this.state} {...this.props} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
    );
  }
}

