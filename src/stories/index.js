import React from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import StoryRouter from 'storybook-react-router';
import { storiesOf } from '@storybook/react';

import { Balance, Wallet } from '../wallet/wallet';
import { Login, Landing} from '../login/login';
import LoginForm from '../login/loginform';
import { GeneratePassphrase, SetupReturningUser} from '../login/account';
import {CardDeck} from '../carddeck/carddeck';
import {UserDisplay} from '../wallet/user';

import {getImageURL} from '../common/ardorinterface';
import axios from 'axios';

var zeroprops = {};
zeroprops.ignis = {balance:0,unconfirmedBalance:0,divider:1};
zeroprops.currency = {balance:0,unconfirmedBalance:0,divider:1};
zeroprops.account = "ARDOR-MAL-NEMA-RKIS-COOL";

var someprops = {};
someprops.ignis = {balance:1,unconfirmedBalance:2,divider:1};
someprops.currency = {balance:32,unconfirmedBalance:2,divider:1};
someprops.account = "ARDOR-MAL-NEMA-RKIS-COOL";

var unconfprops = {};
unconfprops.ignis = {balance:0,unconfirmedBalance:2.1,divider:1};
unconfprops.currency = {balance:0,unconfirmedBalance:222,divider:1};
unconfprops.account = "ARDOR-MAL-NEMA-RKIS-COOL";

const nodeurl="https://testardor.jelurida.com/nxt";
const collectionCurrency = "8633185858724739856";
const mainAccount = "ARDOR-DGWV-XWH9-7F85-HGWK6";

function getLogoUrl(nodeurl, account="ARDOR-DGWV-XWH9-7F85-HGWK6") {
  var logoUrl="";
  return axios.get(nodeurl,{
    params: {
      requestType:"getAccount",
      account:account
      }
  })
  .then(function (response) {
    let description = JSON.parse(response.data.description);
    let fullHash = description.logo
    let logourl = getImageURL(nodeurl,fullHash);
    console.log(logourl);
    //self.setState({main:response.data, logourl:logourl});
    return logourl;
  });
}

storiesOf('Balance', module)
  .add('no props', () => <Balance />)
  .add('zero balance', () =>  (<Balance {...zeroprops.ignis}/>))
  .add('some balance', () =>  (<Balance {...someprops.ignis} />))
  .add('non-zero unconfed balance', () =>  (<Balance {...unconfprops.ignis}/>));


storiesOf('Wallet', module)
  .add('no props', () => <Wallet />)
  .add('zero balance', () =>  (<Wallet {...zeroprops}/>))
  .add('some balance', () =>  (<Wallet {...someprops} />))
  .add('non-zero unconfed balance', () =>  (<Wallet {...unconfprops}/>));

var logoUrl = "https://testardor.jelurida.com/nxt?requestType=downloadTaggedData&chain=IGNIS&transactionFullHash=6db06c6f5b067ae277409e4840263be5d29b3f6378d3f8374739c50c8f1739aa&retrieve=true";

storiesOf('Login',module)
  .add('no props', () => (<Login userAccount="ARDOR-MAL-NEMA-RKIS-COOL" 
                                  setUserAccount={(event)=> {console.log(event)}}
                                  logourl={logoUrl}/>));

storiesOf('LoginForm',module)
.add('no props', () => <LoginForm />);
  

const cards = [
  {name:"Ace of Spades", description: "black card", assetId:"1",quantity:1,unconfirmedQuantity:1,imageurl:"http:image.url",orders:"none"},
  {name:"King of Spades", description: "black king card", assetId:"2",quantity:1,unconfirmedQuantity:1,imageurl:"http:image.url",orders:"none"},
  {name:"10 of Spades", description: "black 10", assetId:"3",quantity:1,unconfirmedQuantity:1,imageurl:"http:image.url",orders:"none"},    
]


storiesOf('CardDeck',module)
.addDecorator(StoryRouter())
.add('no props', () => <CardDeck />)
.add('w cards', ()=>(<CardDeck cards={cards} match={{url:"card"}}/>));

storiesOf('Landing', module)
  .add('no props', ()=>(<Landing/>));

storiesOf('NewUser', module)
  .add('no props', ()=>(<NewUser/>));


const divStyle = {
  backgroundColor: 'Black',
  width:'60%'
};

const h1Style = {
  fontSize:'240px',
  textAlign:'center'
}

const h2Style = {
  fontSize:'30px',
  textAlign:'center',
  color:"White"
}

storiesOf('Hugo',module)
    .add('Drei Fragezeichen', ()=> (
      <div style={divStyle}>
        <h1 style={h1Style}>
          <span style={{color:"Red"}}>
            ?
          </span>
          <span style={{color:"Blue"}}>?</span>
          <span style={{color:"White"}}>?</span>
        </h1>
        <h2 style={h2Style}>Die Drei Fragezeichen</h2>
      </div>
    ));


const user = { accountRs: "ARDOR-DGWV-XWH9-7F85-HGWK6", name: "Malnemark", usePin: false, token: "" }
const userPin = { accountRs: "ARDOR-DGWV-XWH9-7F85-HGWK6", name: "Malnemark", usePin: true, token: "asdklvnaweronvao2ß2fmfm2ßfkf,vaökljn" }


storiesOf('UserDisplay',module)
    .add('no pin', ()=> (<UserDisplay {...user}/>))
    .add('pin',()=>(<UserDisplay {...userPin}/>));