import React, { Component } from 'react';
import { SendIgnis, SendToken } from './common/sendmoney';
import NavBar from './common/navigation';
import {getIgnisBalance, getAccountCurrencies, getAccount, getBlockchainTransactions, getUnconfirmedTransactions} from './common/ardorinterface';
import { CURRENCY, NODEURL, COLLECTIONACCOUNT } from './common/constants';
import { BuyPackCurrency, BuyPack } from './wallet/buypack';
import { ShowQrCode } from './wallet/showqrcode';
import { UserDisplay } from './common/user';
import { FundAccount } from './wallet/fundaccount';
import { Jackpot } from './wallet/jackpot';
import {TxHistory} from './common/txhistory';
import { fetchCards } from './common/common';
import { withSnackbar } from 'notistack';


// with nav components


class AddNav extends Component{
    constructor(props){
        super(props);
        this.state = {
            userIsNew:false,
            collectionCompleted:{complete:false,missingAssets:[],blockedAssets:[]},
            wallet: {unconfirmedBalanceNQT:0, balanceNQT:0},
            walletCurrency: {unconfirmedUnitsQNT:0, unitsQNT:0},
          }
        this.refresh = this.refresh.bind(this);
        this.snackIt = this.snackIt.bind(this);
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
                console.log(diff);
                this.snackIt(diff);
            }
            self.setState({blockchainTransactions:response.transactions});
        })
    
        getUnconfirmedTransactions(NODEURL,2,self.props.user.accountRs)
        .then((response)=>{
            //console.log(response);
            self.setState({unconfirmedTransactions:response.unconfirmedTransactions});
        })
      }
    
      componentDidMount() {
        var self = this;
        fetchCards(NODEURL,self.props.user.accountRs,COLLECTIONACCOUNT,false)
        .then((response) => {self.setState({collectionCards:response})});
        this.refresh();
        this.timer = setInterval(this.refresh, 12000);
      }
        
      componentWillUnmount(){
        console.log("withNav: stop refresh");
        clearInterval(this.timer);
      }
    


      snackIt(transactions){
        var self = this;
        transactions.forEach((tx,index) => {
          //console.log(tx);
          if (tx.type === 2 & tx.subtype === 1 & tx.recipientRS === self.props.user.accountRs){
            //Asset Transfer 
            //console.log(tx);
            const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
            if (card) {
                this.props.enqueueSnackbar('You got a Card');
            }
                   
          }
          else if (tx.type === 2 & tx.subtype === 1 & tx.senderRS === self.props.user.accountRs){
            //Asset Transfer
            const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
            if (card) {
                this.props.enqueueSnackbar("You've sent a Card");
            }
          }
          else if (tx.type === 5 & tx.subtype === 3){
            // Currency Transfer 
            if (tx.senderRS === self.props.user.accountRs){
              //outgoing
              this.props.enqueueSnackbar('You got a Token');
            }
            else {
              // incoming
              this.props.enqueueSnackbar('You sent a Token');
            }
          }
          else if (tx.type === 0 & tx.subtype === 0){
            // Ordinary Payment (IGNIS TX)
            if (tx.senderRS === self.props.user.accountRs){
              //outgoing
              this.props.enqueueSnackbar("You've sent Ignis");
            }
            else {
              // incoming
              this.props.enqueueSnackbar("You've got Ignis");              
            }
          }
          
        });        
      }  
    
    render(){
        console.log(this.state);
        const children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {...this.props, ...this.state});
        });

        return(
            <div className="App">
                <NavBar {...this.props} {...this.state}/>
                <main>
                    <div className="App" style={{display:"inline-block", width:"100%"}}>
                        <div style={{textAlign:"center", padding:20, width:"90%", maxWidth:"540px", display:"inline-block"}}>
                            {children}
                        </div>
                    </div>
                </main>
            </div>
    )}
}

export default withSnackbar(AddNav);

