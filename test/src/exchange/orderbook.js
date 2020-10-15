import React, {Component} from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead'; 
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

import {NQTDIVIDER} from '../common/constants';
import {getIgnisBalance, getAskOrders, getBidOrders} from '../common/ardorinterface';



export function OrderBook(props){
  let orderTable;
  if (props.orders===undefined){
    orderTable = (
      <TableRow><Typography variant="body1" style={{marginTop:10}}>Fetching...</Typography></TableRow>);
    }
  else if (props.orders.length===0){
    orderTable = (
      <TableRow><Typography variant="body1" style={{marginTop:10}}>No Bids.</Typography></TableRow>);
    }
  else {
    orderTable = props.orders.map(function(order,index){
      return(
        <TableRow key={index}>
          <TableCell>
            <Typography variant="body1">{order.priceNQTPerShare/NQTDIVIDER}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body1">{order.quantityQNT}</Typography>
          </TableCell>
        </TableRow>);
    });
  }
  return( <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="body1">Ignis</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">Amount</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderTable}
            </TableBody>
          </Table>);
}


export class OrderBooks extends Component {
  constructor(props){
    super(props);
    this.state = {
      wallet: undefined,
      askOrders: undefined,
      bidOrders: undefined
    }
    this.refresh = this.refresh.bind(this);
  }

  refresh(){
    var self = this;
    getAskOrders(this.props.nodeurl,this.props.match.params.asset)
    .then((response) => {
      self.setState({askOrders:response.askOrders});
    });
    getBidOrders(this.props.nodeurl,this.props.match.params.asset)
    .then((response) => {
      self.setState({bidOrders:response.bidOrders});
    });
    
    getIgnisBalance(self.props.nodeurl,self.props.user.accountRs)
    .then(function(response){
        self.setState({wallet:response})
    });
  }

  componentDidMount(){
    this.refresh();
    this.timer = setInterval(this.refresh,10000);
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }

  render(){
    return (
      <Grid container 
              spacing={16}
              justify="center"
              alignItems="flex-start"
              style={{marginTop:10}}
        >
          <Grid item>
            <Typography variant="display1">Asks</Typography>
            <OrderBook orders={this.state.askOrders}/>
          </Grid>
          <Grid item>
            <Typography variant="display1">Bids</Typography>
            <OrderBook orders={this.state.bidOrders}/>
          </Grid>
      </Grid>
    );
  }
}