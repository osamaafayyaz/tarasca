//txhistory
import React, { Fragment } from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

import { COLLECTIONACCOUNT, NQTDIVIDER } from './constants';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';

import './txhistory.css';
import Coins from './images/coins.svg';
import Giftz from './images/giftz.png'

export function parseAccount(account,contacts=[{accountRs:COLLECTIONACCOUNT,name:"Tarasca DAO"}]) {
  const found = contacts.find((contact)=>{ return contact.accountRs === account});
  //console.log(found);
  if (found === undefined) {
    return account;
  }
  else {
    return found.name;
  }
}


export function TimeStamp({tx,eb}){
  //console.log(eb);
  var txstamp = new Date(eb.getTime());
  //console.log(txstamp);
  txstamp.setSeconds(+txstamp.getSeconds()+tx.timestamp);
  //console.log(txstamp);
  let status = "unconfirmed";
  if (tx.confirmations === 1){
    status = "just confirmed";
  }
  else if (tx.confirmations > 1){
    status = "confirmed"
  }
  const Month = txstamp.getMonth()+1;
  const datestring = txstamp.getFullYear().toString()+"-"+ Month.toString().padStart(2,"0") + "-"+txstamp.getDate().toString().padStart(2,"0");
  const timestring = txstamp.getHours().toString().padStart(2,"0") + ":" + txstamp.getMinutes().toString().padStart(2,"0")+ ":" + txstamp.getSeconds().toString().padStart(2,"0");

  return(
    <Fragment>
      <Typography>{datestring} {timestring} ({status})</Typography>
    </Fragment>
  )
}


function AssetExchange({tx,card,eb,order,type,badge}){
  //console.log(card);
  const card_print = card ? card : {name:"",channel:""};

  return (
    <Grid container
      justify="center"
      alignItems="center"
      direction="row"
      spacing={8}>
        <Grid item>
          {(badge===true) ? (
            <Badge color="secondary">
              <Typography variant="body2">EXCHANGE</Typography>
            </Badge>
          ):(
            <Typography variant="body2">EXCHANGE</Typography>
          )}          
        </Grid>
        <Grid item>
          <TimeStamp tx={tx} eb={eb}/>
        </Grid>
        <Grid item>            
          <Typography>{type}: {order}</Typography>
        </Grid>
        <Grid item>
          <Typography>{tx.attachment.quantityQNT} {card_print.name}</Typography>
        </Grid>
        <Grid item>
          <Typography>Sender: You</Typography>
        </Grid>
    </Grid>
  )
}

function IncomingCardTransferMobile({tx,card,eb,badge}){
  return (
    <Grid container
      justify="flex-start"
      alignItems="center"
      direction="row"
      spacing={8}>
        <Grid item xs={12}>
          {(badge===true) ? (
            <Badge color="secondary">
              <Typography variant="h6" align="left">Received {card.name} ({card.channel})</Typography>                
            </Badge>
          ):(
              <Typography variant="h6" align="left">Received {card.name} ({card.channel})</Typography>                
          )}          
        </Grid>
        <Grid item xs={4}>
              <img src={card.cardThumbUrl} alt="card img" width="80px"/>                   
        </Grid>
        <Grid item xs={8} container direction="column" alignItems="flex-start" spacing={8}>
          <Grid item>
            <Typography>Amount: {tx.attachment.quantityQNT}</Typography>
          </Grid>
          <Grid item> 
            <TimeStamp tx={tx} eb={eb}/>
          </Grid>
          <Grid item>            
            <Typography align="left">Sender: {parseAccount( tx.senderRS)}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider variant="fullWidth" />
        </Grid>
    </Grid>
  )
}


function IncomingCardTransfer({tx,card,eb,badge}){
  return (
    <Grid container
      justify="flex-start"
      alignItems="center"
      direction="row"
      spacing={16}>
        <Grid item xs={3}>
          <img src={card.cardThumbUrl} alt="card img"
            width="80px"  
            style={{opacity:card.quantityQNT > 0 ? 1 : 0.1}}/>                   
        </Grid>
        <Grid item xs={9} container direction="column" alignItems="flex-start" spacing={8}>
            <Grid item xs={12}>
              {(badge===true) ? (
                <Badge color="secondary">
                  <Typography variant="h6">Received: {card.name} ({card.channel})</Typography>
                </Badge>
                ):(
                  <Typography variant="h6">Received: {card.name} ({card.channel})</Typography>
              )}
            </Grid>
            <Grid item xs={12} container direction="row">

              <Grid item xs={12} sm={6} container direction="column" alignItems="flex-start">
                <Grid item>
                  <Typography>Amount: {tx.attachment.quantityQNT}</Typography>
                </Grid>
                <Grid item> 
                  <TimeStamp tx={tx} eb={eb}/>
                </Grid>
              </Grid>
            
              <Grid item xs={12} sm={6} container direction="column" alignItems="flex-start">
                
                <Grid item>            
                  <Typography>Recipient: You</Typography>
                </Grid>
                <Grid item>
                  <Typography>Sender: {parseAccount( tx.senderRS)}</Typography>
                </Grid>
              </Grid>

          </Grid>
        </Grid>
        
        <Grid item xs={12}>
          <Divider variant="fullWidth" />
        </Grid>
    </Grid>
  )
}


function OutgoingCardTransfer({tx,card,eb,badge}){
  return (
    <Grid container
      justify="flex-start"
      alignItems="center"
      direction="row"
      spacing={16}>
        <Grid item xs={3}>
          <img src={card.cardThumbUrl} alt="card img"
            width="80px"  
            style={{opacity:card.quantityQNT > 0 ? 1 : 0.1}}/>                   
        </Grid>
        <Grid item xs={9} container direction="column" alignItems="flex-start" spacing={8}>
            <Grid item xs={12}>
              {(badge===true) ? (
                <Badge color="secondary">
                  <Typography variant="h6">sent: {card.name} ({card.channel})</Typography>
                </Badge>
                ):(
                  <Typography variant="h6">sent: {card.name} ({card.channel})</Typography>
              )}
            </Grid>
            <Grid item xs={12} container direction="row">

              <Grid item xs={6} container direction="column" alignItems="flex-start">
                <Grid item>
                  <Typography>Amount: {tx.attachment.quantityQNT}</Typography>
                </Grid>
                <Grid item> 
                  <TimeStamp tx={tx} eb={eb}/>
                </Grid>
              </Grid>
            
              <Grid item xs={6} container direction="column" alignItems="flex-start">
                <Grid item>
                  <Typography>Sender: You</Typography>
                </Grid>
                <Grid item>            
                  <Typography>Recipient: {parseAccount( tx.recipientRS)}</Typography>
                </Grid>
              </Grid>

          </Grid>
        </Grid>
        
        <Grid item xs={12}>
          <Divider variant="fullWidth" />
        </Grid>
    </Grid>
  )
}

function OutgoingCardTransferMobile({tx,card,eb,badge}){
  return (
    <Grid container
      justify="flex-start"
      alignItems="center"
      direction="row"
      spacing={8}>
        <Grid item xs={12}>
          {(badge===true) ? (
            <Badge color="secondary">
              <Typography variant="h6" align="left">sent {card.name} ({card.channel})</Typography>                
            </Badge>
          ):(
              <Typography variant="h6" align="left">sent {card.name} ({card.channel})</Typography>                
          )}          
        </Grid>
        <Grid item xs={4}>
              <img src={card.cardThumbUrl} alt="card img" width="80px"/>                   
        </Grid>
        <Grid item xs={8} container direction="column" alignItems="flex-start" spacing={8}>
          <Grid item>
            <Typography>Amount: {tx.attachment.quantityQNT}</Typography>
          </Grid>
          <Grid item> 
            <TimeStamp tx={tx} eb={eb}/>
          </Grid>
          <Grid item>            
            <Typography align="left">Recipient: {parseAccount( tx.recipientRS)}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider variant="fullWidth" />
        </Grid>
      </Grid>
  )
}

function OutgoingCurrencyTransfer({tx,eb,badge}){
  return (
    <Grid container
      justify="flex-start"
      alignItems="center"
      direction="row"
      spacing={8}>
        <Grid item xs={12}>
          {(badge===true) ? (
            <Badge color="secondary">
              <Typography variant="h6" align="left">sent {tx.attachment.unitsQNT} &Gamma;</Typography>                
            </Badge>
          ):(
              <Typography variant="h6" align="left">send {tx.attachment.unitsQNT} &Gamma;</Typography>                
          )}          
        </Grid>
        <Grid item xs={4}>
            <img src={Giftz} alt="Giftz" width={"50px"}/> 
        </Grid>
        <Grid item xs={8} container direction="column" alignItems="flex-start" spacing={8}>
          <Grid item> 
            <TimeStamp tx={tx} eb={eb}/>
          </Grid>
          <Grid item>            
            <Typography align="left">Sender: {parseAccount( tx.senderRS)}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider variant="fullWidth" />
        </Grid>
    </Grid>
  )
}



function IncomingCurrencyTransfer({tx,eb,badge}){
  return (
    <Grid container
      justify="flex-start"
      alignItems="center"
      direction="row"
      spacing={8}>
        <Grid item xs={12}>
          {(badge===true) ? (
            <Badge color="secondary">
              <Typography variant="h6" align="left">Received {tx.attachment.unitsQNT} &Gamma;</Typography>                
            </Badge>
          ):(
              <Typography variant="h6" align="left">Received {tx.attachment.unitsQNT} &Gamma;</Typography>                
          )}          
        </Grid>
        <Grid item xs={4}>
              <img src={Giftz} alt="Giftz" width={"50px"}/> 
        </Grid>
        <Grid item xs={8} container direction="column" alignItems="flex-start" spacing={8}>
          <Grid item> 
            <TimeStamp tx={tx} eb={eb}/>
          </Grid>
          <Grid item>            
            <Typography align="left">Recipient: {parseAccount( tx.recipientRS)}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider variant="fullWidth" />
        </Grid>
    </Grid>
  )
}


function OutgoingMoneyTransfer({tx,currency,eb,badge}){
  return (
    <Grid container
      justify="flex-start"
      alignItems="center"
      direction="row"
      spacing={8}>
        <Grid item xs={12}>
          {(badge===true) ? (
            <Badge color="secondary">
              <Typography variant="h6" align="left">sent: {tx.amountNQT/NQTDIVIDER} &Iota;</Typography>
            </Badge>
          ):(
              <Typography variant="h6" align="left">sent: {tx.amountNQT/NQTDIVIDER} &Iota;</Typography>
          )}
        </Grid>        
        <Grid item xs={4}>
          <img src={Coins} alt="Coins" width={"50px"}/> 
        </Grid>
        <Grid item xs={8} container direction="column" alignItems="flex-start" spacing={8}>
          <Grid item>
            <TimeStamp tx={tx} eb={eb}/>
          </Grid>
          <Grid item>
            <Typography>Recipient: {parseAccount( tx.recipientRS)}</Typography>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider variant="fullWidth" />
        </Grid>
    </Grid>
  )
}

function IncomingMoneyTransfer({tx,currency,eb,badge}){
  return (
    <Grid container
      justify="flex-start"
      alignItems="center"
      direction="row"
      spacing={8}>
        <Grid item xs={12}>
          {(badge===true) ? (
            <Badge color="secondary">
              <Typography variant="h6" align="left">Received: {tx.amountNQT/NQTDIVIDER} &Iota;</Typography>
            </Badge>
          ):(
              <Typography variant="h6" align="left">Received: {tx.amountNQT/NQTDIVIDER} &Iota;</Typography>
          )}
        </Grid>  
        <Grid item xs={4}>
          <img src={Coins} alt="Coins" width={"50px"}/> 
        </Grid>
        <Grid item xs={8} container direction="column" alignItems="flex-start" spacing={8}>
                <Grid item>
                  <TimeStamp tx={tx} eb={eb}/>
                </Grid>
                <Grid item>
                  <Typography>Sender: {parseAccount( tx.senderRS)}</Typography>
                </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider variant="fullWidth" />
        </Grid>
    </Grid>
  )
}



export function TxHistory (props) {
  const alltx = props.unconfirmedTransactions.concat(props.blockchainTransactions);
  const displayed = alltx;
  //const timestamp = getTimestamp(props.user.name);
  //console.log(timestamp);
  //console.log("lastUpdate: newTx:"+props.lastUpdate.newTx+", timestamp: "+props.lastUpdate.timestamp)
  const txs = displayed.map((tx,index) => {
    const badge = tx.blockTimestamp > props.lastUpdate.timestamp;
    //console.log("current tx:"+tx.blockTimestamp+" storedTimestamp:"+props.lastUpdate.timestamp+" badge:"+badge);
    if (tx.type === 2 & tx.subtype === 1 & tx.recipientRS === props.user.accountRs){
      //Asset Transfer 
      //console.log(tx);
      const card = props.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
      if (card) {
        return (
          <div className="transaction" key={tx.fullHash}>
            <Hidden smUp>
              <IncomingCardTransferMobile tx={tx} card={card} eb={props.epoch_beginning} badge={badge}/>
            </Hidden>
            <Hidden xsDown>
              <IncomingCardTransferMobile tx={tx} card={card} eb={props.epoch_beginning} badge={badge}/>
            </Hidden>
          </div>
        )
      }
      else return null;
              
    }
    else if (tx.type === 2 & tx.subtype === 1 & tx.senderRS === props.user.accountRs){
      //Asset Transfer
      const card = props.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
      if (card) {
        return (
          <div className="transaction" key={tx.fullHash}>
            <Hidden smUp>
              <OutgoingCardTransferMobile tx={tx} card={card} eb={props.epoch_beginning} badge={badge}/>
            </Hidden>
            <Hidden xsDown>
              <OutgoingCardTransferMobile tx={tx} card={card} eb={props.epoch_beginning} badge={badge}/>
            </Hidden>
          </div>
        )
      }
    }
    else if (tx.type === 2 & tx.subtype === 2) {
      // place ask order
      //Asset Transfer
      const card = props.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
      if (card) {
        return (
          <div className="transaction" key={tx.fullHash}>
            <AssetExchange tx={tx} card={card} eb={props.epoch_beginning} type="Placed" order="Ask Order" badge={badge}/>
          </div>
        )
      }
    }
    else if (tx.type === 2 & tx.subtype === 3) {
      // place bid order
      //Asset Transfer
      const card = props.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
      if (card) {
        return(
          <div className="transaction" key={tx.fullHash}>
            <AssetExchange tx={tx} card={card} eb={props.epoch_beginning} type="Placed" order="Bid Order" badge={badge}/>
          </div>
        )
      }
    }
    else if (tx.type === 2 & tx.subtype === 4) {
      // cancel ask order
      //Asset Transfer
      //const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
      //if (card) {
        return(
          <div className="transaction" key={tx.fullHash}>
            <AssetExchange tx={tx} eb={props.epoch_beginning} type="Cancelled" order="Ask Order" badge={badge}/>
          </div>
        )
      //}
    }
    else if (tx.type === 2 & tx.subtype === 5) {
      // cancel bid order
      //Asset Transfer
      //const card = self.state.collectionCards.find((card)=>(card.asset === tx.attachment.asset))
      //if (card) {
        return(
          <div className="transaction" key={tx.fullHash}>
            <AssetExchange tx={tx} eb={props.epoch_beginning} type="Cancelled" order="Bid Order" badge={badge}/>
          </div>
        )
      //}
    }
    else if (tx.type === 5 & tx.subtype === 3){
      // Currency Transfer 
      if (tx.senderRS === props.user.accountRs){
        //outgoing
        return(
          <div className="transaction" key={tx.fullHash}>
            <OutgoingCurrencyTransfer tx={tx} eb={props.epoch_beginning} badge={badge}/>
          </div>
        )
      }
      else {
        // incoming
        return(
          <div className="transaction" key={tx.fullHash}>
            <IncomingCurrencyTransfer tx={tx} eb={props.epoch_beginning} badge={badge}/>
          </div>
        )
      }
    }
    else if (tx.type === 0 & tx.subtype === 0){
      // Ordinary Payment (IGNIS TX)
      if (tx.senderRS === props.user.accountRs){
        //outgoing
        return(
          <div className="transaction" key={tx.fullHash}>
            <OutgoingMoneyTransfer tx={tx} eb={props.epoch_beginning} badge={badge}/>
          </div>
        )
      }
      else {
        // incoming
        return(
          <div className="transaction" key={tx.fullHash}>
            <IncomingMoneyTransfer tx={tx} eb={props.epoch_beginning} badge={badge}/>
          </div>
        )
      }
    }
    
  });

  return (
    <div style={{textAlign:"center", padding:20, width:"90%", maxWidth:"1024px", display:"inline-block"}}>
      <Typography variant="h2" style={{marginBottom:20}}>Transaction History</Typography>
      <Button variant="outlined" onClick={()=>{props.resetNewTx()}} style={{marginBottom:20}}>mark all as read</Button>
      <CSSTransitionGroup
        transitionName="example"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {txs}
      </CSSTransitionGroup>
    </div>
  )    
}
