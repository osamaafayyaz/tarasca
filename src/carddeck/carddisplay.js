import React, { Fragment, Component } from 'react';
//import {Card, CardImg, CardBody, CardHeader,Button} from 'reactstrap';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Collapse from '@material-ui/core/Collapse';
import Menu from '@material-ui/core/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { withStyles } from '@material-ui/core/styles';
import { getAskOrders, getBidOrders } from '../common/ardorinterface';
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
  }, 
  badge: {
    top:20,
    right: 20
  }
});


class CardDisplay_ extends Component {
  constructor(props) {
    super(props);
    this.state={
      modalSend:false,
      modalTrade:false,
      bidOrders:[],
      askOrders:[],
      anchorEl:null,
      currentName:"ignis_balance",
    }
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget, currentName:event.currentTarget.name });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  toggleSend() {
    this.setState({modalSend:!this.state.modalSend})
  }

  toggleTrade = () => (this.setState({modalTrade:!this.state.modalTrade}))

  componentDidMount(){
    var self = this;
    getAskOrders(this.props.nodeurl,this.props.card.asset)
    .then((response) => {
      self.setState({askOrders:response.askOrders});
    });
    getBidOrders(this.props.nodeurl,this.props.card.asset)
    .then((response) => {
      self.setState({bidOrders:response.bidOrders});
    });
  }
        
//<Badge className={classes.badge} badgeContent={card.quantityQNT} color="secondary" showZero>
              
  render() {
    const posess = this.props.card.quantityQNT > 0;
    console.log(this.props.card,'nfjansfajsifnas')
    const {card, classes} = this.props;
    const {anchorEl, currentName} = this.state;
    // console.log(card,'maifnoifmasoifk')
    return (
      <Card className="boxed" className={classes.card} style={{ marginBottom:20, backgroundColor:'rgb(16 57 43)', border:'1px solid', borderColor:'#ffffff3b'}}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {card.quantityQNT}
            </Avatar>
          }
          action={
            posess?
            <IconButton aria-label="settings" name="settings" onClick={this.handleClick}>
              <MoreVertIcon />
            </IconButton> : null
          }
          title={card.name}
          subheader={card.channel}
          titleTypographyProps={{variant:'h6'}}
          style={{textAlign:'left'}}
        />
        { posess ? (
                <CardMedia className={classes.image} image={card.cardImgUrl} title={card.name} onClick={()=>{this.props.history.push("/game/card/"+card.asset)}}/>
            
          ):(
            <div className={classes.container}>
              <CardMedia className={classes.image} image={card.cardImgUrl} title={card.name}/>
              <div className={classes.overlay} style={{backgroundColor: '#333333'}}>
                <Typography variant='h4' style={{paddingBottom:10}}>Missing Card</Typography>
                <Link to={"/game/place/bid/"+card.asset} style={{textDecoration:'none'}}>
                  <Button variant="outlined">Look for Offers</Button>
                </Link>
              </div>
            </div>
          )
        }
        {/* <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {card.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Amount : {card.quantityQNT}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Continent : {card.channel}
          </Typography>
        </CardContent> */}
        {/* <CardActions style={{justifyContent: 'center', marginBottom:10, marginTop:10}}>
          <Link disabled={!posess} to={"/game/place/ask/"+card.asset} style={{textDecoration:'none'}}>
            <Button variant="outlined" disabled={!posess}>Trade</Button>
          </Link>        
          <Link disabled={!posess} to={"/game/send/"+card.asset} style={{marginRight:10,marginLeft:10,textDecoration:'none'}}>
            <Button variant="outlined" disabled={!posess}>Send</Button>
          </Link>
          <Link disabled={!posess} to={"/game/card/"+card.asset} style={{textDecoration:'none'}}>
            <Button variant="outlined" disabled={!posess}>More</Button>
          </Link>
        </CardActions> */}
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {currentName==="settings" && posess?
            (<Fragment>
              <Link className={classes.link} to={"/game/place/ask/"+card.asset} style={{textDecoration: 'none'}}>
                <ListItem button key="Trade" onClick={this.handleClose}>
                  <ListItemText primary="Trade" />
                </ListItem>
              </Link>
              <Link className={classes.link} to={"/game/send/"+card.asset} style={{textDecoration: 'none'}}>
                <ListItem button key="Send" onClick={this.handleClose}>
                    <ListItemText primary="Send" />              
                </ListItem>
              </Link>
              <Link className={classes.link} to={"/game/card/"+card.asset} style={{textDecoration: 'none'}}>
                <ListItem button key="More" onClick={this.handleClose}>
                  <ListItemText primary="More" />
                </ListItem>
              </Link>
            </Fragment>)
            : null
          }
        </Menu>
      </Card>
    );
  }
}

export const CardDisplay = withStyles(styles)(CardDisplay_);