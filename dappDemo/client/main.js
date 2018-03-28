import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from 'meteor/mongo'
import './main.html';
import './register.html'
import './result.html'

Router.route('/', {
  template: 'home'
});
Router.route('/register', {
  template: 'register'
});
Router.route('/result', {
  template: 'result'
});




// console.log("Hello");
var primary = "0x31026b17b78dc930cfb57232f647f7ac97520374"  // Account in Localhost
// console.log(web3.fromWei(web3.eth.getBalance(primary)).c,"ether");
// console.log(getOrigTranscriptHash("0x6425f318885746ab14577bce87f8e38a2afedb9436ab4c6f0c6161933b341fa8"));
//web3.personal.unlockAccount(primary,"THE FIRST TEST TO GET NEW ACCOUNT");
//console.log(createTransaction("0xb3b6ff0ded354a13fe9dcb055a7c9a814c52f60acb7e7129ad17144537379da3",primary));
//0x8b549d61c12979e343e36fb4cf1eca27ceb12c459a3a1dc3e921b46bd90f06da
ClientData = new Mongo.Collection(null);
ClientData.insert({name: "ABC", text:"Hello, world!."});
console.log(ClientData.find({name:"ABC" }).fetch());
///////////////////// XXX Unlock Account  ////////////////////
function unlockAccount(accountToUnlock,passPhrase){
  web3.personal.unlockAccount(accountToUnlock, passPhrase, 300);
} 

///////////////////// Create Transaction //////////////////
//data 36 byte
//var regTranscriptHash = "0x74657374206372656174696e67207472616e73616374696f6e20";
//var universityPublicKey = "0x93878957f62e21dd9cb63c760a6e98325a2ea17e";
function createTransaction(regTranscriptHash,universityPublicKey){
  txHash = web3.eth.sendTransaction(
    {
      from: universityPublicKey,
      value: 0,
      gas: 100000,
      gasPrice: 0,
      data: regTranscriptHash
    }
  );
  return txHash;
}


/////////////// Get data from transaction //////////////////
function getOrigTranscriptHash(txHashForQuery){
  var transaction = web3.eth.getTransaction(txHashForQuery);
  var origTranscriptHash = transaction.input;
  return origTranscriptHash;
}


 readFile_veri = function(){
  var fileToLoad = document.getElementById("fileToLoad").files[0];
  var fileReader = new FileReader();
  fileReader.onload = function(fileLoadedEvent){
  var textFromFileLoaded = fileLoadedEvent.target.result;
  var obj = JSON.parse(textFromFileLoaded);
  var objString = JSON.stringify(obj);

  var objStringHash = web3.sha3(objString);
  console.log(textFromFileLoaded);
  console.log(objStringHash);

  /// get Transaction Hash
  var tempTxHash = "0x8b549d61c12979e343e36fb4cf1eca27ceb12c459a3a1dc3e921b46bd90f06da";
  var origTxHash = getOrigTranscriptHash(tempTxHash);
  console.log("origTxHash is ");
  console.log(origTxHash);
  /// compare hash
  var cmpResult = false;
  if(!strcmp(origTxHash,objStringHash)){  // equal
    cmpResult = true;
  }
  else{    // not equal
    cmpResult = false;
  }
  Session.setPersistent("data", obj) ;
  Session.setPersistent("cmpResult", cmpResult) ;
  Router.go('result');
  };
  fileReader.readAsText(fileToLoad, "UTF-8");
  
}   
readFile_regis = function(){
  var fileToLoad = document.getElementById("fileToLoad").files[0];
  var fileReader = new FileReader();
  fileReader.onload = function(fileLoadedEvent){
  var textFromFileLoaded = fileLoadedEvent.target.result;
  var obj = JSON.parse(textFromFileLoaded);
  var objString = JSON.stringify(obj);

  var objStringHash = web3.sha3(objString);
  console.log(textFromFileLoaded);
  console.log(objStringHash);

  console.log(obj['first_name']);
  // Unlock Account
  var regPubKey =  document.getElementById("regPubK").value;
  var regPassph =  document.getElementById("regPriK").value;
  web3.personal.unlockAccount(regPubKey,regPassph,20);
  /// Store data in Blockchain
  //txHash = createTransaction(objStringHash, regPubKey);
  //console.log(txHash);
  // Send data to Result
  


  // combine file

  };
  fileReader.readAsText(fileToLoad, "UTF-8");

}   

function strcmp ( str1, str2 ) {
  return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
}