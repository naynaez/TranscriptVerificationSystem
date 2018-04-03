import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from 'meteor/mongo'
import './main.html'
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


///////////////////// XXX Unlock Account  ////////////////////
function unlockAccount(accountToUnlock,passPhrase){
  web3.personal.unlockAccount(accountToUnlock, passPhrase, 300);
} 

///////////////////// Create Transaction //////////////////
//data 36 byte
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

downloadPDF = function(){
  var jsonAttributes = ["personalData","subjects","grade"];
  var dataStr = JSON.stringify(transcriptData);
  var printStr = '';
  var line_Y_position = 20;
  var line_X_position = 20;
  var doc = new jsPDF();
  doc.setFont("times");
  doc.setFontType("normal");
  for(i = 0; i <= 2; i++){
     printStr = JSON.stringify(jsonAttributes[i]);
     doc.text(line_X_position,line_Y_position,printStr);
     line_X_position += 100;

     printStr = JSON.stringify(transcriptData[jsonAttributes[i]]);
     doc.text(line_X_position,line_Y_position,printStr);
     line_Y_position += 10;
     line_X_position = 20;

  }
  document.getElementById("pdf").data = doc;
  doc.save(transcriptData['personalData']['name']+'.pdf');
  
}

 readFile_veri = function(){
    /// Read file and parse to variable(obj)
    var fileToLoad = document.getElementById("fileToLoad").files[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
    var textFromFileLoaded = fileLoadedEvent.target.result;
    var obj = JSON.parse(textFromFileLoaded);
      
    var txHash = obj['txHash']  // read txHash from JSON file
    delete obj['txHash'];     // delete txHash for new hashing

    var objString = JSON.stringify(obj);
    var objStringHash = web3.sha3(objString);  // Hash in string

    /// read Transaction Hash
      
    console.log("txHash: " + txHash)
    var origTranscriptHash = getOrigTranscriptHash(txHash);

    /// compare hash
    var cmpResult = false;
    if(!strcmp(origTranscriptHash,objStringHash)){  // equal
      cmpResult = true;
    }
    else{    // not equal
      cmpResult = false;
    }

    /// Sustain result and transcript data to another pages
    Session.setPersistent("data", obj) ;
    Session.setPersistent("cmpResult", cmpResult) ;
    Router.go('result');
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
    
}   
readFile_regis = function(){
    /// Read file and parse to variable(obj)
    var fileToLoad = document.getElementById("fileToLoad").files[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
    var textFromFileLoaded = fileLoadedEvent.target.result;
    var obj = JSON.parse(textFromFileLoaded);
    var objLength = obj.length;

    // init array
    var objString = [];
    var objStringHash = [];
    var txHash = []
    var fileStr = []
    var fileName = []
    var file = []
    for(var i = 0 ; i< objLength ; i++ ){
      objString.push("");
      objStringHash.push("");
      txHash.push("");
      fileStr.push("");
      fileName.push("");
      file.push(new File([""],"",{type: "application/json;charset=utf-8"}));
    }
    // Unlock Account
    var regPubKey =  document.getElementById("regPubK").value;  // Get data from HTML input
    var regPassph =  document.getElementById("regPriK").value;
    web3.personal.unlockAccount(regPubKey,regPassph,60);  // unlock account for 60 secconds

    for(var i = 0 ; i < objLength ; i++ )
    {
        objString[i] = JSON.stringify(obj[i]);
        objStringHash[i] = web3.sha3(objString[i]); // Hash file in string
        console.log(objString[i])

        /// Store data in Blockchain
        txHash[i] = createTransaction(objStringHash[i], regPubKey); // Store data and receive txHash value
        obj[i]['txHash'] = txHash[i];   // Append new attribute in JSON

        // // Return new transcript with TxHash to the registra
        var FileSaver = require('file-saver');
        fileStr[i] = JSON.stringify(obj[i],null,"\t");
        fileName[i] = obj[i]['personalData']['name'] + " Transcript";
        file[i] = new File([fileStr[i]], fileName[i], {type: "application/json;charset=utf-8"});
        FileSaver.saveAs(file[i]);
    }

  };
  fileReader.readAsText(fileToLoad, "UTF-8");
}   


function strcmp ( str1, str2 ) {
  return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
}
