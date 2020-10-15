import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';


function Iframe(props) {
  return (<div dangerouslySetInnerHTML={ {__html:  props.iframe?props.iframe:""}} />);
}

export const FundAccount = ({name}) => {
  //console.log(props);
  return(
    <div style={{textAlign:"center", padding:20, width:"90%", maxWidth:"540px", display:"inline-block", paddingTop:40, paddingBottom:40}}>
        <Grid container
            justify="center"
            alignItems="stretch"
            direction="column"
            spacing={24}
            className="boxed"
        >
            <Grid item>
                <Typography variant="h6">Hey there, fund your account {name}!</Typography>
            </Grid>
            <Grid item>
                <Typography variant="h4">Monetary System Box</Typography>
                <Typography variant="body1">This will contain a simple interface to buy GIFTZ with Ignis.</Typography>
                <Typography variant="body1">Not yet implemented.</Typography>
            </Grid>
            <Grid item>
                <Typography variant="h4">Changelly</Typography>
                   <Iframe iframe={'<iframe src="https://widget.changelly.com?from=*&to=ignis&amount=50&address=&fromDefault=eur&toDefault=ignis&theme=default&merchant_id=5zk2vil3u4s8witr&payment_id=&v=2" width="100%" height="600" class="changelly" scrolling="no" style="min-width: 100%; width: 100px; overflow-y: hidden; border: none">Cant load widget</iframe>'}/>                   
            </Grid>
        </Grid> 
    </div>
  );
}