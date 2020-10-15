import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

import {PlaceAskOrder} from './cardaskorder';
import {PlaceBidOrder} from './cardbidorder';
import {OrderBooks} from './orderbook';


export function PlaceOrder(props){
  const [orderType, setOrder] = useState(props.match.params.type);
  return ( 
    <div style={{textAlign:"center", padding:20, width:"90%", display:"inline-block"}}>
      <Grid container spacing={24}
        justify="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <Grid container 
                spacing={16}
                justify="center"
                alignItems="center"
          >
            <Grid item>
              <Chip label="Ask" onClick={()=>setOrder("ask")} variant="outlined" style={orderType === 'ask'? { paddingRight:40, paddingLeft:40 ,backgroundColor:'#484848'} : { paddingRight:40, paddingLeft:40}}/>
            </Grid>
            <Grid item>
              <Chip label="Bid" onClick={()=>setOrder("bid")} variant="outlined" style={orderType === 'bid'? { paddingRight:40, paddingLeft:40 ,backgroundColor:'#484848'} : { paddingRight:40, paddingLeft:40}}/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
            {orderType==="ask" ? <PlaceAskOrder {...props}/> : <PlaceBidOrder {...props}/>}
        </Grid>
        {/* <Grid item>
          <OrderBooks {...props}/>
        </Grid> */}
      </Grid>
    </div>
  );
}


