import React, { Fragment } from 'react';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';



const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
  image: {
    height:450,
    width:300,
    display:"block",
    zIndex:-1,
  },
  container:{
    position:"relative",
    maxWidth:300,
    height:450,
    width:300,
  },
  overlay: {
    opacity: 0.9,
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    position:"absolute",
    zIndex:1000,
    backgroundColor:"black",
    padding: "150px 0"
  },
  media: {
    height: 450,
    width:300,
  },
  card: {
    maxWidth:300,
  }
});


// cardinfo
function CardImage_({card, classes}) {
  const posess = card.quantityQNT > 0;
  if (posess)
    {
      return (<CardMedia className={classes.image} image={card.cardImgUrl} title={card.name}/>)
    }
  else {
    return (
      <div className={classes.container}>
        <CardMedia className={classes.image} image={card.cardImgUrl} title={card.name}/>
        <div className={classes.overlay}>
          <Typography>You don't own this card</Typography>
          <Link to={"/exchange/card/"+card.asset}>
            <Button variant="outlined">Look for Offers</Button>
          </Link>
        </div>
      </div>
    )
  }
}
export const CardImage = withStyles(styles)(CardImage_);


function CardImageNoButton_({card, classes}) {
  const posess = card.quantityQNT > 0;
  if (posess)
    {
      return (<CardMedia className={classes.image} image={card.cardImgUrl} title={card.name}/>)
    }
  else {
    return (
      <div className={classes.container}>
        <CardMedia className={classes.image} image={card.cardImgUrl} title={card.name}/>
        <div className={classes.overlay}>
          <Typography>You don't own this card</Typography>
        </div>
      </div>
    )
  }
}
export const CardImageNoButton = withStyles(styles)(CardImageNoButton_);



export function CardInfo({card}) {
  return(
    <Fragment>
      <Typography variant="h4">Card Info</Typography>
      <Typography variant="h6">Name : {card.name}</Typography>
      <Typography variant="body1">Continent : {card.channel}</Typography>
      <Typography>Asset Ident : {card.asset}</Typography>
      <Typography>Amount : {card.quantityQNT} ({card.unconfirmedQuantityQNT})</Typography>
    </Fragment>
  )
}