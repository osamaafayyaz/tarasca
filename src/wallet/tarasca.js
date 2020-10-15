import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { fetchCard } from '../common/common';
import { TARASCACARDASSET, NQTDIVIDER } from '../common/constants';
import {CardInfo, CardImageNoButton} from '../common/cardinfo';
import { getAskOrders, getBidOrders } from '../common/ardorinterface';




export class TarascaPage extends Component {
    constructor(props){
      super(props);
      this.state = {
        card:{quantityQNT:0},
        selectedChannel:"all",
        gotTarasca:false
      }
      this.refresh = this.refresh.bind(this); 
    }
  
    refresh(){
      var self = this;
      console.log("Tarasca: refresh");
      fetchCard(this.props.nodeurl,this.props.user.accountRs,TARASCACARDASSET)
      .then(function(response){
        self.setState({card:response});
        let gotTarasca = response.quantityQNT > 0;
        self.setState({gotTarasca:gotTarasca})        
      })
      .catch(function(error) {console.log(error)});
    }
  
    componentDidMount(){
      this.refresh()
      this.timer = setInterval(this.refresh, 12000)
    }

    componentWillUnmount(){
        console.log("Tarasca: stop refresh");
        clearInterval(this.timer);    
    }

    render(){
        let posess = this.state.gotTarasca;
        const out = this.state.gotTarasca ? (<TarascaCard/>) : (<NoTarascaCard/>);
        return(
            <div style={{textAlign:"center", padding:20, width:"90%", display:"inline-block"}}>  
                <Grid container spacing={24}
                        justify="center"
                        alignItems="stretch"
                        direction="column">
                    <Grid item>
                        {this.state.gotTarasca ? (
                                <Typography variant="display1">You own the Tarasca Card</Typography>
                            ) : (
                                <Typography variant="display1">You don't own the Tarasca Card</Typography>
                            )} 
                    </Grid>
                    <Grid item container spacing={24}
                        justify="center"
                        alignItems="stretch"
                        direction="row"
                    >
                        <Grid item className="boxed" style={{marginTop: 10, marginBottom:10, backgroundColor:'rgb(16 57 43)', border:'1px solid', borderColor:'#ffffff3b'}}>
                            <CardInfo card={this.state.card}/>
                        </Grid>
                        <Grid item>
                            <CardImageNoButton card={this.state.card}/> 
                        </Grid>
                        <Grid item className="boxed" style={{marginTop: 10, marginBottom:10, backgroundColor:'rgb(16 57 43)', border:'1px solid', borderColor:'#ffffff3b'}}>
                        {posess ?
                            <Grid container spacing={24}
                                justify="center"
                                alignItems="stretch"
                                direction="column"
                            >
                                <Grid item>
                                    <ExchangeData nodeurl={this.props.nodeurl} card={this.state.card}/>
                                </Grid>
                                <Grid item>
                                    <Link style={{textDecoration: 'none'}} to={"/game/place/bid/"+this.state.card.asset}>
                                        <Button fullWidth variant="outlined" disabled={!posess}>Place a Buy Order (Bid)</Button>
                                    </Link>        
                                </Grid>
                                <Grid item>
                                    <Link style={{textDecoration: 'none'}} to={"/game/place/ask/"+this.state.card.asset}>
                                        <Button fullWidth variant="outlined" disabled={!posess}>Offer this Card (Ask)</Button>
                                    </Link>        
                                </Grid>
                                <Grid item>
                                    <Link style={{textDecoration: 'none'}} to={"/game/send/"+this.state.card.asset}>
                                        <Button fullWidth variant="outlined" disabled={!posess}> Send</Button>
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link style={{textDecoration: 'none'}} to={"/game/learnmore/"+this.state.card.asset}>
                                        <Button fullWidth variant="outlined" disabled={!posess}> Learn More</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                            :
                            <Grid container spacing={24}
                                justify="center"
                                alignItems="stretch"
                                direction="column"
                            >
                                <Grid item>
                                    <ExchangeData nodeurl={this.props.nodeurl} card={this.state.card}/>
                                </Grid>
                                <Grid item>
                                    <Button fullWidth variant="outlined" disabled={!posess}>Place a Buy Order (Bid)</Button>
                                </Grid>
                                <Grid item>
                                    <Button fullWidth variant="outlined" disabled={!posess}>Offer this Card (Ask)</Button>
                                </Grid>
                                <Grid item>
                                    <Button fullWidth variant="outlined" disabled={!posess}> Send</Button>
                                </Grid>
                                <Grid item>
                                    <Button fullWidth variant="outlined" disabled={!posess}> Learn More</Button>
                                </Grid>
                            </Grid>
                        }
                        </Grid>
                    </Grid>
                    <Grid item>
                        {out}
                    </Grid>
                </Grid>
            </div>
        )
    }
}



export const NoTarascaCard = (props) => {
    return (
        <div style={{textAlign:"center", padding:20, width:"90%", maxWidth:"540px", display:"inline-block"}}>
            <Grid container
                justify="center"
                direction="column"
                alignItems="stretch"
                spacing={24}
                style={{maxWidth:540}}
            >
                <Grid item>
                    <Typography variant="body2">
                        You don't posess a Tarasca Card.
                    </Typography>
                    <Typography variant="body2">
                        This is a special card that some get when they won the jackpot. It is very rare! 
                        You need to claim the jackpot, there are XYZ more Tarasca Cards available! 
                        Alternatively you can bid for one on the <Link style={{color:"inherit"}} to="/game/exchange">Exchange</Link>.
                    </Typography>
                </Grid>
            </Grid>
        </div>
    )
}


export const TarascaCard = (props) => {
    return (
        <div style={{textAlign:"center", padding:20, width:"90%", maxWidth:"540px", display:"inline-block"}}>
            <Grid container
                justify="center"
                direction="column"
                alignItems="stretch"
                spacing={24}
                style={{maxWidth:540}}
            >
                <Grid item>
                    <Typography variant="body2">
                        You posess a Tarasca Card! It is a very rare card, and every holder is receiving a share of the card sales.
                    </Typography>
                </Grid>
            </Grid>
        </div>
    )
}



class ExchangeData extends Component {
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
      getAskOrders(this.props.nodeurl,TARASCACARDASSET)
      .then((response) => {
        self.setState({askOrders:response.askOrders});
      });
      getBidOrders(this.props.nodeurl,TARASCACARDASSET)
      .then((response) => {
        self.setState({bidOrders:response.bidOrders});
      });
    }
  
    componentDidMount(){
      this.refresh();
      this.timer = setInterval(this.refresh,5000);
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
            <Grid container
                justify="center"
                direction="column"
                alignItems="stretch"
                spacing={24}
                >

                <Grid item>
                    <Typography variant='h4'>
                        Current ask price
                    </Typography>
                    <Typography variant='h6'>
                        {ask}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant='h4'>
                        Current bid price
                    </Typography>
                    <Typography variant='h6'>
                        {ask}
                    </Typography>
                </Grid>
            </Grid>
        );
    }
  }
