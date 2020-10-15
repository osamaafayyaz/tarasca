import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import {Claim} from './claim';
import {getIgnisBalance} from '../common/ardorinterface';
import {fetchJackpotState, fetchCard} from '../common/common';
import { CheckProgress } from './progress';
import { NQTDIVIDER } from '../common/constants';
import { CountDown } from './countdown';


function JackpotJumbotron({Jackpot}) {
  return(
    <Grid container spacing={8}
      justify="center"
      alignItems="center"
      direction="column"
      className="boxed"
      style={{border:'1px solid', borderColor:'#ffffff3b'}}
    >
      <Grid item>
        <Typography variant="h3">Jackpot</Typography>
      </Grid>
      <Grid item> 
        <Typography variant="display1">{Jackpot.balanceNQT/NQTDIVIDER} Ignis</Typography>
      </Grid>
    </Grid>
  )
}



export class Jackpot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Jackpot:{balanceNQT:"",unconfirmedBalanceNQT:""},
      blocked:[],
      missing:[],
      complete:false
    }
    this.refresh = this.refresh.bind(this);
  }

  refresh(){
    var self = this;
    console.log("JackpotDisplay: refreshing state");
    fetchJackpotState(this.props.nodeurl,this.props.user.accountRs,this.props.collectionAccount)
    .then(function(response){
      var missingPromises = response.missingAssets.map((asset)=>{
        return fetchCard(self.props.nodeurl,self.props.user.accountRs,asset).then(card=>(card));
      })
      Promise.all(missingPromises).then((missingCards)=>self.setState({missing:missingCards}));

      var blockedPromises = response.blockedAssets.map((asset)=>{
        return fetchCard(self.props.nodeurl,self.props.user.accountRs,asset).then(card=>(card));
      })
      Promise.all(blockedPromises).then((blockedCards)=>{self.setState({blocked:blockedCards})});
      self.setState({complete:response.complete,totalNum:response.totalNum});
    })
    .catch(function(error) {console.log(error)});

    getIgnisBalance(this.props.nodeurl,this.props.collectionAccount)
    .then(function(response){
        self.setState({Jackpot:response,loading:false});
    });
  }

  componentDidMount() {
    this.refresh()
    this.timer = setInterval(this.refresh, 12000)
  }

  componentWillUnmount(){
    console.log("Jackpot: stop refresh");
    clearInterval(this.timer);
  }

  render(){
    //const claimActive = (<Button color="alert" onClick={this.toggleClaim}>Claim the Price!</Button>)
    //const claimNotActive = (<Button color="secondary" onClick={this.toggleStatus}>
    //                        Check your progress</Button>)
    // const canClaim = (this.state.complete) & (this.state.missing.length == 0) & (this.state.blocked.length == 0)
    // displays the buttons to claim the pot. removed for now
    //const output =  canClaim ? claimActive : claimNotActive;

    return(
      <div style={{textAlign:"center", padding:20, width:"90%", display:"inline-block", marginBottom:20}}>
        <Grid container
          justify="flex-start"
          alignItems="flex-start"
          direction="row"
          spacing={24}
          style={{marginTop:20}}
        >
          <Grid container
            justify="center"
            alignItems="stretch"
            direction="column"
            spacing={24}
            xs={12} lg={3}
            style={{paddingRight:20,paddingTop:20}}
          >
              <Grid item style={{textAlign:"right"}}>
                <CountDown {...this.props}/>
              </Grid>
              <Grid item style={{textAlign:"right"}}>
                <JackpotJumbotron Jackpot={this.state.Jackpot}/>
              </Grid>
          </Grid>
          <Grid container
            justify="center"
            alignItems="center"
            direction="column"
            spacing={24}
            xs={12} lg={9}
            style={{paddingRight:20,paddingTop:20}}
          >
              <Grid item>
                <CheckProgress {...this.props} {...this.state}/>        
              </Grid>
            {this.state.complete? (
              <Grid item className="boxed" style={{border:'1px solid', borderColor:'#ffffff3b'}}>
                <Claim {...this.props} {...this.state}/>
              </Grid>
            ) : (
              <Grid item className="boxed" style={{border:'1px solid', borderColor:'#ffffff3b'}}>
                <Typography>Complete the collection to claim the jackpot.</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
    )
  }
}