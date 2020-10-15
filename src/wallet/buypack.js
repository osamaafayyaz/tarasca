import React, { Component } from 'react';
import {validatePassPhrase, validateQuantity} from '../common/validators';
import {sendIgnis,transferCurrency, transferCurrencyZeroFee} from '../common/ardorinterface';
import { SignActionField } from '../common/signactionfield';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import { CURRENCY, NQTDIVIDER, MAXPACKS, PACKPRICEGIFTZ, PACKPRICE } from '../common/constants';
import { TxSuccess } from '../common/txsuccess';



export class BuyPack extends Component {
  constructor (props){
    super(props);
    this.packPrice = PACKPRICE;
    this.packPriceGiftz = PACKPRICEGIFTZ;
    this.state = {
      selectedCurrency: 'Ignis',
      noPacks:1,
      noPacksStatus:{invalid:false,error:''},
      passPhrase:"",
      passPhraseStatus:{invalid:undefined,error:''},
      formValid:false,
      bought:false,
      responseTime:0
    };
    this.buyPack = this.buyPack.bind(this);
    this.handlePassphraseChange = this.handlePassphraseChange.bind(this);
    this.handleNoPacksChange = this.handleNoPacksChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  componentDidMount(){
    let availableFunds = Math.min(this.props.wallet.balanceNQT,this.props.wallet.unconfirmedBalanceNQT);
    let max= Math.min(((availableFunds/NQTDIVIDER)/PACKPRICE),MAXPACKS);
    let min=1;
    if (max<1.0){
      this.setState(
        {noPacks:this.state.noPacks},
        ()=>{let fieldStatus = {invalid:true, error:"Not enough funds to buy a pack"};
              this.setState({noPacksStatus:fieldStatus},this.validateForm);}
      )
    }
    this.validateForm();
  }

  buyPack() {
      var self = this;
      let phraseValidated = validatePassPhrase(self.state.passPhrase,self.state.passPhraseStatus,self.props.user.accountRs);
      if  (phraseValidated.invalid){
        console.log("buyPack(): passphrase invalid, exiting.")
        self.setState({passPhraseStatus:phraseValidated},this.validateForm);
        return;
      }
      console.log("buyPack(): passphrase ok.")
      const message = JSON.stringify({contract:"IgnisAssetLottery"});
      if (this.state.selectedCurrency === 'Ignis'){
        let amountNQT = this.state.noPacks*self.packPrice*NQTDIVIDER;
        sendIgnis(this.props.nodeurl, amountNQT, this.props.collectionAccount, this.state.passPhrase, message, true)
          .then(function(response){
            console.log(response);
            self.setState({response:response,responseTime:response.data.requestProcessingTime,bought:true,status:"success"});
          })
          .catch(function (error) {
              console.log('ohje sendIgnis (from buyPack Dialog):');
              console.log(error.message);
              self.setState({status:"ERROR"})
            });
      }
      else if (this.state.selectedCurrency === 'Giftz') {
        let unitsQNT =this.state.noPacks*self.packPriceGiftz;
        transferCurrency(this.props.nodeurl, this.props.collectionCurrency, unitsQNT, this.props.collectionIssuer, this.state.passPhrase, message, true)
        .then(function(response){
          console.log(response);
          self.setState({response:response,responseTime:response.data.requestProcessingTime,bought:true,status:"success"});
        })
        .catch(function (error) {
            console.log('ohje transferCurrency (from buyPack Dialog):');
            console.log(error.message);
            self.setState({status:"ERROR"})
          });
      }
  }


  validateForm() {
    this.setState({formValid: (this.state.passPhraseStatus.invalid===false) && (this.state.noPacksStatus.invalid===false)});
  }

  handleNoPacksChange(event){
    let value = event.target.value;
    let availableFunds = Math.min(this.props.wallet.balanceNQT,this.props.wallet.unconfirmedBalanceNQT);
    let max= Math.min(((availableFunds/NQTDIVIDER)/PACKPRICE),MAXPACKS);
    let min=1;
    if (max>=1.0){
      this.setState(
        {noPacks:value},
        ()=>{let fieldStatus = validateQuantity(value,max,min,this.state.noPacksStatus);
              this.setState({noPacksStatus:fieldStatus},this.validateForm);}
      )
    }
    else {
      this.setState(
        {noPacks:value},
        ()=>{let fieldStatus = {invalid:true, error:"Not enough funds to buy a pack"};
              this.setState({noPacksStatus:fieldStatus},this.validateForm);}
      )
    }
    this.setState({noPacks:event.target.value})    
  }


  handlePassphraseChange(event){
    //let value = event.target.value;
    let value = event;
    this.setState(
      {passPhrase:value},
      ()=>{let fieldStatus = validatePassPhrase(value,this.state.passPhraseStatus);
            this.setState({passPhraseStatus:fieldStatus},this.validateForm);}
    );
  }

  toggler(props){
    //this.setState({bought:false});
    this.props.toggle(!this.props.modalOpen);
  }

  render(){
    let totalPrice = this.state.noPacks*this.packPrice;
    if (this.state.bought){
      return (<TxSuccess/>)
    }
    else {
      return (
        <div style={{textAlign:"center", padding:20, width:"90%", maxWidth:"540px", display:"inline-block", paddingTop: 40}}>
          <form onSubmit={(event)=>{event.preventDefault();this.buyPack()}}>
              <Grid container
                justify="center"
                alignItems="stretch" 
                direction="column"
                spacing={24}
                className="boxed"
              >
                <Grid item style={{textAlign:"left"}}>
                  <Typography variant="display2">Buy a pack of cards</Typography>
                </Grid>
                <Grid item style={{textAlign:"left"}}>
                  <Typography variant="h6">Pay with Ignis</Typography>
                </Grid>
                <Grid item>
                  <TextField disabled
                    id="game"
                    fullWidth
                    label="Game Account"
                    helperText="The game's Ardor account ID"
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                      readOnly: true,
                      shrink: true,
                    }}
                    value={this.props.collectionAccount}
                  />
                </Grid>
                <Grid item>
                  <TextField fullWidth
                    id="outlined-number"
                    label="Number of packs"
                    value={this.state.noPacks}
                    onChange={(event)=>this.handleNoPacksChange(event)}
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    error={this.state.noPacksStatus.invalid}
                    helperText={this.state.noPacksStatus.error}
                  />
                </Grid>
                <Grid item style={{textAlign:"left"}}>
                  <Typography variant="h6">Total: {totalPrice} Ignis</Typography>
                </Grid>
                <Grid item>
                  <SignActionField  {...this.props}
                    {...this.state} 
                    handlePassphraseChange={this.handlePassphraseChange}
                    action={this.buyPack}
                  />
                </Grid>
              </Grid>
          </form>
        </div>
      )
    }
  }
}



export class BuyPackCurrency extends Component {
  constructor (props){
    super(props);
    this.packPrice = 26;
    this.packPriceGiftz = 1;
    this.state = {
      noPacks:1,
      noPacksStatus:{invalid:false,error:''},
      passPhrase:"",
      passPhraseStatus:{invalid:undefined,error:''},
      formValid:false,
      bought:false,
      responseTime:0
    };
    this.buyPack = this.buyPack.bind(this);
    this.handlePassphraseChange = this.handlePassphraseChange.bind(this);
    this.handleNoPacksChange = this.handleNoPacksChange.bind(this);
  }

  componentDidMount(){
    let availableGamma = Math.min(this.props.walletCurrency.unitsQNT,this.props.walletCurrency.unconfirmedUnitsQNT);
    let max= Math.min(((availableGamma)/PACKPRICEGIFTZ),MAXPACKS);
    let min=1;
    if (max<1){
      this.setState(
        {noPacks:this.state.noPacks},
        ()=>{let fieldStatus = {invalid:true, error:"Not enough GIFTZ to buy a pack"};
        this.setState({noPacksStatus:fieldStatus},this.validateForm);}
      )  
    }
    this.validateForm();
  }

  buyPack() {
      var self = this;
      let phraseValidated = validatePassPhrase(self.state.passPhrase,self.state.passPhraseStatus,self.props.user.accountRs);
      if  (phraseValidated.invalid){
        console.log("buyPack(): passphrase invalid, exiting.")
        self.setState({passPhraseStatus:phraseValidated},this.validateForm);
        return;
      }
      console.log("buyPack(): passphrase ok.")
      const message = JSON.stringify({contract:"IgnisAssetLottery"});
      let unitsQNT =this.state.noPacks*self.packPriceGiftz;
      if (this.props.wallet.balanceNQT < 0.1*NQTDIVIDER){
        transferCurrencyZeroFee(this.props.nodeurl, CURRENCY, unitsQNT, this.props.collectionAccount, this.state.passPhrase, message, true)
        .then(function(response){
          console.log(response);
          self.setState({response:response,responseTime:response.data.requestProcessingTime,bought:true,status:"success"});
        })
        .catch(function (error) {
            console.log('ohje transferCurrencyZeroFee (from buyPack Dialog):');
            console.log(error.message);
            self.setState({status:"ERROR"})
          });
      }
      else {
        transferCurrency(this.props.nodeurl, CURRENCY, unitsQNT, this.props.collectionAccount, this.state.passPhrase, message, true)
        .then(function(response){
          console.log(response);
          self.setState({response:response,responseTime:response.data.requestProcessingTime,bought:true,status:"success"});
        })
        .catch(function (error) {
            console.log('ohje transferCurrency (from buyPack Dialog):');
            console.log(error.message);
            self.setState({status:"ERROR"})
        });
      }
  }


  validateForm() {
    this.setState({formValid: (this.state.passPhraseStatus.invalid===false) && (this.state.noPacksStatus.invalid===false)});
  }

  handleCurrencyChange(changeEvent) {
    this.setState({
      selectedCurrency: changeEvent.target.value
    });
  }

  handleNoPacksChange(event){
    let value = event.target.value;
    let availableGamma = Math.min(this.props.walletCurrency.unitsQNT,this.props.walletCurrency.unconfirmedUnitsQNT);
    let max= Math.min(((availableGamma)/PACKPRICEGIFTZ),MAXPACKS);
    let min=1;
    if (max>=1){
      this.setState(
        {noPacks:value},
        ()=>{let fieldStatus = validateQuantity(value,max,min,this.state.noPacksStatus);
              this.setState({noPacksStatus:fieldStatus},this.validateForm);}
      )
    }
    else {
      this.setState(
        {noPacks:value},
        ()=>{let fieldStatus = {invalid:true, error:"Not enough GIFTZ to buy a pack"};
        this.setState({noPacksStatus:fieldStatus},this.validateForm);}
      )
    }
    this.setState({noPacks:event.target.value})
  }

  handlePassphraseChange(event){
    //let value = event.target.value;
    let value = event;
    this.setState(
      {passPhrase:value},
      ()=>{let fieldStatus = validatePassPhrase(value,this.state.passPhraseStatus);
            this.setState({passPhraseStatus:fieldStatus},this.validateForm);}
    );
  }

  toggler(props){
    //this.setState({bought:false});
    this.props.toggle(!this.props.modalOpen);
  }

  render(){
    let totalPrice = this.state.noPacks*this.packPriceGiftz;
    if (this.state.bought){
      return (<TxSuccess/>)
    }
    else {
      return (
        <div style={{textAlign:"center", padding:20, width:"90%", maxWidth:"540px", display:"inline-block", paddingTop: 40}}>
          <form onSubmit={(event)=>{event.preventDefault();this.buyPack()}}>
              <Grid container
                justify="center"
                alignItems="stretch" 
                direction="column"
                spacing={24}
                className="boxed"
              >
                <Grid item style={{textAlign:"left"}}>
                  <Typography variant="display2">Buy a pack of cards</Typography>
                </Grid>
                <Grid item style={{textAlign:"left"}}>
                  <Typography variant="h6">Pay with GIFTZ</Typography>
                </Grid>
                <Grid item>
                  <TextField disabled
                    id="game"
                    fullWidth
                    label="Game Account"
                    helperText="The game's Ardor account ID"
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                      readOnly: true,
                      shrink: true,
                    }}
                    value={this.props.collectionAccount}
                  />
                </Grid>
                <Grid item>
                  <TextField fullWidth
                    id="outlined-number"
                    label="Number of packs"
                    value={this.state.noPacks}
                    onChange={(event)=>this.handleNoPacksChange(event)}
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    variant="outlined" 
                    error={this.state.noPacksStatus.invalid}
                    helperText={this.state.noPacksStatus.error}
                  />
                </Grid>
                <Grid item style={{textAlign:"left"}}>
                  <Typography variant="body1">Total: {totalPrice} GIFTZ</Typography>
                </Grid>

                <Grid item>
                  <SignActionField  {...this.props}
                    {...this.state} 
                    handlePassphraseChange={this.handlePassphraseChange}
                    action={this.buyPack}
                  />
                </Grid>
              </Grid>
          </form>
        </div>
      )
    }
  }
}
