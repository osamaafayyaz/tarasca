// landing for a new user.

import React from 'react';
import {ShowQrCode} from './showqrcode';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
//import Link from '@material-ui/core/Link';
import {Link} from 'react-router-dom';

export const NewUserLanding = (props) => {
    return (
        <div style={{textAlign:"center", padding:20, width:"90%", maxWidth:"540px", display:"inline-block"}}>
            <Grid container
                justify="center"
                direction="column"
                alignItems="stretch"
                spacing={24}
                style={{maxWidth:540}}
            >
                <Grid item>
                    <Typography variant="display1">
                        Welcome to Mythical Beings
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body2">
                        You seem to have no funds nor cards yet.
                    </Typography>
                    <Typography variant="body2">
                        Fund your account using <Link style={{color:"inherit"}} to="/game/fundaccount">Changelly</Link>
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body2">
                        Or let some friends send you something, they need to scan your address:
                    </Typography>
                </Grid>
                <Grid item>
                    <ShowQrCode {...props}/>    
                </Grid>                
            </Grid>
        </div>
    )
}