import React, { Fragment } from 'react';
import {Link} from 'react-router-dom';

//Material UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import MenuIcon from '@material-ui/icons/Menu';
import Settings from '@material-ui/icons/Settings';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Star from '@material-ui/icons/Star';
import Title from '@material-ui/icons/Title';
import MoneyIcon from '@material-ui/icons/Money';
import Collections from '@material-ui/icons/Collections';
import SwapCalls from '@material-ui/icons/SwapCalls';
import AddCircle from '@material-ui/icons/AddCircle';
import SaveAlt from '@material-ui/icons/SaveAlt';
import History from '@material-ui/icons/History';
import Help from '@material-ui/icons/Help';
import logo from '../login/images/tarasca_logo01_flat-white_transparent-480px.png';
//import CopyIcon from './images/copy.svg'
//import SVG from 'react-inlinesvg'

import {NQTDIVIDER} from'./constants';

//import classes from '*.module.scss';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { withStyles } from '@material-ui/core/styles';


import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Button, Badge } from '@material-ui/core';

import {round} from '../common/common';
import { BackButton } from './backbutton';

const drawerWidth = 280;

const styles = theme => ({
  root: {
    flexGrow:1,
    marginTop:60
  },
  grow: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    flexGrow:1,
    position:"fixed" 
  },
  link: {
    textDecoration: 'none'
  }
});



class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        anchorEl:null,
        currentName:"ignis_balance",
        receiveModal:false,
        buyModal:false,
        navOpen:false,
        userOpen:false,
        drawerOpen:false
    }
    
  }

  handleClick = event => {
    console.log(event.currentTarget);
    this.setState({ anchorEl: event.currentTarget, currentName:event.currentTarget.name });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };


  render() {
    //console.log(this.props);
    const {wallet, walletCurrency, classes} = this.props;
    const {anchorEl, drawerOpen, currentName} = this.state;
    const path = this.props.location.pathname
  
    const drawer = (
      <div>
        <div/>
        <Divider />
        <List>
          <Link className={classes.link} to="/game">
            <ListItem button key="Wallet" onClick={()=>this.setState({drawerOpen:false})}>
              <ListItemIcon><Collections/></ListItemIcon>
              <ListItemText primary="My Cards" />
            </ListItem>
          </Link>
          <Link className={classes.link} to="/game/history">
              <ListItem button key="History" onClick={()=>this.setState({drawerOpen:false})}>
                <ListItemIcon><History /></ListItemIcon>
                {this.props.lastUpdate.newTx !== 0 ? (
                    <Badge badgeContent={this.props.lastUpdate.newTx} color="secondary"> 
                      <ListItemText primary="Transaction History" />
                    </Badge>
                  ):(
                    <ListItemText primary="Transaction History" />                  
                  )
                }
            </ListItem>
          </Link>
          <Link className={classes.link} to="/game/exchange">
              <ListItem button key="Exchange" onClick={()=>this.setState({drawerOpen:false})}>
                <ListItemIcon><SwapCalls /></ListItemIcon>
                {this.props.lastUpdate.newTrades !== 0 ? (
                    <Badge badgeContent={this.props.lastUpdate.newTrades} color="secondary"> 
                      <ListItemText primary="Exchange" />
                    </Badge>
                  ):(
                    <ListItemText primary="Exchange" />                  
                  )
                }
              </ListItem>
          </Link>

          <Link className={classes.link} to="/game/jackpot">
              <ListItem button key="Progress" onClick={()=>this.setState({drawerOpen:false})}>
              <ListItemIcon><Star /></ListItemIcon>
              <ListItemText primary="Claim Jackpot" />
            </ListItem>
          </Link>

          <Link className={classes.link} to="/game/tarasca">
              <ListItem button key="Tarasca" onClick={()=>this.setState({drawerOpen:false})}>
              <ListItemIcon><Title /></ListItemIcon>
              <ListItemText primary="Tarasca Card" />
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <Link className={classes.link} to="/game/receive">
            <ListItem button key="Receive Card" onClick={()=>this.setState({drawerOpen:false})}>              
                <ListItemIcon><SaveAlt /></ListItemIcon>
                <ListItemText primary="Receive Card" />              
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <Link className={classes.link} to="/game/fundaccount">
            <ListItem button key="Fund Account" onClick={()=>this.setState({drawerOpen:false})}>
              <ListItemIcon><MoneyIcon /></ListItemIcon>
              <ListItemText primary="Fund Account" />
            </ListItem>
          </Link>  
          <Link className={classes.link} to="/game/settings">
            <ListItem button key="Settings" onClick={()=>this.setState({drawerOpen:false})}>
              <ListItemIcon><Settings /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </Link>  
          <Link className={classes.link} to="/game/faq">
            <ListItem button key="Faq" onClick={()=>this.setState({drawerOpen:false})}>
              <ListItemIcon><Help /></ListItemIcon>
              <ListItemText primary="Help / FAQ" />
            </ListItem>
          </Link>    
          <Link className={classes.link} to="/logout">
            <ListItem button key="Logout">
              <ListItemIcon><ExitToApp /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </Link>  
        </List>
      </div>
    );

    const ignisAvailableBalance = round(Math.min(wallet.balanceNQT/NQTDIVIDER,wallet.unconfirmedBalanceNQT/NQTDIVIDER),2);
    const fundsLocked = wallet.balanceNQT !== wallet.unconfirmedBalanceNQT;
    const ignisTotalBalance = round(wallet.balanceNQT/NQTDIVIDER,2)
    const ignisTotalBalanceStr = (<Fragment>({ignisTotalBalance})</Fragment>)
    const gammaAvailableBalance = Math.min(walletCurrency.unitsQNT,walletCurrency.unconfirmedUnitsQNT)
    const gammaLocked = walletCurrency.unitsQNT !== walletCurrency.unconfirmedUnitsQNT;
    const gammaTotalBalanceStr = (<Fragment>({walletCurrency.unitsQNT})</Fragment>)

    // this makes the backbutton show for every page except /game (exact) and game/exchange.
    // make a function out of it if more exceptions are required.
    const showMenuButton = this.props.match.isExact | this.props.location.pathname === "/game/exchange";
    
    return (
        <div className={classes.root} style={{marginTop:110}}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                  <img src={logo} alt="Logo" style={{height:100}}/>
                  <Hidden smDown>
                    <Link className={classes.link} to="/game" style={path === '/game' ? {backgroundColor:'#484848'} : {backgroundColor:'#303030'}}>
                      <ListItem button key="Wallet" onClick={()=>this.setState({drawerOpen:false})}>
                        <ListItemText primary="My Cards" />
                      </ListItem>
                    </Link>
                    <Link className={classes.link} to="/game/history" style={path === '/game/history' ? {backgroundColor:'#484848'} : {backgroundColor:'#303030'}}>
                        <ListItem button key="History" onClick={()=>this.setState({drawerOpen:false})}>
                          {this.props.lastUpdate.newTx !== 0 ? (
                              <Badge badgeContent={this.props.lastUpdate.newTx} color="secondary"> 
                                <ListItemText primary="Transaction History" />
                              </Badge>
                            ):(
                              <ListItemText primary="Transaction History" />                  
                            )
                          }
                      </ListItem>
                    </Link>
                    <Link className={classes.link} to="/game/exchange" style={path === '/game/exchange' ? {backgroundColor:'#484848'} : {backgroundColor:'#303030'}}>
                        <ListItem button key="Exchange" onClick={()=>this.setState({drawerOpen:false})}>
                          {this.props.lastUpdate.newTrades !== 0 ? (
                              <Badge badgeContent={this.props.lastUpdate.newTrades} color="secondary"> 
                                <ListItemText primary="Exchange" />
                              </Badge>
                            ):(
                              <ListItemText primary="Exchange" />                  
                            )
                          }
                        </ListItem>
                    </Link>

                    <Link className={classes.link} to="/game/jackpot" style={path === '/game/jackpot' ? {backgroundColor:'#484848'} : {backgroundColor:'#303030'}}>
                        <ListItem button key="Progress" onClick={()=>this.setState({drawerOpen:false})}>
                        <ListItemText primary="Claim Jackpot" />
                      </ListItem>
                    </Link>
                  </Hidden>
                    <Typography  variant="h6" color="inherit" className={classes.grow}>
                        {' '}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch name="showAll" checked={this.props.showAllCards}
                                onChange={this.props.toggleShowAllCards}/>
                        }
                      label="Show All Cards" 
                    />
                  <Hidden only={['lg', 'xl  ']}>
                    {showMenuButton ? (
                    <IconButton
                      color="inherit"
                      aria-label="Open drawer"
                      onClick={()=>this.setState({drawerOpen:!drawerOpen})}
                      style={{marginLeft: 'auto'}}
                    >
                      <MenuIcon />
                      </IconButton>
                    ) : (
                      <BackButton/>
                    )}
                  </Hidden>
                  <Hidden smDown> 
                    <Button variant="outlined" aria-label="ignis balance" name="ignis_balance" onClick={this.handleClick}>
                      $ {ignisAvailableBalance} {fundsLocked ? (ignisTotalBalanceStr) : null}
                    </Button>
                    <Button variant="outlined" aria-label="currency balance" name="currency_balance" onClick={this.handleClick}>
                      &Gamma; {gammaAvailableBalance} {gammaLocked ? (gammaTotalBalanceStr) : null}
                    </Button>
                    
                      <Link to="/game/tarasca">
                        <IconButton>
                          <Title />
                        </IconButton>
                        {/* <ListItem button key="Tarasca" onClick={()=>this.setState({drawerOpen:false})}>
                          <ListItemIcon><Title /></ListItemIcon>
                          <ListItemText primary="Tarasca Card" />
                        </ListItem> */}
                      </Link>
                      {/* <Link to="/game/settings">
                        <IconButton>
                            <Settings />
                        </IconButton>
                      </Link> */}
                      <Button variant="outlined" aria-label="currency balance" name="settings" onClick={this.handleClick} style={{padding: 0, border: 'none'}}>
                        <IconButton>
                            <Settings />
                        </IconButton>
                      </Button>
                      <Link to="/logout">
                        <IconButton>
                            <ExitToApp />
                        </IconButton>
                      </Link>
                    </Hidden>
                </Toolbar>
            </AppBar>
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
            {currentName==="settings" ?
              (<Fragment>
               <Link className={classes.link} to="/game/fundaccount" >
                <ListItem button key="Fund Account" onClick={this.handleClose}>
                  <ListItemText primary="Fund Account" />
                </ListItem>
              </Link>
              <Link className={classes.link} to="/game/receive">
                <ListItem button key="Receive Card" onClick={this.handleClose}>
                    <ListItemText primary="Receive Card" />              
                </ListItem>
              </Link>
              <Link className={classes.link} to="/game/settings">
                <ListItem button key="Settings" onClick={this.handleClose}>
                  <ListItemText primary="User Info" />
                </ListItem>
              </Link>  
              <Link className={classes.link} to="/game/faq">
                <ListItem button key="Faq" onClick={this.handleClose}>
                  <ListItemText primary="Help / FAQ" />
                </ListItem>
              </Link>
            </Fragment>)
            :
              currentName==="ignis_balance"? (
                <Fragment>
                  <Link className={classes.link} 
                        to={(wallet.balanceNQT==="0") ? "#" : "/game/sendignis"}>
                    <MenuItem onClick={this.handleClose}
                      disabled={wallet.balanceNQT==="0"}
                    >
                      Send
                    </MenuItem>
                  </Link>
                  <Link className={classes.link} 
                        to={(wallet.balanceNQT==="0") ? "#" : "/game/buypack"}>
                    <MenuItem onClick={this.handleClose}
                      disabled={wallet.balanceNQT==="0"}
                    >
                      Buy Cards
                    </MenuItem>
                  </Link>
                  <Link className={classes.link} to="/game/fundaccount">
                    <MenuItem onClick={this.handleClose}>Get more</MenuItem>
                  </Link>
                </Fragment>
              ):(
                <Fragment>
                  <Link className={classes.link} 
                        to={(walletCurrency.unitsQNT===0) ? "#" : "/game/sendcurrency"}>
                    <MenuItem onClick={this.handleClose}
                      disabled={walletCurrency.unitsQNT===0}
                    >
                      Send
                    </MenuItem>
                  </Link>
                  <Link className={classes.link} 
                        to={(walletCurrency.unitsQNT===0) ? "#" : "/game/buypackcur"}>
                    <MenuItem onClick={this.handleClose}
                      disabled={walletCurrency.unitsQNT===0}
                    >
                      Buy Cards
                    </MenuItem>
                  </Link>
                  <Link className={classes.link} to="/game/fundaccount">
                    <MenuItem onClick={this.handleClose}>Get more</MenuItem>
                  </Link>
                </Fragment>
              )
            }
            </Menu>
            <nav className={classes.drawer}>
            <Hidden smUp implementation="css">
              <Drawer
                variant="temporary"
                anchor={'left'}
                open={drawerOpen}
                onClose={()=>this.setState({drawerOpen:!drawerOpen})} 
              >
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
        </div>
      );
    }
}

export default withStyles(styles, {withTheme:true})(NavBar);

