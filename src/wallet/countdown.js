// countdown

import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import {getBlockchainStatus} from '../common/ardorinterface';
import {FREQUENCY, BLOCKTIME} from '../common/constants';


export class CountDown extends Component{
    constructor(props){
        super(props);
        this.state = {
            blockChainStatus:{numberOfBlocks:FREQUENCY},
            timer:BLOCKTIME
        }
        this.refresh=this.refresh.bind(this);
    }

    componentDidMount(){
        var self = this;
        self.refresh();
        console.log("CountDown: start refresh");
        self.timer = setInterval(self.refresh,1000);        
    }

    componentWillUnmount(){
        console.log("CountDown: stop refresh");
        clearInterval(this.timer);
        clearInterval(this.timerTimer);
    }

    refresh(){
        var self = this;

        let prev_timer = self.state.timer;
        self.setState({timer:prev_timer-1});

        getBlockchainStatus(this.props.nodeurl)
        .then((response)=>{
            let prev_height = self.state.blockChainStatus.numberOfBlocks;
            if (prev_height != response.data.numberOfBlocks) {
                self.setState({timer:BLOCKTIME})                
            }
            self.setState({blockChainStatus:response.data});
        })
        .catch((error)=>{console.log(error);})

    }

    render(){
        const modulo = this.state.blockChainStatus.numberOfBlocks%FREQUENCY;
        const remainingBlocks = FREQUENCY - modulo;
        const remainingSecs = remainingBlocks * BLOCKTIME;

        
        const delta = remainingSecs-(BLOCKTIME - this.state.timer);
        const days = Math.floor(delta/(60*60*24));
        var date = new Date(null);
        date.setSeconds(delta); // specify value for SECONDS here
        var result = date.toISOString().substr(11, 8);

        return (
            <Grid container spacing={8}
                justify="center"
                alignItems="center"
                direction="column"
                className="boxed"
                style={{border:'1px solid', borderColor:'#ffffff3b'}}
            >
                <Grid item>
                    <Typography variant="h3">Countdown</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h5">until next distribution</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="display2">
                    {days.toString().padStart(2,'0')}:{result}
                    </Typography>
                    <Typography variant="body1">
                        (dd:hh:mm:ss)
                    </Typography>                    
                </Grid>
                <Grid item> 
                    <Typography variant="h4" style={{textAlign:'center'}}>Remaining Blocks</Typography>
                </Grid>
                <Grid item> 
                    <Typography variant="display1">{remainingBlocks}</Typography>
                </Grid>
                <Grid item> 
                    <Typography variant="h4" style={{textAlign:'center'}}>Time to next Block</Typography>
                </Grid>
                <Grid item> 
                    <Typography variant="display1">{this.state.timer} secs</Typography>
                </Grid>
                <Grid item> 
                    <Typography variant="h4" style={{textAlign:'center'}}>Jackpot Block</Typography>
                </Grid>
                <Grid item> 
                    <Typography variant="display1">{this.state.blockChainStatus.numberOfBlocks+remainingBlocks}</Typography>
                </Grid>
                <Grid item> 
                    <Typography variant="h4" style={{textAlign:'center'}}>Current Height</Typography>
                </Grid>
                <Grid item> 
                    <Typography variant="display1">{this.state.blockChainStatus.numberOfBlocks}</Typography>
                </Grid>
            </Grid>
        )
    }
}

