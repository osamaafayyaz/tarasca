import React, {Component} from 'react';
import { fetchCards } from '../common/common';
import { CardRowDisplay, CardRowDisplayMobile } from './cardrowdisplay';
import {AccountOrderBook} from './accountorderbook';
import {Filter} from '../carddeck/filter';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Hidden } from '@material-ui/core';
import { TradesHistory } from './trades';


export class Exchange extends Component {
  constructor(props){
    super(props);
    this.state = {
      cards:[],
      selectedChannel:"all",
      slideIndex:0
    }
    this.refresh = this.refresh.bind(this); 
  }

  refresh(){
    var self = this;
    console.log("Exchange: refresh");
    fetchCards(this.props.nodeurl,this.props.user.accountRs,this.props.collectionAccount)
    .then(function(response){
      self.setState({cards:response});
    })
    .catch(function(error) {console.log(error)});
  }

  componentDidMount(){
    this.refresh()
    this.timer = setInterval(this.refresh, 12000)
  }

  componentWillUnmount(){
    console.log("Exchange: stop refresh");
    clearInterval(this.timer);
  }

  render() {
    const numColumnStyle = { width: 12};
    let channels = new Set(this.state.cards.map((card) => {return card.channel}))
    let cards = []
    if (this.state.selectedChannel !== "all") {
      cards = this.state.cards.filter((card) => (card.channel === this.state.selectedChannel));
    }
    else {
      cards = this.state.cards;
    } 
    const max = cards.length;
    
    return (
      <div style={{textAlign:"center", padding:20, width:"90%", display:"inline-block"}}>
        <Grid container
          justify="center"
          alignItems="stretch"
          direction="column"
          spacing={24}
        >
          <Grid item>
            <Typography variant="h2">Exchange</Typography>
          </Grid>
          <Grid item>
            <Filter channels={[...channels]} onClick={(chan)=>this.setState({selectedChannel:chan})} />
          </Grid>
          <Grid item style={{marginTop:20}}>
            <Grid container
              justify="space-between"
              alignItems="flex-start"
              direction="row"
              spacing={24}
            >
              <Grid item className="boxed" style={{border:'1px solid', borderColor:'#ffffff3b'}}>
                <Typography variant="h3" style={{marginBottom:20}}>Market</Typography>    
                <Hidden xsDown>        
                  <Table padding="dense">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell style={numColumnStyle}>Lowest Ask </TableCell>
                        <TableCell style={numColumnStyle}>Highest Bid</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        cards != null ? (
                          cards.map(
                            (card, index) => (
                              (this.props.showAllCards | (card.quantityQNT > 0)) ? (
                                <CardRowDisplay key={index} card={card} {...this.props}/>                                    
                              ): (null)
                            )
                          )
                        ): null
                      }    
                    </TableBody>
                  </Table>
                </Hidden>
                <Hidden smUp>
                  <Grid container direction="column" spacing={24}>
                    {
                      cards != null ? (
                        cards.map(
                          (card, index) => (
                            (this.props.showAllCards | (card.quantityQNT > 0 )) ? (
                              <CardRowDisplayMobile key={index} card={card} {...this.props}/>
                            ):(null)
                          )
                        )
                      ): null
                    }
                  </Grid>
                </Hidden>
              </Grid>
              <Grid item className="boxed" style={{border:'1px solid', borderColor:'#ffffff3b'}}>
                <Typography variant="h3">Your Orders</Typography>
                <AccountOrderBook cards={cards} {...this.props}/>
              </Grid>
              <Grid item className="boxed" style={{border:'1px solid', borderColor:'#ffffff3b'}}>
                <Typography variant="h3">Your Last Trades</Typography>
                <TradesHistory {...this.props} />
              </Grid>
            </Grid>            
          </Grid>
        </Grid>
      </div>
    );
  }  
}

