import React, { Fragment } from 'react';

import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import CallMadeOutlinedIcon from '@material-ui/icons/CallMade';


export function Thumb({card,index,onClick,width}) {
    return(
        <div key={index} style={{width:width,float:"left"}}>
            <div>
            <img src={card.cardThumbUrl} alt="card img"
                width="100%"
                onClick={()=>onClick(index)}
                style={{opacity:card.quantityQNT > 0 ? 1 : 0.1}}/>                      
            </div>
            <div>
                <Typography>{card.name}</Typography>
            </div>
        </div>
    )
}

export function ThumbMobile({card,index,onClick,width}) {
    return (
        <div key={index} style={{width:width,float:"left"}}>
            <img src={card.cardImgUrl} alt="card img"
                width="100%"
                onClick={()=>onClick(index)}
                style={{opacity:card.quantityQNT > 0 ? 1 : 0.1}}/>                      
            <Badge badgeContent={card.quantityQNT} color="secondary">
                <Typography variant="body1">
                    {card.name}
                </Typography>
            </Badge>
        </div>
    )
}

export function ThumbExchange({card,width}) {
    return (
        <div style={{width:width,float:"center"}}>
                <img src={card.cardThumbUrl} alt="card img"
                    width="100%"
                    style={{opacity:card.quantityQNT > 0 ? 1 : 0.1}}/>                      
                <Typography variant="body1">
                    {card.name} ({card.quantityQNT}) 
                </Typography>            
        </div>
    )
}

export function ThumbExchangeRow({card,width}) {
    return (
        <Grid container
            justify="flex-start"
            direction="row"
            alignItems="center"
            spacing={8}>
            <Grid item>
                <img src={card.cardThumbUrl} alt="card img"
                    width="80px"
                    style={{opacity:card.quantityQNT > 0 ? 1 : 0.1}}/>
            </Grid>
        </Grid>
        
    )
}

export function TxThumb(card) {
    //console.log(card);
    return (
        <Fragment>
            <img src={card.cardThumbUrl} alt="card img"
                width="80px"
                style={{opacity:card.quantityQNT > 0 ? 1 : 0.1}}/>      
        </Fragment>
    )
}

export function TxThumbOut({card, timestamp, recipient}) {
    return (
        <Grid container
            justify="flex-start"
            direction="row"
            alignItems="center"
            spacing={8}>
            <Grid item>
                <img src={card.cardThumbUrl} alt="card img"
                    width="100%"
                    style={{opacity:card.quantityQNT > 0 ? 1 : 0.1}}/>
            </Grid>
            <Grid item>
                <Grid container
                    justify="center"
                    direction="column"
                    spacing={8}>
                        <Grid item></Grid>
                            <Typography variant="h6">
                                {card.name}  
                            </Typography>
                        <Grid item>
                            <Typography variant="body1">
                                ({card.channel})
                            </Typography>
                        </Grid>        
                </Grid>
            </Grid>
            <Grid item>
                <CallMadeOutlinedIcon/>
            </Grid>
            <Grid item><Typography variant="h6">{recipient}</Typography></Grid>
        </Grid>        
    )
}

export function TxThumbIn({card, timestamp, sender}) {
    return (
        <Grid container
            justify="flex-start"
            direction="row"
            alignItems="center"
            spacing={8}>
            <Grid item>
                <img src={card.cardThumbUrl} alt="card img"
                    width="100%"
                    style={{opacity:card.quantityQNT > 0 ? 1 : 0.1}}/>
            </Grid>
            <Grid item>
                <Grid container
                    justify="center"
                    direction="column"
                    spacing={8}>
                        <Grid item></Grid>
                            <Typography variant="h6">
                                {card.name}  
                            </Typography>
                        <Grid item>
                            <Typography variant="body1">
                                ({card.channel})
                            </Typography>
                        </Grid>        
                </Grid>
            </Grid>
            <Grid item>
                <CallMadeOutlinedIcon/>
            </Grid>
            <Grid item><Typography variant="h6">{sender}</Typography></Grid>
        </Grid>        
    )
}