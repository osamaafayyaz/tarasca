import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { CardImageNoButton, CardInfo } from '../common/cardinfo';
import { fetchCard } from '../common/common';


export class CardDetail extends Component {
    constructor(props){
        super(props);
        this.state={
            card:{}
        }
        this.refresh = this.refresh.bind(this);
        //console.log(monster);
    }

    refresh(){
        var self = this;
        console.log(this.props);
        fetchCard(this.props.nodeurl,this.props.user.accountRs,this.props.match.params.asset)
        .then((response)=>{
          let card = response;
          self.setState({card:card});
        })
        .catch((err)=>{console.log(err)});
    }


    componentDidMount(){
        this.refresh();
        this.timer = setInterval(this.refresh,9000);
      }
    
    componentWillUnmount(){
        clearInterval(this.timer);
    }

    render(){
        const posess = this.state.card.quantityQNT > 0;
        //console.log(monster[this.state.card.asset].monster);
        return (        
            <div style={{textAlign:"center", padding:20, width:"90%", display:"inline-block"}}>  
                <Grid container spacing={24}
                    justify="center"
                    alignItems="stretch"
                    direction="row"
                >
                    <Grid item className="boxed" style={{marginTop: 10, marginBottom:10, backgroundColor:'rgb(16 57 43)', border:'1px solid', borderColor:'#ffffff3b'}}>
                        <CardInfo card={this.state.card}/>
                        <Grid container spacing={24}
                            justify="center"
                            alignItems="stretch"
                            direction="column"
                            style={{marginTop:20}}
                        >
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
                    </Grid>
                    <Grid item>
                        <CardImageNoButton card={this.state.card}/> 
                    </Grid>
                </Grid>
            </div>
        );
    }

}