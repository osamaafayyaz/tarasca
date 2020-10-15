import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {validatePassPhrase} from '../common/validators';
import {transferAsset} from '../common/ardorinterface';
import {TxSuccess} from '../common/txsuccess';
import {SignActionField} from '../common/signactionfield';
import { fetchCards } from '../common/common';


export class Claim extends Component {
  constructor (props){
    super(props);
    this.state = {
      passPhrase:"",
      passPhraseStatus:{invalid:undefined,error:''},
      formValid:false,
      response:{data:{message:""}},
      cards:[]
    };

    //this.confirm = this.confirm.bind(this);
    this.handlePassphraseChange = this.handlePassphraseChange.bind(this);
    this.claimThePot = this.claimThePot.bind(this);
  }

  componentDidMount(){
    console.log(this.props)
    var self = this;
    fetchCards(this.props.nodeurl,this.props.user.accountRs,this.props.collectionAccount)
    .then(function(response){
      //console.log(response);
      self.setState({cards:response});
    })
    .catch(function(error) {console.log(error)});
  }

  handlePassphraseChange(value){
    this.setState(
      {passPhrase:value},
      ()=>{let fieldStatus = validatePassPhrase(value,this.state.passPhraseStatus);
            this.setState({passPhraseStatus:fieldStatus},this.validateForm);}
    );
  }

  claimThePot(){
    var self = this;
    console.log(self.state);
    let phraseValidated = validatePassPhrase(self.state.passPhrase,self.state.passPhraseStatus,self.props.user.accountRs);
    if  (phraseValidated.invalid){
      console.log("claimThePot(): passphrase invalid, exiting.")
      self.setState({passPhraseStatus:phraseValidated},this.validateForm);
      return;
    }
    console.log("claimThePot(): passphrase ok.")
    this.state.cards.forEach(function(card){
      if (card.quantityQNT <= 0) {
        console.log("claimThePot(): card with quantitity 0 cant be sent.");
        return false;
      }
      else {
        transferAsset(self.props.nodeurl,card.asset,1,self.props.collectionAccount,self.state.passPhrase)
          .then(function(response) {
            self.setState({response:response,bought:true,status:"success"});
          });
      }
    })
  }


  validateForm() {
    this.setState({formValid: ((this.state.passPhraseStatus.invalid===false) & (this.props.complete === true))});
  }

  toggler(props){
    this.setState({bought:false});
    this.props.toggleModal();
  }

  render(){
    
    const output = (
      <form onSubmit={(event)=>{event.preventDefault();this.claimThePot()}}>
        <Grid container spacing={8}
          justify="center"
          alignItems="center"
          direction="column"
        >
          <Grid item>
            <Typography variant="display1">Claim the jackpot</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">Send 1 card each of the whole collection to claim the Jackpot.</Typography>
            <Typography variant="body1">Confirm this action by signing.</Typography>
          </Grid>      
          <Grid item>
            <SignActionField  {...this.state} {...this.props}
              handlePassphraseChange={this.handlePassphraseChange}
              action={this.claimThePot}
            /> 
          </Grid>
        </Grid>
      </form>
      )
    const out_bought = (<TxSuccess />);
    return (this.state.bought ? out_bought : output)
  }
}
