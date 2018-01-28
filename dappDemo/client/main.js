import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.readBalance = new ReactiveVar(0);
});

Template.hello.helpers({
  readBalance() {

    var template = Template.instance();
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
    //web3.setProvider(new web3.providers.HttpProvider('https://rinkeby.infura.io'));

    // if (document.getElementById('inputtext') != null) {
    //     var str = document.getElementById("inputtext").value;
    // }
    // else {
    //     var str = null;
    // }
    // alert(str);
    console.log("Hello");
    var ethAddress = "0x0ad1da581d25f8e096f5962d9456883d92b283e5"
    //var ethAddress = "0xe8a58c8079Fd284A724675578C88495073398ea8"
    //console.log(web3.eth.getBalance(ethAddress));
    web3.eth.getBalance(ethAddress,
      function (err,res){
        TemplateVar.set(template,"readBalance",res);
    })

  },
});

// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });
