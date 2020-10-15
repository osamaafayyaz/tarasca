// game routes
import React, {Component, Fragment} from 'react';
import {Route, Switch} from 'react-router-dom'

import { Wallet } from './wallet/wallet';
import { SendCard } from './common/sendcard';
import { CardDetail } from './wallet/carddetail';
import { SendIgnis } from './common/sendmoney';
import { SendToken} from './common/sendtoken';
import { ShowQrCode } from './wallet/showqrcode';
import { BuyPack, BuyPackCurrency } from './wallet/buypack';
import { UserDisplay } from './common/user';
import { FundAccount } from './wallet/fundaccount';
import { Jackpot } from './wallet/jackpot';
import { Exchange } from './exchange/exchange';
import { CancelAskOrder, CancelBidOrder } from './exchange/cancel';
import { PlaceOrder } from './exchange/cardorder';
import { TxHistory } from './common/txhistory';
import { COLLECTIONACCOUNT, NODEURL, CURRENCY, NQTDIVIDER } from './common/constants';
import { getBlockchainTransactions, getUnconfirmedTransactions, getTrades } from './common/ardorinterface';
import { fetchCards } from './common/common';
import { Faq } from './common/faq';

import NavBar from './common/navigation';
import {getIgnisBalance, getAccountCurrencies, getAccount} from './common/ardorinterface';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import { withSnackbar } from 'notistack';
import { updateTimestamp, getTimestamp, getBackupDone } from './login/storage';
import { MonsterPage } from './wallet/monsterpage';
import { TarascaPage } from './wallet/tarasca';



class GameRoutes extends Component {
  constructor(props){
    super(props);
    this.state = {
      blockchainTransactions:[],
      unconfirmedTransactions:[],
      trades:[],
      collectionCards:[],
      showAllCards:false,
      userIsNew:false,
      collectionCompleted:{complete:false,missingAssets:[],blockedAssets:[]},
      wallet: {unconfirmedBalanceNQT:0, balanceNQT:0},
      walletCurrency: {unconfirmedUnitsQNT:0, unitsQNT:0},
      lastUpdate:{newTx:0,newTrades:0,timestamp:undefined,timestampTrades:undefined}
    }
    this.toggleShowAllCards = this.toggleShowAllCards.bind(this);    
    this.snackIt = this.snackIt.bind(this);
    this.confirmedSnack = this.confirmedSnack.bind(this);
    this.refresh = this.refresh.bind(this);
    this.snackMissedTx = this.snackMissedTx.bind(this);
    this.resetNewTx = this.resetNewTx.bind(this);
    this.resetNewTrades = this.resetNewTrades.bind(this);
    this.snackTrades = this.snackTrades.bind(this);
    this.snackBackup = this.snackBackup.bind(this);
  }

  toggleShowAllCards(){
    console.log("toggleShowAllCards, current setting: "+this.state.showAllCards);
    this.setState({showAllCards:!this.state.showAllCards});
  }

  resetNewTx(){
    let lastUpdate = this.state.lastUpdate;
    lastUpdate.newTx = 0;
    lastUpdate.timestamp = this.state.blockchainTransactions[0].blockTimestamp;
    this.setState({lastUpdate:lastUpdate});
  }

  resetNewTrades(){
    let lastUpdate = this.state.lastUpdate;
    lastUpdate.newTrades = 0;
    lastUpdate.timestampTrades = this.state.trades[0].timestamp;
    this.setState({lastUpdate:lastUpdate});
  }

  refresh(){
    var self= this;
    getAccount(self.props.nodeurl,self.props.user.accountRs)
    .then((response)=>{
      if (response.data.errorCode ===4 || response.data.errorCode ===5){
        self.setState({userIsNew:true})
      }
    })
    
    getIgnisBalance(self.props.nodeurl,self.props.user.accountRs)
    .then(function(response){
        self.setState({wallet:response})
    });
  
    getAccountCurrencies(self.props.nodeurl,self.props.user.accountRs,CURRENCY)
    .then(function(response){
      //console.log(response)
      if (Object.keys(response).length>0){
        self.setState({walletCurrency:response})
      }
    });

    getBlockchainTransactions(NODEURL,2,self.props.user.accountRs,true)
    .then((response)=>{
        if (self.state.blockchainTransactions && self.state.blockchainTransactions.length) {
            let diff = response.transactions.filter((tx)=>(!self.state.blockchainTransactions.find((btx)=>(btx.fullHash === tx.fullHash))));
            //console.log(diff);
            this.confirmedSnack(diff);
        }
        if (response.transactions && response.transactions.length > 0){
          updateTimestamp(self.props.user.name,response.transactions[0].blockTimestamp);
        }
        self.setState({blockchainTransactions:response.transactions});
    })

    getUnconfirmedTransactions(NODEURL,2,self.props.user.accountRs)
    .then((response)=>{
        if (self.state.unconfirmedTransactions && self.state.blockchainTransactions.length) {
          let diff = response.unconfirmedTransactions.filter((tx)=>(!self.state.unconfirmedTransactions.find((btx)=>(btx.fullHash === tx.fullHash))));
          //console.log(response.unconfirmedTransactions);
          //console.log(diff);
          this.snackIt(diff);
        }
        //this.snackIt(response.unconfirmedTransactions);
        self.setState({unconfirmedTransactions:response.unconfirmedTransactions});
    })

    getTrades(NODEURL,2,self.props.user.accountRs)
    .then((response) => {
      //console.log(response);
      if (self.state.trades && self.state.trades.length) {
        let diff = response.trades.filter((rtrade)=>{
          return !self.state.trades.find((btr)=>(
              (btr.askOrderFullHash === rtrade.askOrderFullHash) && (btr.bidOrderFullHash === rtrade.bidOrderFullHash)
            ))
        });
        //console.log(diff);
        this.snackTrades(diff);
    }
    if (response.trades && response.trades.length > 0){
      updateTimestamp(self.props.user.name,response.trades[0].timestamp);
    }
    self.setState({trades:response.trades});
    })
  }

  snackActionTrade = (key) => (
    <Fragment>
      <Button onClick={()=>{
          this.props.history.push('/game/exchange');
          this.props.closeSnackbar(key);
        }}
      >
        {"show"}
      </Button>
      <IconButton onClick={() => { this.props.closeSnackbar(key) }}>
        <CloseOutlined/>      
      </IconButton>
    </Fragment>
  );


  snackActionShow = (key) => (
    <Fragment>
      <Button onClick={()=>{
          this.props.history.push('/game/history');
          this.props.closeSnackbar(key);
        }}
      >
        {"show"}
      </Button>
      <IconButton onClick={() => { this.props.closeSnackbar(key) }}>
        <CloseOutlined/>      
      </IconButton>
    </Fragment>
  );

  snackTrades(trades){
    var self = this;
    trades.forEach((trade,index) => {
      console.log(trade);
      const card = self.state.collectionCards.find((card)=>(card.asset === trade.asset))
      const what = (trade.buyerRS == self.props.user.accountRs) ? "Bought" : "Sold";
      this.props.enqueueSnackbar(what+' '+trade.quantityQNT+' '+card.name,{
        key:trade.fullHash,
        action:this.snackAction,
        preventDuplicate: true,
        variant:'info'});               
      });
  }

  snackMissedTx(){
    var self = this;
    // know height of last update AND HANDLE UNDEFINED
    const timestamp = getTimestamp(self.props.user.name);
    // self.setState({
    //   lastUpdate:{
    //     newTx:self.state.lastUpdate.newTx,
    //     newTrades:self.state.lastUpdate.newTrades,
    //     timestamp:timestamp,
    //     timestampTrades:timestamp
    //   }
    // });
    if (timestamp) { // does this handle undefined?
      console.log("checking for past TX from t:" + timestamp+1);
      getBlockchainTransactions(NODEURL,2,self.props.user.accountRs,true,timestamp+1)
      .then((response) => {
        //console.log(response);
        if (response.transactions && response.transactions.length){
          let numTx = response.transactions.length;
          let message = numTx  + " transaction(s) occurred while you were away.";
          let lastUpdate = self.state.lastUpdate;
          lastUpdate.newTx = numTx;
          self.setState({lastUpdate:lastUpdate});
          setTimeout(()=>{self.props.enqueueSnackbar(message,{
            action:this.snackActionShow,
            variant:'warning'})
          }, 1000); 
        }
        else {
          console.log("no tx found");
        }
      });
      getTrades(NODEURL,2,self.props.user.accountRs,timestamp+1)
      .then((response)=> {
        if (response.trades && response.trades.length){
          let numTrades = response.trades.length;
          let message = numTrades  + " card trade(s) occurred while you were away.";
          let lastUpdate = self.state.lastUpdate;
          lastUpdate.newTrades = numTrades
          self.setState({lastUpdate:lastUpdate});
          setTimeout(()=>{self.props.enqueueSnackbar(message,{
            action:this.snackActionTrade,
            variant:'warning'})
          }, 1000); 
        }
        else {
          console.log("no trades found");
        }
      })
    }
    else {
      console.log("timestamp not stored yet?");
    }
  }

  snackActionBackup = (key) => (
    <Fragment>
      <Button onClick={()=>{
          this.props.history.push('/game/settings');
          this.props.closeSnackbar(key);
        }}
      >
        {"do it now"}
      </Button>
      <IconButton onClick={() => { this.props.closeSnackbar(key) }}>
        <CloseOutlined/>      
      </IconButton>
    </Fragment>
  );


  snackBackup(){
    var self = this;
    const backupDone = getBackupDone(self.props.user.name);
    let message = "Please back-up your passphrase"
    if (!backupDone){
      setTimeout(()=>{self.props.enqueueSnackbar(message,{
        action:this.snackActionBackup,
        variant:'warning'})
      }, 500); 
    }
  }

  componentDidMount(){
    var self = this;
    fetchCards(NODEURL,self.props.user.accountRs,COLLECTIONACCOUNT,false)
    .then((response) => {
      self.setState({collectionCards:response});
    })
    this.snackMissedTx();
    this.snackBackup();
    this.refresh();
    console.log("GameRoutes: start refresh");
    this.timer = setInterval(this.refresh,5000);
  }

  componentWillUnmount(){
      console.log("GameRoutes: stop refresh");
      clearInterval(this.timer);    
  }


  snackAction = (key) => (
    <Fragment>
      <IconButton onClick={() => { this.props.closeSnackbar(key) }}>
        <CloseOutlined/>      
      </IconButton>
    </Fragment>
  );
  

  snackIt(transactions){
    var self = this;
    transactions.forEach((tx,index) => {
      //console.log(tx);
      if (tx.type === 2 & tx.subtype === 1 & tx.recipientRS === self.props.user.accountRs){
        //Asset Transfer 
        //console.log(tx);
        const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
        if (card) {
            this.props.enqueueSnackbar('Confirming: Received card: '+card.name,{
              key:tx.fullHash+"un",
              action:this.snackAction,
              preventDuplicate: true,
              variant:'info'});
        }
               
      }
      else if (tx.type === 2 & tx.subtype === 1 & tx.senderRS === self.props.user.accountRs){
        //Asset Transfer
        const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
        if (card) {
            this.props.enqueueSnackbar('Confirming: Sent card: '+card.name,{
              key:tx.fullHash+"un",
              action:this.snackAction,
              preventDuplicate: true,
              variant:'info'});
        }
      }
      else if (tx.type === 2 & tx.subtype === 2) {
        // place ask order
        //Asset Transfer
        const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
        if (card) {
          this.props.enqueueSnackbar('Confirming: Offer for card (ask order): '+card.name,{
              key:tx.fullHash+"un",
              action:this.snackAction,
              preventDuplicate: true,
              variant:'info'});
        }
      }
      else if (tx.type === 2 & tx.subtype === 3) {
        // place bid order
        //Asset Transfer
        const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
        if (card) {
          this.props.enqueueSnackbar('Confirming: Bid for card (bid order): '+card.name,{
              key:tx.fullHash+"un",
              action:this.snackAction,
              preventDuplicate: true,
              variant:'info'});
        }
      }
      else if (tx.type === 2 & tx.subtype === 4) {
        // cancel ask order
        //Asset Transfer
        //const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
        //if (card) {
          this.props.closeSnackbar(tx.fullHash+"un");
          this.props.enqueueSnackbar('Confirming: Cancellation for Offer (ask order)',{
              key:tx.fullHash,
              action:this.snackAction,
              preventDuplicate: true,
              variant:'info'});
        //}
      }
      else if (tx.type === 2 & tx.subtype === 5) {
        // cancel bid order
        //Asset Transfer
        //const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
        //if (card) {
          this.props.closeSnackbar(tx.fullHash+"un");
          this.props.enqueueSnackbar('Confirming: Cancellation for Bid',{
              key:tx.fullHash,
              action:this.snackAction,
              preventDuplicate: true,
              variant:'info'});
        //}
      }
      else if (tx.type === 5 & tx.subtype === 3){
        // Currency Transfer 
        if (tx.senderRS === self.props.user.accountRs){
          //outgoing
          this.props.enqueueSnackbar("Confirming: Sent "+tx.attachment.unitsQNT+" GIFTZ",{
            key:tx.fullHash+"un",
            action:this.snackAction,
            preventDuplicate: true,
            variant:'info'});
        }
        else {
          // incoming
          this.props.enqueueSnackbar("Confirming: Received "+tx.attachment.unitsQNT+" GIFTZ",{
            key:tx.fullHash+"un",
            action:this.snackAction,
            preventDuplicate: true,
            variant:'info'});
        }
      }
      else if (tx.type === 0 & tx.subtype === 0){
        // Ordinary Payment (IGNIS TX)
        if (tx.senderRS === self.props.user.accountRs){
          //outgoing
          this.props.enqueueSnackbar("Confirming: Sent "+tx.amountNQT/NQTDIVIDER+" Ignis",{
            key:tx.fullHash+"un",
            action:this.snackAction,
            preventDuplicate: true,
            variant:'info'});
        }
        else {
          // incoming
          this.props.enqueueSnackbar("Confirming: Received "+tx.amountNQT/NQTDIVIDER+" Ignis",{
            key:tx.fullHash+"un",
            action:this.snackAction,
            preventDuplicate: true,
            variant:'info'});              
        }
      }
      
    });        
  }
  
  confirmedSnack(transactions){
    var self = this;
    transactions.forEach((tx,index) => {
      //console.log(tx);
      if (tx.type === 2 & tx.subtype === 1 & tx.recipientRS === self.props.user.accountRs){
        //Asset Transfer 
        //console.log(tx);
        const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
        if (card) {
          this.props.closeSnackbar(tx.fullHash+"un");
          this.props.enqueueSnackbar('Confirmed: Received card: '+card.name,{
            key:tx.fullHash,
            action:this.snackAction,
            preventDuplicate: true,
            variant:'info'});
        }
               
      }
      else if (tx.type === 2 & tx.subtype === 1 & tx.senderRS === self.props.user.accountRs){
        //Asset Transfer
        const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
        if (card) {
          this.props.closeSnackbar(tx.fullHash+"un");
          this.props.enqueueSnackbar('Confirmed: Sent card: '+card.name,{
              key:tx.fullHash,
              action:this.snackAction,
              preventDuplicate: true,
              variant:'info'});
        }
      }
      else if (tx.type === 2 & tx.subtype === 2) {
        // place ask order
        //Asset Transfer
        const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
        if (card) {
          this.props.closeSnackbar(tx.fullHash+"un");
          this.props.enqueueSnackbar('Confirmed: Offer for card (ask order): '+card.name,{
              key:tx.fullHash,
              action:this.snackAction,
              preventDuplicate: true,
              variant:'info'});
        }
      }
      else if (tx.type === 2 & tx.subtype === 3) {
        // place bid order
        //Asset Transfer
        const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
        if (card) {
          this.props.closeSnackbar(tx.fullHash+"un");
          this.props.enqueueSnackbar('Confirmed: Bid for card (bid order): '+card.name,{
              key:tx.fullHash,
              action:this.snackAction,
              preventDuplicate: true,
              variant:'info'});
        }
      }
      else if (tx.type === 2 & tx.subtype === 4) {
        // cancel ask order
        //Asset Transfer
        const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
        if (card) {
          this.props.closeSnackbar(tx.fullHash+"un");
          this.props.enqueueSnackbar('Confirmed: Cancellation for card offer: '+card.name,{
              key:tx.fullHash,
              action:this.snackAction,
              preventDuplicate: true,
              variant:'info'});
        }
      }
      else if (tx.type === 2 & tx.subtype === 5) {
        // cancel bid order
        //Asset Transfer
        const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
        if (card) {
          this.props.closeSnackbar(tx.fullHash+"un");
          this.props.enqueueSnackbar('Confirmed: Cancellation for bid: '+card.name,{
              key:tx.fullHash,
              action:this.snackAction,
              preventDuplicate: true,
              variant:'info'});
        }
      }
      else if (tx.type === 5 & tx.subtype === 3){
        // Currency Transfer 
        if (tx.senderRS === self.props.user.accountRs){
          this.props.closeSnackbar(tx.fullHash+"un");
          //outgoing
          this.props.enqueueSnackbar("Confirmed: Sent "+tx.attachment.unitsQNT+" GIFTZ",{
            key:tx.fullHash,
            action:this.snackAction,
            preventDuplicate: true,
            variant:'info'});
        }
        else {
          // incoming
          this.props.closeSnackbar(tx.fullHash+"un");
          this.props.enqueueSnackbar("Confirmed: Received "+tx.attachment.unitsQNT+" GIFTZ",{
            key:tx.fullHash,
            action:this.snackAction,
            preventDuplicate: true,
            variant:'info'});
        }
      }
      else if (tx.type === 0 & tx.subtype === 0){
        // Ordinary Payment (IGNIS TX)
        if (tx.senderRS === self.props.user.accountRs){
          this.props.closeSnackbar(tx.fullHash+"un");
          //outgoing
          this.props.enqueueSnackbar("Confirmed: Sent "+tx.amountNQT/NQTDIVIDER+" Ignis",{
            key:tx.fullHash,
            action:this.snackAction,
            preventDuplicate: true,
            variant:'info'});
        }
        else {
          // incoming
          this.props.closeSnackbar(tx.fullHash+"un");
          this.props.enqueueSnackbar("Confirmed: Received "+tx.amountNQT/NQTDIVIDER+" Ignis",{
            key:tx.fullHash,
            action:this.snackAction,
            preventDuplicate: true,
            variant:'info'});              
        }
      }
    });      
  }

  render() {
    //const props = this.props;
    //const state = this.state;
    const myprops = { // this "filters out" all required props that will be fed to the pages below. The Route props will be added
      user:this.props.user,
      userIsNew:this.state.userIsNew,
      nodeurl:this.props.nodeurl,
      collectionAccount:this.props.collectionAccount,
      epoch_beginning:this.props.epoch_beginning,
      blockchainStatus:this.props.blockchainStatus,
      // added some states to the myprops
      showAllCards:this.state.showAllCards,
      toggleShowAllCards:this.toggleShowAllCards,
      wallet:this.state.wallet,
      walletCurrency:this.state.walletCurrency,
      blockchainTransactions:this.state.blockchainTransactions,
      unconfirmedTransactions:this.state.unconfirmedTransactions,
      collectionCards:this.state.collectionCards,
      lastUpdate:this.state.lastUpdate,
      trades:this.state.trades
    };
    return(
      <div className="App">
        <NavBar {...this.props} {...this.state} toggleShowAllCards={this.toggleShowAllCards}/>
        <main>
            <div className="App" style={{display:"inline-block", width:"100%"}}>                
                <Switch>
                  <Route exact path="/game/" render={(props)=>(<Wallet {...props} {...myprops}/>)} />
                  <Route path="/game/send/:asset" render={(props)=>(<SendCard {...props} {...myprops}/>)} />
                  <Route path="/game/card/:asset" render={(props)=>(<CardDetail {...props}  {...myprops}/>)} />
                  <Route path="/game/sendignis" render={(props)=>(<SendIgnis {...props} {...myprops}/>)} />
                  <Route path="/game/sendcurrency" render={(props)=>(<SendToken {...props} {...myprops}/>)} />
                  <Route path="/game/receive" render={(props)=>(<ShowQrCode {...props} {...myprops}/>)} />
                  <Route path="/game/buypack" render={(props)=>(<BuyPack {...props} {...myprops}/>)} />
                  <Route path="/game/buypackcur" render={(props)=>(<BuyPackCurrency {...props} {...myprops}/>)} />
                  <Route path="/game/settings" render={(props)=>(<UserDisplay {...props} {...myprops}/>)} />
                  <Route path="/game/fundaccount" render={(props)=>(<FundAccount {...props} {...myprops}/>)} />
                  <Route path="/game/jackpot" render={(props)=>(<Jackpot {...props} {...myprops}/>)} />
                  <Route path="/game/tarasca" render={(props)=>(<TarascaPage {...props} {...myprops}/>)} />
                  <Route path="/game/history" render={(props)=>(<TxHistory {...props} {...myprops} resetNewTx={this.resetNewTx}/>)} />
                  <Route path="/game/faq" render={(props)=>(<Faq {...props} {...myprops}/>)} />
                  <Route path="/game/exchange" render={(props) => (<Exchange {...props} {...myprops} resetNewTrades={this.resetNewTrades}/>)} />
                  <Route path="/game/place/:type/:asset" render={(props)=>(<PlaceOrder {...props}  {...myprops}/>) } />
                  <Route path="/game/card/:asset" render={(props)=>(<PlaceOrder {...props}  {...myprops}/>) } />
                  <Route path="/game/learnmore/:asset" render={(props)=>(<MonsterPage {...props}  {...myprops}/>) } />
                  <Route path="/game/cancel/ask/:order" render={(props)=>(<CancelAskOrder {...props}  {...myprops}/>) } />
                  <Route path="/game/cancel/bid/:order" render={(props)=>(<CancelBidOrder {...props}  {...myprops}/>) } />
                </Switch>                               
            </div>
        </main>
    </div>
    );
  }
}

export default withSnackbar(GameRoutes);

