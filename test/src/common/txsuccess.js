import React from 'react';
import {Link} from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';



export function TxSuccess({response,returnLink}){
  const everythingOk =  response ? (response.data.errorCode === undefined) : true;
  const message = everythingOk ? "" : "An error occurred."
  const detail = response ? (response.data.errorDescription) : "";
  return(
    <div style={{textAlign:"center", padding:20}}>
      {
        everythingOk ? 
        (
          <Grid container
                justify="center"
                alignItems="center"
                direction="column"
                spacing={40}>
            <Grid item>
              <Typography variant='h4'>
                Transaction Sent
              </Typography>
            </Grid>
            <Grid item>
              <Link style={{textDecoration: 'none'}} to="/game">
                  <Button fullWidth variant="outlined">Back to My Cards</Button>
              </Link>      
            </Grid>
            <Grid item>  
              <Link style={{textDecoration: 'none'}} to="/game/exchange">
                  <Button fullWidth variant="outlined">Back to Exchange</Button>
              </Link>    
            </Grid>    
          </Grid>
        ) : (
          <Grid container
                justify="center"
                alignItems="center"
                direction="column"
                spacing={40}>
            <Grid item>
              <Typography>{message}</Typography>
            </Grid>
            <Grid item>
              <Typography>{detail}</Typography>
            </Grid>
          </Grid>
        )
      }
    </div>
  )
}