// MonsterPage

import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';

import { fetchCard } from '../common/common';
import { CardImageNoButton, CardInfo } from '../common/cardinfo';
import monster from './monsters.json';
import { Hidden } from '@material-ui/core';


function Iframe(props) {
  return (<div dangerouslySetInnerHTML={ {__html:  props.iframe?props.iframe:""}} />);
}

export function MonsterInfo(props) {
    const monster = props.monster;
    return(
        <div>
          <Grid container
            justify="center"
            direction="column"
            alignItems="stretch"
            spacing={24}
          >
            <Grid item style={{textAlign:"left"}}>
              <Typography variant="body1">{monster.continent} / {monster.country} / {monster.name}</Typography>
              <Typography variant="display1">Creature</Typography>
              {
                monster.creature.map((c,index)=>(<Typography key={index} variant="body1">{c}</Typography>))
              }
              <img src={"https://cards.tarasca.org/static/images/documentation/creatures/"+monster.picture} alt=""  style={{maxWidth:"600px",width:"90%"}}/>

              <Typography variant="display1">Culture</Typography>
              {
                monster.culture.map((c,index)=>(<Typography key={index} variant="body1">{c}</Typography>))
              }
               <img src={"https://cards.tarasca.org/static/images/documentation/landscapes/"+monster.landscape} alt=""  style={{maxWidth:"600px",width:'90%'}}/>
            </Grid>
          </Grid>
        </div>
    )
}

export class MonsterPage extends Component {
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
    //console.log(this.props);
    fetchCard(this.props.nodeurl,this.props.user.accountRs,this.props.match.params.asset)
    .then((response)=>{
      //console.log(response);
      let card = response;
      card.more =  monster.find((m)=>m.assetname === response.assetname); 
      //console.log(card.more);
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


  render() {
    const m = this.state.card.more == undefined ? {continent:"",country:"",culture:[],creature:[],maplink:""} : this.state.card.more;
    return (
      <div style={{textAlign:"center", padding:20, width:"90%", display:"inline-block"}}>  
        <Grid container spacing={24}
            justify="center"
            alignItems="flex-start"
            direction="row"
        >
            <Grid item>
              <Grid container spacing={24}
                    justify="center"
                    alignItems="center"
                    direction="column"
                >
                  <Grid item>
                    <CardInfo card={this.state.card}/> 
                  </Grid>
                  {/* <Grid item>
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
                            </Grid> */}
                  <Grid item>
                    <CardImageNoButton card={this.state.card}/>                   
                  </Grid>
              </Grid>
            </Grid>
            <Grid item style={{maxWidth:"600px"}}>
              <MonsterInfo monster={m}/>
            </Grid>
            <Grid item>
              <Hidden smDown>
                <Grid container
                  justify="center"
                  direction="column"
                  spacing={24}
                  >
                    <Grid item>
                      <Iframe iframe={m.maplink}/>
                    </Grid>   
                </Grid>
              </Hidden>
            </Grid>
        </Grid>
      </div>
    )
  }
}