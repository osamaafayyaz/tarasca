import Crypto from 'crypto';

// initialises the user information for localStorage
export function initUser(name,accountRs,usePin,passPhrase="",Pin=""){
  return {
    name:name, 
    accountRs:accountRs,
    usePin:usePin,
    token: (usePin) 
                ? encrypt(passPhrase,Pin) : "",
    timestamp:undefined,
    backupDone:false
  } 
}



export const encrypt = (passPhrase,Pin) => {
  var cipher = Crypto.createCipher('aes-256-cbc', Pin.toString());
  let encrypted = cipher.update(passPhrase);
  encrypted = Buffer.concat([encrypted,cipher.final()]);
  console.log("encrypt");
  console.log([passPhrase,Pin,encrypted]);
  return encrypted.toString('hex');
}

export const decrypt = (token,Pin) => {
  try {
    let encryptedText=Buffer.from(token,'hex');
    var decipher = Crypto.createDecipher("aes-256-cbc", Pin.toString());
    let decrypted = decipher.update(encryptedText);  
    decrypted = Buffer.concat([decrypted,decipher.final()]);
    console.log("decrypt");
    //console.log([token,Pin,decrypted]);
    return decrypted.toString();
  }
  catch(exception) {
    throw new Error(exception.message);
  }
}

export function registerUser(user) {
  localStorage.setItem(user.name,JSON.stringify(user));
}

export function dropUser(name) {
  localStorage.removeItem(name);
}

export function getUser(name) {
  let data = JSON.parse(localStorage.getItem(name));
  return data;
}

export function updateUser(user) {
  localStorage.setItem(user.name,JSON.stringify(user));
}

export function getAllUsers() {
  let users = JSON.parse(localStorage.getItem("users"));
  return users ? users : [];
}

export function addToAllUsers(user) {
  let users = JSON.parse(localStorage.getItem("users"));
  console.log(users);
  if (users !== null) {
    users.push(user.name);
  }
  else {
    users = [user.name];
  }
  localStorage.setItem("users",JSON.stringify(users));
}

export function removeFromAllUsers(user) {
  let users = JSON.parse(localStorage.getItem("users"));
  let newUsers = [];
  //console.log(users);
  //console.log(user);
  let ix = users.findIndex((e)=>(e === user));
  //console.log(ix);
  if (ix !== -1){
    if (ix === 0){
      newUsers = users.slice(1);
    }
    else if (ix === users.length-1){
      newUsers = users.slice(0,ix);
    }
    else {
      newUsers = users.slice(0,ix).concat(users.slice(ix+1,users.length));
    }
    //console.log(newUsers);
    localStorage.setItem("users",JSON.stringify(newUsers));
  }
}

export function updateTimestamp(name,timestamp){
  let user = getUser(name);
  if (user.timestamp < timestamp){
    user.timestamp = timestamp;
    updateUser(user);
  }
}


export function getTimestamp(name){
  let user = getUser(name);
  return user.timestamp;
}


export function getBackupDone(name){
  let user = getUser(name);
  return user.backupDone;
}

export function setBackupDone(name){
  let user = getUser(name);
  user.backupDone = true;
  updateUser(user);
}