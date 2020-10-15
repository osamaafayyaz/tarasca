import React from 'react-dom'
import {Alert} from 'reactstrap';
import { getAskOrders, getBidOrders} from './ardorinterface';
import {getAccountAssets, getAssetsByIssuer, getAssets} from '../common/ardorinterface';
import Axios from 'axios';
import {validateWinner} from './validators';
import { IMGURL, IMG_MD_PATH, IMG_THUMB_PATH } from './constants';


export const TestnetWarning = ({isTestnet}) => {
  if (isTestnet){
    return (<Alert color="danger">TESTNET WARNING: This is a test network, do not use real accounts.</Alert>)
  }
  return null;
}


export const PrototypeWarning = ({isPrototype}) => {
  if (isPrototype){
    return (<Alert color="warning">PROTOTYPE WARNING: This is a prototype.</Alert>)
  }
  return null;
}

function getTarascaImage(name){
  const imgurl =  IMGURL+IMG_MD_PATH+name+".jpg";
  //console.log(imgurl);
  return imgurl;
}

function getThumbsImage(name){
  const imgurl =  IMGURL+IMG_THUMB_PATH+name+".jpg";
  //console.log(imgurl);
  return imgurl;
}

// export class StatusDisplay extends Component {
//   constructor(props){
//     super(props);
//     this.state = {
//         BlockchainStatus:{}
//       };
//   }

//   render() {
//     return(<div>{this.state.tarasca}</div>);
//   }
// }


// export function getCard(asset,nodeurl){
//   const cardDetails = JSON.parse(asset.description);
//   //const cardimgurl = getImageURL(nodeurl,cardDetails.fullhash);
//   const cardimgurl = IMGURL+IMG_MD_PATH+asset.name+"_md.jpg";
//   console.log(cardimgurl);
//   return ({
//     assetname : asset.name,
//     description : asset.description,
//     fullhash:cardDetails.fullhash,
//     name:cardDetails.name,
//     cardImgUrl:cardimgurl,
//     channel:cardDetails.channel,
//     quantityQNT : 0,
//     unconfirmedQuantityQNT : 0,
//     asset : asset.asset,
//   })
// }




export function cardGeneratorGrey(asset,quantityQNT,unconfirmedQuantityQNT,nodeurl, fetchOrders=false){
  //console.log(asset.description);
  //const cardDetails = JSON.parse(asset.description);
  const cardDetails = JSON.parse(asset.description.replace(/\bNaN\b/g, "null"));
  let askOrders = [];
  let bidOrders = [];
  if (fetchOrders) {
    getAskOrders(nodeurl,asset.asset)
      .then((response) => {
        askOrders = response.askOrders;
      });
    getBidOrders(nodeurl,asset.asset)
    .then((response) => {
      bidOrders = response.bidOrders;
    });
  }
  return {
    asset:asset.asset,
    assetname:asset.name,
    name:cardDetails.name,
    channel:cardDetails.channel,
    quantityQNT:quantityQNT,
    unconfirmedQuantityQNT:unconfirmedQuantityQNT,
    totalQuantitiyQNT:asset.quantityQNT,
    //cardImgUrl:getImageURL(nodeurl,cardDetails.fullhash),
    cardImgUrl:getTarascaImage(asset.name),
    cardThumbUrl:getThumbsImage(asset.name),
    askOrders:askOrders,
    bidOrders:bidOrders
  };
}


export function cardsGeneratorGrey(accountAssets,collectionAssets,nodeurl, fetchOrders=false){
var ret = [];
collectionAssets.forEach(function(asset){
  const accountAsset = accountAssets.find((a)=>a.asset===asset.asset);
  const quantityQNT = accountAsset ? accountAsset.quantityQNT : 0;
  const unconfirmedQuantityQNT = accountAsset ? accountAsset.unconfirmedQuantityQNT : 0;
  let newAsset = cardGeneratorGrey(asset,quantityQNT,unconfirmedQuantityQNT,nodeurl,fetchOrders);
  if (newAsset!==undefined){
    ret.push(newAsset);
  }
});
return ret;
}

export function fetchCard(nodeurl,accountRs,assetId, fetchOrders=false) {
  return Axios.all([
    getAccountAssets(nodeurl,accountRs),
    getAssets(nodeurl,assetId)
  ])
  .then(Axios.spread(function(accountAssets,Asset){
    const accountAsset = accountAssets.find((a)=>a.asset===Asset.asset);
    const quantityQNT = accountAsset ? accountAsset.quantityQNT : 0;
    const unconfirmedQuantityQNT = accountAsset ? accountAsset.unconfirmedQuantityQNT : 0;
    return cardGeneratorGrey(Asset,quantityQNT,unconfirmedQuantityQNT,nodeurl,fetchOrders);
  }));
}

export function fetchCards(nodeurl,accountRs,collectionRs, fetchOrders=false) {
  return Axios.all([
    getAccountAssets(nodeurl,accountRs),
    getAssetsByIssuer(nodeurl,collectionRs)
  ])
  .then(Axios.spread(function(accountAssets,collectionAssets){
    let collection = collectionAssets.filter((asset) => asset.quantityQNT>0);
    return cardsGeneratorGrey(accountAssets,collection,nodeurl,fetchOrders);
  }));
}

export function fetchJackpotState(nodeurl,accountRs,collectionRs) {
  return Axios.all([
    getAccountAssets(nodeurl,accountRs),
    getAssetsByIssuer(nodeurl,collectionRs)
  ])
  .then(Axios.spread(function(accountAssets,collectionAssets){
    let complete = validateWinner(accountAssets,collectionAssets);
    return complete;
  }));
}

export function round(value, exp) {
  if (typeof exp === 'undefined' || +exp === 0)
    return Math.round(value);

  value = +value;
  exp = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
    return NaN;

  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}