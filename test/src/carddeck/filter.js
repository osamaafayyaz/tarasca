import React from 'react';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import png_world from './images/world.png';


export function Filter({channels,onClick}) {
    return(
        <Grid container 
            spacing={16}
            justify="center"
            alignItems="center"
        >
            <Grid item>
                <img src={png_world} alt="World" height="40px"/>
            </Grid>
            <Grid item>
                <Chip
                    label="All continents"
                    onClick={()=>onClick("all")}
                    variant="outlined"
                />
            </Grid>
            { channels.map((chan,index) => (
                <Grid item key={index}>
                    <Chip key={index} 
                        label={chan} 
                        variant="outlined" 
                        onClick={()=>onClick(chan)}
                    />         
                </Grid>  
            ))}
        </Grid>
    )
}
