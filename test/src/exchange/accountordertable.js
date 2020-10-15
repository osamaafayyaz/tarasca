import React from 'react';
//import {cardGenerator} from './CardDisplay';
//import {CancelOrderModal} from './TransactionsExchange';


import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
//import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TableBody from '@material-ui/core/TableBody';
import DeleteForever from '@material-ui/icons/DeleteForever';

import {Link} from 'react-router-dom';
/* <CancelOrderModal order={props.order} orderType={props.orderType} 
                          card={props.card} nodeurl={props.nodeurl} 
                          toggleModal={()=>toggleModal(!modalOpen)} 
                          modalOpen={modalOpen}/> */
                          

export function AccountOrderTable(props){
    var orders;
    //var modals;
    // console.log(props.orders);
    if (props.orders === undefined || props.orders.length === 0){
      if(props.type === 'bid') {
        orders = (<TableRow><TableCell></TableCell><TableCell>No Bids</TableCell><TableCell></TableCell><TableCell></TableCell></TableRow>);
      } else {
        orders = (<TableRow><TableCell></TableCell><TableCell>No Orders</TableCell><TableCell></TableCell><TableCell></TableCell></TableRow>);
      }
    }
    else {
      orders = props.orders.map((order) =>{
        //console.log(order);
        //const card = cardGenerator(order,props.collectionAssets,props.nodeurl);
        const card = props.cards.find((card)=>(card.asset ===order.asset))
        if (card !== undefined) {
          //const orderType = (order.type) === "ask" ? "cancelAskOrder" : "cancelBidOrder";
          let link = "/game/cancel/"+props.type+"/"+order.order;
          return (<TableRow key={order.order}>
                    <TableCell>{card.name}</TableCell>
                    <TableCell style={{textAlign:"center"}}>{order.priceNQTPerShare/props.NQTdivider}</TableCell>
                    <TableCell style={{textAlign:"center"}}>{order.quantityQNT}</TableCell>
                    <TableCell style={{textAlign:"center"}}>
                      <Link to={link}>
                        <IconButton> 
                            <DeleteForever/>
                        </IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>);
          }
        else {
          return (null);
        }
      });
    }
    return (<Table padding="dense">
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell style={{textAlign:"center"}}>Price</TableCell>
                  <TableCell style={{textAlign:"center"}}>Amount</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  { orders }
              </TableBody>
            </Table>)
}