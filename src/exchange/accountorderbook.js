import React, {Component} from 'react';
import { AccountOrderTable } from './accountordertable';
import { getAccountCurrentAskOrders , getAccountCurrentBidOrders } from '../common/ardorinterface';

import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { NQTDIVIDER } from '../common/constants';



export class AccountOrderBook extends Component {
  constructor(props) {
    super(props);
    this.state={
      bidOrders:[],
      askOrders:[]
    }
    this.refresh = this.refresh.bind(this);
  }

  refresh(){
    console.log("AccountOrderBook: refresh");
    var self = this;
    getAccountCurrentAskOrders(this.props.nodeurl,this.props.user.accountRs)
    .then((response) => {
        self.setState({askOrders:response.askOrders});
    });
    getAccountCurrentBidOrders(this.props.nodeurl,this.props.user.accountRs)
    .then((response) => {
        self.setState({bidOrders:response.bidOrders});
    });
  }
    
  componentDidMount(){
    this.refresh()
    this.timer = setInterval(this.refresh, 12000)
  }

  componentWillUnmount(){
    console.log("AccountOrderBook: stop refresh");
    clearInterval(this.timer);
  }

  render(){
    return (
      <Grid container
        justify="center"
        alignItems="center"
        direction="column"
        spacing={24}
      >
        <Grid item>
          <Typography variant="h4">
            Asks
          </Typography>
            <AccountOrderTable orders={this.state.askOrders} type="ask"
                                userAccount={this.props.user.accountRs} NQTdivider={NQTDIVIDER}
                                collectionAssets={this.props.collectionAssets}
                                cards={this.props.cards} 
                                nodeurl={this.props.nodeurl}/>
        </Grid>
        <Grid item>
        <Typography variant="h4">
            Bids
          </Typography>
            <AccountOrderTable orders={this.state.bidOrders} type="bid"
                                userAccount={this.props.user.accountRs} NQTdivider={NQTDIVIDER}
                                collectionAssets={this.props.collectionAssets}
                                cards={this.props.cards} 
                                nodeurl={this.props.nodeurl}/>
        </Grid>
    </Grid>);
  }
}

