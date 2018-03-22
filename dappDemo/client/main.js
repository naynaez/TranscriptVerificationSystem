import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
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




console.log("Hello");
var primary = "0x31026b17b78dc930cfb57232f647f7ac97520374"  // Account in Localhost
console.log(web3.fromWei(web3.eth.getBalance(primary)).c,"ether");
console.log(getOrigTranscriptHash("0x6425f318885746ab14577bce87f8e38a2afedb9436ab4c6f0c6161933b341fa8"));

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







// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.readBalance = new ReactiveVar(0);
// });

// Template.hello.helpers({
//   readBalance() {

//     var template = Template.instance();

//     console.log("Hello");
//     var ethAddress = "0x31026b17b78dc930cfb57232f647f7ac97520374"  // Account in Localhost

//     //console.log(web3.eth.getBalance(ethAddress));
//     web3.eth.getBalance(ethAddress,
//       function (err,res){
//         TemplateVar.set(template,"readBalance",res);
//         console.log("1234");
//     })
//   },
// });