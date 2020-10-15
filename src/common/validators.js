import {secretPhraseToAccountId} from 'ardorjs';


function validateQuantity(value,max,min,status) {
  let invalid=status.invalid;
  let error=status.error;
  let val_num = new Number(value);
  console.log(value,max,min,invalid,error,val_num);
  if (value!==''){
    invalid = !(value.match('[1-9]\d*|0\d+'));
    error = invalid ? value+' is not a number.' : '';
    if (val_num<=max && val_num >= min){
      // its a number!
      if (val_num%1!==0){
          return {invalid:true, error:'You can only buy whole packs'};
      }
      return {invalid:invalid, error:error};
    }
    else if (val_num>max) {
      invalid = true;
      error=value+' is over the maximum amount ('+max+').';
      return {invalid:invalid, error:error};
    }
    else if (val_num<min){
      invalid = true;
      error=value+' is below the minimum amount ('+min+').';
      return {invalid:invalid, error:error};
    }
  }
  else {
    invalid = false;
    error = '';
  }
  return {invalid:invalid, error:error};
}


function validatePrice(value,max,min,status) {
  let invalid=status.invalid;
  let error=status.error;
  let val_num = new Number(value);
  //console.log(value,max,min,invalid,error);
  if (value!==''){
    invalid = !(value.match('[1-9]\d*|0\d+'));
    error = invalid ? value+' is not a number.' : '';
    if (val_num<=max && val_num >= min){
      return {invalid:invalid, error:error};
    }
    else if (val_num>max) {
      invalid = true;
      error=value+' is over the maximum of '+max+' Ignis.';
      return {invalid:invalid, error:error};
    }
    else if (val_num<min){
      invalid = true;
      error=value+' is below the minimum of '+min+' Ignis.';
      return {invalid:invalid, error:error};
    }
  }
  else {
    invalid = false;
    error = '';
  }
  return {invalid:invalid, error:error};
}


export function validateUsername(value,status,userList){
  let user_existing = userList.find((el)=> el === value);
  let length = value.length;
  if (user_existing){
    return {invalid:true, error:"User name is already taken"};
  }
  else if (length === 0) {
    return {invalid:true, error:"User name can't be empty"};
  }
  return {invalid:false, error:""};
}


function validatePassPhrase(value,status,account){
  let invalid=false;
  let error=""; 
  let accountFromPhrase = secretPhraseToAccountId(value,false);

  if (accountFromPhrase != account){
    invalid = true;
    error = "This pass phrase belongs to account "+accountFromPhrase;
    return {invalid:invalid, error:error};
  }
  else {
    return {invalid:invalid, error:error};
  }
}

export function validatePhraseLength(value,status){
  let invalid=status.invalid;
  let error=status.error;

  if (value!==''){
    invalid = value.length<20;
    error = invalid ? 'phrase looks too short.' : '';
  }
  else {
    // case if field is empty
    invalid = false;
    error = '';
  }
  return {invalid:invalid, error:error};
}


function validateAddress(value,status){
  let invalid=status.invalid;
  let valid;
  let error=status.error;
  //console.log(value.match('^ARDOR-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}'));
  invalid = value.match('^ARDOR-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}') ? false : true;
  // -[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{4}-[A-Z0-9_]{5}
  error = invalid ? "this doesn't look like a valid ARDOR address." : '';
  //console.log(value,invalid,error);
  return({invalid:invalid,error:error});
}

function eqSet(userSet, collectionSet) {
    //returns true if bs has all items of set as.
    // eqSet(collection, user) to check if user has collection complete
    for (var assetId of collectionSet) {
      if (!userSet.has(assetId)) {
        return false;
      }
    }
    return true;
}

function validateWinner(userAssets,collectionAssets){
  // function to check if every asset of the collection exists at least once in
  // the users' assets
  const userSet = new Set(userAssets.map(asset=>{return asset.asset}));
  const collectionSet = new Set(collectionAssets.map(asset=>{return asset.asset}));

  const intersection = new Set([...userSet].filter(x => collectionSet.has(x)));

  const sets_equal = eqSet(intersection,collectionSet);

  const blockedAssets = [];
  /*const blockedAssets = intersection.filter(function(asset) {
    let unconfed = asset.unconfirmedQuantityQNT == 0;
    let confed = asset.quantityQNT == 0;
    return (confed | unconfed)
  });*/

  // difference between intersection (all user's cards) and collection
  //let difference = new Set([...intersection].filter(x => !collectionSet.has(x)));
  let difference = new Set([...collectionSet].filter(x => !intersection.has(x)));
  // the difference are the missing cards.

  return {complete:sets_equal,blockedAssets:blockedAssets,missingAssets:[...difference],totalNum:collectionAssets.length};
}

export function validatePin(value, status){
  let invalid=status.invalid;
  let error=status.error;
  
  invalid = value.length < 4 ? true : false;
  error = invalid ? "too short" : '';
  return({invalid:invalid,error:error});
}

export {validatePrice, validatePassPhrase, validateQuantity, validateAddress, validateWinner};
