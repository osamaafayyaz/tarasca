import React from 'react';
import Button from '@material-ui/core/Button';

import {CardDeck} from '../carddeck/carddeck';
import { NewUserLanding } from './newuser';


export const Balance = ({balance,unconfirmedBalance,divider=1}) => {
  console.log(balance);
  var displayBalance;
  if (balance === unconfirmedBalance) {
    displayBalance = balance/divider;
  }
  else if (balance === undefined) {
    displayBalance = 0;
  }
  else {
    displayBalance = <span className="muted">{unconfirmedBalance/divider}</span>;
  }

  return(
    <div>
      ${displayBalance} 
      <Button color="link" className="btn-light">
        Send
      </Button>
    </div>
  )
}


export const Wallet = (props) => {
  //console.log(props);
  if (!props.userIsNew) {
    return(
      <div>
        <CardDeck {...props} />
      </div>
    )
  }
  else {
    return(
      <div>
        <NewUserLanding {...props}/>
      </div>
    );
  }
}



