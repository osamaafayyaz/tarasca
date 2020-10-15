// Ardor Interface
import axios from 'axios';
import qs from 'qs';
import {NQTDIVIDER} from './constants';
import {secretPhraseToPublicKey,signTransactionBytes} from 'ardorjs';

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

//building the logo url
export function getImageURL(nodeurl,fullHash) {
  const params = new URLSearchParams();
  const queryparams = {
    requestType:"downloadTaggedData",
    chain:"IGNIS",
    transactionFullHash:fullHash,
    retrieve:true
  };
  for (const [key, val] of Object.entries(queryparams)) {
      params.append(key, val);
  }
  const url = nodeurl+'?'+params.toString();
  return url;
}


function getTransactionBytes(nodeurl,query) {
  console.log(nodeurl,query);
  return axios.post(nodeurl, qs.stringify(query), config).then(function(response) {
    return response.data;
  });
}


//Account balance
export function getIgnisBalance(nodeurl,account){
  return axios.get(nodeurl,{
    params: {
      requestType:"getBalance",
      chain:"IGNIS",
      account:account
      }
  })
  .then(function (response) {
    return response.data;
  });
}

export function getAccountCurrentAskOrders(nodeurl,account) {
  return axios.get(nodeurl, {
        params: {
          requestType:"getAccountCurrentAskOrders",
          chain:"IGNIS",
          account:account
          }
      })
      .then(function(response) {
        return response.data;
      });
  }

export function getAccountCurrentBidOrders(nodeurl,account) {
  return axios.get(nodeurl, {
        params: {
          requestType:"getAccountCurrentBidOrders",
          chain:"IGNIS",
          account:account
          }
      })
      .then(function(response) {
        return response.data;
      });
  }

export function getAskOrders(nodeurl,asset) {
  return axios.get(nodeurl, {
        params: {
          requestType:"getAskOrders",
          chain:"IGNIS",
          asset:asset,
          }
      })
      .then(function(response) {
        return response.data;
      });
  }


export function getBidOrders(nodeurl,asset) {
  return axios.get(nodeurl, {
        params: {
          requestType:"getBidOrders",
          chain:"IGNIS",
          asset:asset,
          }
      })
      .then(function(response) {
        return response.data;
      });
  }

export function getAskOrder(nodeurl,order) {
  return axios.get(nodeurl, {
    params: {
      requestType:"getAskOrder",
      chain:"IGNIS",
      order:order,
      }
  })
  .then(function(response) {
    return response.data;
  });
}

export function getBidOrder(nodeurl,order) {
  return axios.get(nodeurl, {
    params: {
      requestType:"getBidOrder",
      chain:"IGNIS",
      order:order,
      }
  })
  .then(function(response) {
    return response.data;
  });
}

export function getAssetsByIssuer(nodeurl,account) {
  return axios.get(nodeurl, {
        params: {
          requestType:"getAssetsByIssuer",
          account:account
          }
      })
      .then(function(response) {
        return response.data.assets[0];
      });
  }


export function getAccount(nodeurl,account) {
  return axios.get(nodeurl, {
    params : {
      requestType:"getAccount",
      account:account
    }
  })
  .then(function(response) {
    return response;
  })
}

export function getAssets(nodeurl,assets) {
  return axios.get(nodeurl, {
        params: {
          requestType:"getAssets",
          assets:assets
          }
      })
      .then(function(response) {
        //console.log(response);
        return response.data.assets[0];
      });
  }

export function getAccountAssets(nodeurl,account) {
  return axios.get(nodeurl, {
      params: {
        requestType:"getAccountAssets",
        includeAssetInfo:false,
        account:account
        }
    })
    .then(function(response) {
      return response.data.accountAssets;
    })
  }

export function getAccountCurrencies(nodeurl,account,currency) {
  return axios.get(nodeurl, {
      params: {
        requestType:"getAccountCurrencies",
        account:account,
        currency:currency
        }
    })
    .then(function(response) {
      return response.data;
    })
  }

function sendIgnis(nodeurl, amountNQT, recipient, passPhrase, message, messagePrunable=true){
  console.log('sendIgnis()');
  let recipientNew = false;
  getAccount(nodeurl,recipient).then(
    function(response) {
      if (response.data.errorCode === 5 || response.data.errorCode === 4) recipientNew = true;
    }
  )
  
  const publicKey = secretPhraseToPublicKey(passPhrase);
  var query = {
    chain:2,
    recipient:recipient,
    amountNQT:amountNQT,
    feeNQT: -1,
    feeRateNQTPerFXT: -1,
    deadline:15,
    broadcast:false,
    publicKey:publicKey,
    message:message,
    messageIsPrunable:messagePrunable
  };
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  
  console.log('get minimumFee');
  const url_sendmoney = nodeurl+'?requestType=sendMoney';
  const url_broadcast = nodeurl+'?requestType=broadcastTransaction';
  return axios.post(url_sendmoney, qs.stringify(query), config)
          .then(function(response) {
            console.log(response);
            if (recipientNew) {query.feeNQT = 3.2*NQTDIVIDER;}
            else   {query.feeNQT = response.data.minimumFeeFQT *response.data.bundlerRateNQTPerFXT*0.00000001;}

            query.broadcast = false;
            console.log('get transactionBytes');
            return axios.post(url_sendmoney, qs.stringify(query), config)
                .then(function(response){
                  const signed = signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                  var txdata;
                  if (message !==""){
                    let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                    txdata = {transactionBytes:signed, prunableAttachmentJSON:txattachment};
                  }
                  else {
                    txdata = {transactionBytes:signed};
                  }
                  console.log("sending signed transaction");
                  return axios.post(url_broadcast, qs.stringify(txdata), config)
                        .then(function(response){
                          return response;
                        })
                })
          });
  }


export function cancelAskOrder(nodeurl, chain, order, passPhrase){
  console.log('cancelAskOrder()');
  const publicKey = secretPhraseToPublicKey(passPhrase);
  var query = {
    chain:2,
    order:order,
    feeNQT: -1,
    feeRateNQTPerFXT: -1,
    deadline:15,
    broadcast:false,
    publicKey:publicKey,
  };
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  console.log('get minimumFee');
  const url_sendmoney = nodeurl+'?requestType=cancelAskOrder';
  const url_broadcast = nodeurl+'?requestType=broadcastTransaction';
  return axios.post(url_sendmoney, qs.stringify(query), config)
          .then(function(response) {
            query.feeNQT = response.data.minimumFeeFQT*response.data.bundlerRateNQTPerFXT*0.00000001;
            query.broadcast = false;
            console.log('get transactionBytes');
            return axios.post(url_sendmoney, qs.stringify(query), config)
                .then(function(response){
                  const signed = signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                  var txdata;
                  txdata = {transactionBytes:signed};
                  console.log("sending signed transaction");
                  return axios.post(url_broadcast, qs.stringify(txdata), config)
                        .then(function(response){
                          return response;
                        })
                })
          });
}


export function cancelBidOrder(nodeurl, chain, order, passPhrase){
  console.log('cancelBidOrder()');
  const publicKey = secretPhraseToPublicKey(passPhrase);
  var query = {
    chain:2,
    order:order,
    feeNQT: -1,
    feeRateNQTPerFXT: -1,
    deadline:15,
    broadcast:false,
    publicKey:publicKey,
  };
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  console.log('get minimumFee');
  const url_sendmoney = nodeurl+'?requestType=cancelBidOrder';
  const url_broadcast = nodeurl+'?requestType=broadcastTransaction';
  return axios.post(url_sendmoney, qs.stringify(query), config)
          .then(function(response) {
            query.feeNQT = response.data.minimumFeeFQT*response.data.bundlerRateNQTPerFXT*0.00000001;
            query.broadcast = false;
            console.log('get transactionBytes');
            return axios.post(url_sendmoney, qs.stringify(query), config)
                .then(function(response){
                  const signed = signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                  var txdata;
                  txdata = {transactionBytes:signed};
                  console.log("sending signed transaction");
                  return axios.post(url_broadcast, qs.stringify(txdata), config)
                        .then(function(response){
                          return response;
                        })
                })
          });
}


export function getTrades(nodeurl,chain,account,timestamp){
  return axios.get(nodeurl, {
    params: {
      requestType:"getTrades",
      chain:chain,
      account:account,
      timestamp:timestamp,
      includeAssetInfo:true
    }
  })
  .then(function(response) {
    return response.data;
  })
}

function transferCurrency(nodeurl, currency, unitsQNT, recipient, passPhrase, message="", messagePrunable=true){
  console.log('transferCurrency()');
  let recipientNew = false;
  getAccount(nodeurl,recipient).then(
    function(response) {
      if (response.data.errorCode === 5 || response.data.errorCode === 4) recipientNew = true;
    }
  )
  
  const publicKey = secretPhraseToPublicKey(passPhrase);
  var query = {
    chain:2,
    recipient:recipient,
    currency:currency,
    unitsQNT:unitsQNT,
    feeNQT:-1,
    feeRateNQTPerFXT: -1,
    deadline:15,
    broadcast:false,
    publicKey:publicKey,
    message:message,
    messageIsPrunable:messagePrunable
  };
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  console.log('get minimumFee');
  const url_sendmoney = nodeurl+'?requestType=transferCurrency';
  const url_broadcast = nodeurl+'?requestType=broadcastTransaction';
  return axios.post(url_sendmoney, qs.stringify(query), config)
          .then(function(response) {
            console.log(response);
            if (recipientNew) 
              {query.feeNQT = 3.2*NQTDIVIDER;}
            else   
              {query.feeNQT = response.data.minimumFeeFQT*response.data.bundlerRateNQTPerFXT*0.00000001;}
            
            query.broadcast = false;
            console.log('get transactionBytes');
            return axios.post(url_sendmoney, qs.stringify(query), config)
                .then(function(response){
                  const signed = signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                  var txdata;
                  if (message !==""){
                    let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                    txdata = {transactionBytes:signed, prunableAttachmentJSON:txattachment};
                  }
                  else {
                    txdata = {transactionBytes:signed};
                  }
                  console.log("sending signed transaction");
                  return axios.post(url_broadcast, qs.stringify(txdata), config)
                        .then(function(response){
                          return response;
                        })
                })
          });
  }

  function transferCurrencyZeroFee(nodeurl, currency, unitsQNT, recipient, passPhrase, message="", messagePrunable=true){
    console.log('transferCurrencyZeroFee()');
    let recipientNew = false;
    getAccount(nodeurl,recipient).then(
      function(response) {
        if (response.data.errorCode === 5 || response.data.errorCode === 4) recipientNew = true;
      }
    )
    
    const publicKey = secretPhraseToPublicKey(passPhrase);
    var query = {
      chain:2,
      recipient:recipient,
      currency:currency,
      unitsQNT:unitsQNT,
      feeNQT:0,
      feeRateNQTPerFXT: 0,
      deadline:15,
      broadcast:false,
      publicKey:publicKey,
      message:message,
      messageIsPrunable:messagePrunable
    };
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    console.log('get minimumFee');
    const url_sendmoney = nodeurl+'?requestType=transferCurrency';
    const url_broadcast = nodeurl+'?requestType=broadcastTransaction';
    return axios.post(url_sendmoney, qs.stringify(query), config)
            .then(function(response) {
              console.log(response);
              query.feeNQT = 0;
              
              query.broadcast = false;
              console.log('get transactionBytes');
              return axios.post(url_sendmoney, qs.stringify(query), config)
                  .then(function(response){
                    const signed = signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                    var txdata;
                    if (message !==""){
                      let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                      txdata = {transactionBytes:signed, prunableAttachmentJSON:txattachment};
                    }
                    else {
                      txdata = {transactionBytes:signed};
                    }
                    console.log("sending signed transaction");
                    return axios.post(url_broadcast, qs.stringify(txdata), config)
                          .then(function(response){
                            return response;
                          })
                  })
            });
    }

function getAsset(nodeurl,asset){
  return axios.get(nodeurl, {
    params: {
      requestType:"getAsset",
      asset:asset
      }
  })
  .then(function(response) {
    return response;
  })
}

function getCurrency(nodeurl,currency){
  return axios.get(nodeurl, {
    params: {
      requestType:"getCurrency",
      currency:currency
      }
  })
  .then(function(response) {
    return response;
  })
}

function transferAsset(nodeurl,asset,quantityQNT,recipient,passPhrase,message='',messagePrunable=true) {
    console.log('transferAsset(): '+asset);
    let recipientNew = false;
    getAccount(nodeurl,recipient).then(
    function(response) {
      if (response.data.errorCode === 5 || response.data.errorCode === 4) recipientNew = true;
    }
  )
    console.log('get publicKey');
    const publicKey = secretPhraseToPublicKey(passPhrase);

    var query = {
      chain:2,
      recipient:recipient,
      quantityQNT:quantityQNT,
      asset:asset,
      feeNQT:-1,
      feeRateNQTPerFXT: -1,
      deadline:15,
      broadcast:false,
      publicKey:publicKey,
      message:message,
      messageIsPrunable:messagePrunable
    };
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    console.log('get minimumFee');
    const url_tx = nodeurl+'?requestType=transferAsset';
    const url_broadcast = nodeurl+'?requestType=broadcastTransaction';
    return axios.post(url_tx, qs.stringify(query), config)
        .then(function(response) {
          if (recipientNew) {query.feeNQT = 3.2*NQTDIVIDER;}
          else   {query.feeNQT = response.data.minimumFeeFQT*response.data.bundlerRateNQTPerFXT*0.00000001;}
          query.broadcast = false;
          console.log('get transactionBytes');
          return axios.post(url_tx, qs.stringify(query), config)
            .then(function(response){
              const signed = signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
              var txdata;
              if (message !==""){
                let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                txdata = {transactionBytes:signed, prunableAttachmentJSON:txattachment};
              }
              else {
                txdata = {transactionBytes:signed};
              }
              console.log("sending signed transaction");
              return axios.post(url_broadcast, qs.stringify(txdata), config)
                  .then(function(response){
                    return response;
                });
          });
    });
}

function getBlockchainTransactions(nodeurl,chain,account,executedOnly,timestamp,lastIndex) {
  return axios.get(nodeurl, {
    params: {
      requestType:"getBlockchainTransactions",
      chain:chain,
      account:account,
      executedOnly:executedOnly,
      timestamp:timestamp,
      lastIndex:lastIndex
    }
  })
  .then(function(response) {
    return response.data;
  })
}

function getUnconfirmedTransactions(nodeurl,chain,account,type,subtype) {
  return axios.get(nodeurl, {
    params: {
      requestType:"getUnconfirmedTransactions",
      chain:chain,
      account:account,
      type:type,
      subtype:subtype
    }
  })
  .then(function(response) {
    return response.data;
  })
}

function getConstants(nodeurl){
  return axios.get(nodeurl, {
    params: {
      requestType:"getConstants"
    }
  })
  .then(function(response) {
    return response;
  })
}

function getBlockchainStatus(nodeurl){
  return axios.get(nodeurl, {
    params: {
      requestType:"getBlockchainStatus"
      }
  })
  .then(function(response) {
    return response;
  });
}


export {getTransactionBytes, getConstants, sendIgnis, transferCurrency, transferCurrencyZeroFee, transferAsset, getAsset, getCurrency,
        getBlockchainStatus, getBlockchainTransactions, getUnconfirmedTransactions};
