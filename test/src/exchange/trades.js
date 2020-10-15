// tradehistory

import React, { Fragment } from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';

import '../common/txhistory.css';
import {parseAccount} from '../common/txhistory';


function TimeStamp({tx,eb}){
  //console.log(eb);
  var txstamp = new Date(eb.getTime());
  //console.log(txstamp);
  txstamp.setSeconds(+txstamp.getSeconds()+tx.timestamp);
  
  const Month = txstamp.getMonth()+1;
  const datestring = txstamp.getFullYear().toString()+"-"+ Month.toString().padStart(2,"0") + "-"+txstamp.getDate().toString().padStart(2,"0");
  const timestring = txstamp.getHours().toString().padStart(2,"0") + ":" + txstamp.getMinutes().toString().padStart(2,"0")+ ":" + txstamp.getSeconds().toString().padStart(2,"0");

  return(
    <Fragment>
      <Typography>{datestring} {timestring}</Typography>
    </Fragment>
  )
}



function IncomingTrade({trade,card,eb,badge}){
  //console.log(card);
  return (
    <Grid container
      justify="center"
      alignItems="center"
      direction="row"
      spacing={8}>
        <Grid item>
          {(badge === true) ? (
            <Badge color="secondary">
              <TimeStamp tx={trade} eb={eb}/>
            </Badge>
          ):(
            <TimeStamp tx={trade} eb={eb}/>
          )}          
        </Grid>
        <Grid item>
          <Typography>Bought {trade.quantityQNT} {card.name} ({card.channel})</Typography>
        </Grid>
        <Grid item>
          <Typography>Seller: {parseAccount(trade.sellerRS)}</Typography>
        </Grid>
    </Grid>
  )
}

function OutgoingTrade({trade,card,eb,badge}){
  //console.log(card);
  return (
    <Grid container
      justify="center"
      alignItems="center"
      direction="row"
      spacing={8}>
        <Grid item>
          {(badge === true) ? (
            <Badge color="secondary">
              <TimeStamp tx={trade} eb={eb}/>
            </Badge>
          ):(
            <TimeStamp tx={trade} eb={eb}/>
          )}          
        </Grid>
        <Grid item>
          <Typography>Sold {trade.quantityQNT} {card.name} ({card.channel})</Typography>
        </Grid>
        <Grid item>
          <Typography>Buyer: {parseAccount(trade.buyerRS)}</Typography>
        </Grid>
    </Grid>
  )
}


export function TradesHistory (props) {
  const displayed = props.trades.slice(0,30);
  //console.log(props);
  const trades = displayed.map((trade,index) => {
    const badge = trade.timestamp > props.lastUpdate.timestampTrades;
    //console.log("current trade:"+trade.timestamp+" storedTimestamp:"+props.lastUpdate.timestampTrades+" badge:"+badge);
    
    const card = props.collectionCards.find((card)=>(card.asset === trade.asset))
    if (card) {
      if (trade.sellerRS === props.user.accountRs){
        return (
          <div className="transaction" key={trade.askOrderFullHash.toString()+trade.bidOrderFullHash.toString()}>
            <OutgoingTrade trade={trade} card={card} eb={props.epoch_beginning} badge={badge}/>
          </div>
        )  
      }
      else {
        return (
          <div className="transaction" key={trade.askOrderFullHash.toString()+trade.bidOrderFullHash.toString()}>
            <IncomingTrade trade={trade} card={card} eb={props.epoch_beginning} badge={badge}/>
          </div>
        )  
      }
    }
    else return null;
  });

  return (
    <div style={{textAlign:"center", padding:20, width:"90%", maxWidth:"1024px", display:"inline-block"}}>
      <Button variant="outlined" onClick={()=>{props.resetNewTrades()}}>mark all as read</Button>
      <CSSTransitionGroup
        transitionName="example"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {trades}
      </CSSTransitionGroup>
    </div>
  )    
}
