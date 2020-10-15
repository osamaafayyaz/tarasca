// cancel order

import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { validatePassPhrase } from '../common/validators';

import { getAskOrder, getBidOrder, cancelAskOrder, cancelBidOrder} from '../common/ardorinterface';
import {SignActionField} from '../common/signactionfield';
import { fetchCard } from '../common/common';
import { CardInfo } from '../common/cardinfo';
import { Typography } from '@material-ui/core';

import { NQTDIVIDER } from '../common/constants';
import { TxSuccess } from '../common/txsuccess';


function OrderInfo({order}) {
    return(
        <Fragment>
            <Grid item>
                <Typography variant="body1">height: {order.height}</Typography>
            </Grid>
            <Grid item>
                <Typography variant="body1">price: {order.priceNQTPerShare/NQTDIVIDER}</Typography>
            </Grid>
            <Grid item>
                <Typography variant="body1">quantity: {order.quantityQNT}</Typography>
            </Grid>
            <Grid item>
                <Typography variant="body1">type: {order.type}</Typography>
            </Grid>
        </Fragment>
    );
}



export class CancelAskOrder extends Component{
    constructor(props){
        super(props);
        this.state={
            order:{},
            card:{},
            passPhrase:"",
            passPhraseStatus:"",
            bought:false
        }
        this.handlePassphraseChange = this.handlePassphraseChange.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
    }

    componentDidMount(){
        var self = this;
        getAskOrder(self.props.nodeurl,self.props.match.params.order)
        .then(function(response) {
            //console.log(response);
            self.setState({order:response});
            fetchCard(self.props.nodeurl,self.props.user.accountRs,response.asset)
            .then((response) => {
                //console.log(response);
                self.setState({card:response});
            })
        })
    }

    cancelOrder(){
        var self = this;
        cancelAskOrder(this.props.nodeurl,2,this.state.order.order,this.state.passPhrase)
        .then(function(response){
            self.setState({response:response,responseTime:response.data.requestProcessingTime,bought:true,status:"success"});
          })
          .catch(function(error) {
            console.log("error caught!");
            console.log(error);
          });
    }
    
    handlePassphraseChange(value){
    this.setState(
        {passPhrase:value},
        ()=>{let fieldStatus = validatePassPhrase(value,this.state.passPhraseStatus);
            this.setState({passPhraseStatus:fieldStatus, formValid:!fieldStatus.invalid});}
        );
    }

    render(){
        //console.log(this.state);
        //console.log(this.props);
        
        if (this.state.bought){
            return(<TxSuccess/>)
        }
        else {
            return (           
                <div style={{textAlign:"center", padding:20, display:"inline-block"}}>               
                    <form onSubmit={(event)=>{event.preventDefault();this.cancelOrder()}}>
                        <Grid container
                            justify="center"
                            alignItems="stretch" 
                            direction="column"
                            spacing={24}             
                            style={{maxWidth:"500px",width:"500px"}}
                            className="boxed"
                        >
                        <Grid item style={{textAlign:"left"}}>
                            <Typography variant="display1">Asset details</Typography>
                            <CardInfo card={this.state.card}/>
                        </Grid>
                        <Grid item style={{textAlign:"left"}}>
                        <Typography variant="display1">Order details</Typography>
                            <OrderInfo order={this.state.order}/>
                        </Grid>
                        <Grid item style={{textAlign:"left"}}>
                            <Typography variant="display1">Enter PIN to cancel order</Typography>
                        </Grid>
                        <Grid item>
                            <SignActionField  {...this.props} 
                                        handlePassphraseChange={this.handlePassphraseChange} 
                                        action={this.cancelOrder}
                                    />
                            </Grid>
                        </Grid>
                    </form>
                </div>
            )
        }
    }
}


export class CancelBidOrder extends Component{
    constructor(props){
        super(props);
        this.state={
            order:{},
            card:{},
            passPhrase:"",
            passPhraseStatus:"",
            bought:false
        }
        this.handlePassphraseChange = this.handlePassphraseChange.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
    }

    componentDidMount(){
        var self = this;
        getBidOrder(self.props.nodeurl,self.props.match.params.order)
        .then(function(response) {
            //console.log(response);
            self.setState({order:response});
            fetchCard(self.props.nodeurl,self.props.user.accountRs,response.asset)
            .then((response) => {
                //console.log(response);
                self.setState({card:response});
            })
        })
    }

    cancelOrder(){
        var self = this;
        cancelBidOrder(this.props.nodeurl,2,this.state.order.order,this.state.passPhrase)
        .then(function(response){
            self.setState({response:response,responseTime:response.data.requestProcessingTime,bought:true,status:"success"});
          })
          .catch(function(error) {
            console.log("error caught!");
            console.log(error);
          });
    }
    
    handlePassphraseChange(value){
    this.setState(
        {passPhrase:value},
        ()=>{let fieldStatus = validatePassPhrase(value,this.state.passPhraseStatus);
            this.setState({passPhraseStatus:fieldStatus, formValid:!fieldStatus.invalid});}
        );
    }

    render(){
        //console.log(this.state);
        //console.log(this.props);
        
        if (this.state.bought){
            return(<TxSuccess/>)
        }
        else {
            return (
                <div style={{textAlign:"center", padding:20, display:"inline-block"}}>
                    <form onSubmit={(event)=>{event.preventDefault();this.cancelOrder()}}>
                        <Grid container
                            justify="center"
                            alignItems="stretch" 
                            direction="column"
                            spacing={24}             
                            style={{maxWidth:"500px",width:"500px"}}
                            className="boxed"
                        >
                        <Grid item style={{textAlign:"left"}}>
                            <Typography variant="display1">Asset details</Typography>
                            <CardInfo card={this.state.card}/>
                        </Grid>
                        <Grid item style={{textAlign:"left"}}>
                        <Typography variant="display1">Order details</Typography>
                            <OrderInfo order={this.state.order}/>
                        </Grid>
                        <Grid item style={{textAlign:"left"}}>
                            <Typography variant="display1">Enter PIN to cancel order</Typography>
                        </Grid>
                        <Grid item>
                            <SignActionField  {...this.props} 
                                        handlePassphraseChange={this.handlePassphraseChange} 
                                        action={this.cancelOrder}
                                    />
                            </Grid>
                        </Grid>
                    </form>
                </div>
            )
            }
    }
}