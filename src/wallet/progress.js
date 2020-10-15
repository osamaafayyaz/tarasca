import React, {Fragment} from 'react';
import {CardInfo} from '../common/cardinfo';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


export function CheckProgress(props) {
  console.log(props,'jaignasijgas')
  const num_completed = "You have "+(props.totalNum-props.missing.length)+" out of "+props.totalNum+" cards.";
  const completed = props.complete ? 
        "Your collection is complete!" : num_completed;
        
  const missing = props.missing.length === 0 ? 
        null : props.missing.length +" missing cards";
  const blocked = props.blocked.length === 0 ? 
        null : props.blocked.length+" blocked cards";
  const blocked_explain = props.blocked.length === 0 ? 
        null : "Do you have offered your cards? Cancel open orders to claim the prize.";
  
  return(
    <Grid container spacing={8}
              justify="center"
              alignItems="stretch"
              direction="column"
              className="boxed"
              style={{border:'1px solid', borderColor:'#ffffff3b'}}
            >
      <Grid item>
        <Typography variant="h3">Your Progress</Typography>
        <Typography variant="display1">{completed}</Typography>    
      </Grid>
      {props.missing.length > 0 ? 
        (<Fragment>  
            <Grid item>
              <Typography variant="h4">{missing}</Typography>
            </Grid>  
            <Grid container spacing={8}
              justify="space-between"
              alignItems="center"
              direction="row"
            >
              {props.missing.map((card,index)=>
                <Grid xs={3} item key={index} style={{margin:20, backgroundColor:'rgb(16 57 43)', borderRadius:20, border:'1px solid', borderColor:'#ffffff3b'}} className="boxed">
                  <CardInfo card={card}/>
                </Grid>
              )}
            </Grid>
          </Fragment>
        ) : null
      }
      {props.blocked.length > 0 ? 
        (<Fragment>
          <Grid item style={{textAlign:"left"}}>
            <Typography variant="display1">{blocked}</Typography>
          </Grid>
          <Grid container spacing={8}
            justify="space-between"
            alignItems="center"
            direction="row"
          >
            {props.blocked.map((card,index)=>
              <Grid key={index} item style={{textAlign:"left"}}>
                <CardInfo card={card}/>
              </Grid>
            )}
          </Grid>
          <Grid item style={{textAlign:"left"}}>
            {blocked_explain}   
          </Grid> 
        </Fragment>) : null
      }      
    </Grid>
  )
}

