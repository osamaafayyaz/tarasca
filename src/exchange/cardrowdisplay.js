import React, {Component} from 'react';
import { getAskOrders, getBidOrders } from '../common/ardorinterface';
import { NQTDIVIDER } from '../common/constants';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import { ThumbExchangeRow } from '../carddeck/thumb';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';


export class CardRowDisplay extends Component {
  constructor(props) {
    super(props);
    this.state={
      modalSend:false,
      modalTrade:false,
      bidOrders:[],
      askOrders:[]
    }
    this.refresh = this.refresh.bind(this);
  }

  refresh(){
    var self = this;
    getAskOrders(this.props.nodeurl,this.props.card.asset)
    .then((response) => {
      self.setState({askOrders:response.askOrders});
    });
    getBidOrders(this.props.nodeurl,this.props.card.asset)
    .then((response) => {
      self.setState({bidOrders:response.bidOrders});
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
    const numColumnStyle = { width: 12};
// style={{padding:"8px", textAlign:"center"}}
// style={{padding:"8px"}}
    const ask = this.state.askOrders.length === 0 ? "/" 
                          : this.state.askOrders[0].priceNQTPerShare/NQTDIVIDER;
    const bid = this.state.bidOrders.length === 0 ? "/" 
                          : this.state.bidOrders[0].priceNQTPerShare/NQTDIVIDER;
    const quant = this.props.card.quantityQNT > this.props.card.unconfirmedQuantityQNT ? this.props.card.quantityQNT 
                          : this.props.card.unconfirmedQuantityQNT;
    return (
      <TableRow>
        <TableCell>
          <Link style={{textDecoration:"none"}} to={"/game/card/"+this.props.card.asset}>
            <ThumbExchangeRow card={this.props.card}></ThumbExchangeRow>
          </Link>
        </TableCell>
        <TableCell ><Typography variant="h6" align="left">{this.props.card.name} ({this.props.card.channel})</Typography></TableCell>
        <TableCell><Typography variant="body1">{quant}</Typography></TableCell>
        <TableCell style={numColumnStyle}><Link to={"/game/place/bid/"+this.props.card.asset}><Button variant="text">{ask}</Button></Link></TableCell>
        <TableCell style={numColumnStyle}><Link to={"/game/place/ask/"+this.props.card.asset}><Button variant="text">{bid}</Button></Link></TableCell>
      </TableRow>
    );
  }
}


export class CardRowDisplayMobile extends Component {
  constructor(props) {
    super(props);
    this.state={
      modalSend:false,
      modalTrade:false,
      bidOrders:[],
      askOrders:[]
    }
    this.refresh = this.refresh.bind(this);
  }

  refresh(){
    var self = this;
    getAskOrders(this.props.nodeurl,this.props.card.asset)
    .then((response) => {
      self.setState({askOrders:response.askOrders});
    });
    getBidOrders(this.props.nodeurl,this.props.card.asset)
    .then((response) => {
      self.setState({bidOrders:response.bidOrders});
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
    const numColumnStyle = { width: 12};
    const ask = this.state.askOrders.length === 0 ? "/" 
                          : this.state.askOrders[0].priceNQTPerShare/NQTDIVIDER;
    const bid = this.state.bidOrders.length === 0 ? "/" 
                          : this.state.bidOrders[0].priceNQTPerShare/NQTDIVIDER;
    const quant = this.props.card.quantityQNT > this.props.card.unconfirmedQuantityQNT ? this.props.card.quantityQNT 
                          : this.props.card.unconfirmedQuantityQNT;
    return (
      <Grid item xs={12}>
        <Grid container direction="row" alignItems="flex-start" justify="center" spacing={8}>
          <Grid item xs={4} md={2}>
            <Link style={{textDecoration:"none"}} to={"/game/card/"+this.props.card.asset}>
              <ThumbExchangeRow card={this.props.card}></ThumbExchangeRow>
            </Link>
          </Grid>
          <Grid item xs={8} md={10}>
            <Grid container direction="row">
              <Grid item xs={12}>
              <Typography variant="h6" align="left">{this.props.card.name} ({this.props.card.channel})</Typography>
              <Typography variant="body1" align="left">Amount: {quant}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" align="center">
                <Link to={"/game/place/bid/"+this.props.card.asset}><Button variant="outlined">Ask: {ask}</Button></Link>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" align="center">
                <Link to={"/game/place/ask/"+this.props.card.asset}><Button variant="outlined">Bid: {bid} </Button></Link>
              </Typography>
              
            </Grid>
          </Grid>
        </Grid>
        </Grid>
        <Divider variant="middle" />
      </Grid>
    );
  }
}