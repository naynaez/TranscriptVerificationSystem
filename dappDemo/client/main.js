import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from 'meteor/mongo'
import './main.html'
import './register.html'
import './result.html'


Router.route('/',
{
  template: 'home'
});
Router.route('/register',
{
  template: 'register'
});
Router.route('/result',
{
  template: 'result'
});

function strcmp ( str1, str2 ) {
  return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
}

///////////////////// XXX Unlock Account  ////////////////////
function unlockAccount(accountToUnlock,passPhrase) {
  web3.personal.unlockAccount(accountToUnlock, passPhrase, 300);
}

///////////////////// Create Transaction //////////////////
//data 36 byte
function createTransaction(regTranscriptHash,universityPublicKey) {
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
function getOrigTranscriptHash(txHashForQuery) {
  var transaction = web3.eth.getTransaction(txHashForQuery);
  var origTranscriptHash = transaction.input;
  return origTranscriptHash;
}

downloadPDF = function() {
  var personalAttr = ['faculty','department','studentID','name','dateOfBirth','dateOfAdmission','dateOfGraduation','degree','major','Total number of credit earned','Cumulative GPA'];
  var personalAttrDisp = ['Faculty','Department','Student ID','Student Name','Date Of Birth','Date Of Admission','Date Of Graduation','Degree','Major','Total number of credit earned','Cumulative GPA'];
  var subjectsAttr = ['semester','subjectCode','subjectName','credit','grade']
  var dataStr = JSON.stringify(transcriptData);
  var printStr = '';
  var printDet = '';
  var printSub = '';
  var line_Y_position = 16;
  var line_X_position = 10;
  var doc = new jsPDF();
  doc.setFont("times");
  doc.setFontSize(9);
  doc.setFontType("normal");
  //display name
  printStr = JSON.stringify(transcriptData['personalData']['instituteName']);
  doc.text(line_X_position+96,line_Y_position,printStr.split('"')[1],null,null,'center');
  line_Y_position += 4;
  //display detail
  for(var i = 0; i < 9; i++) {
    printStr = JSON.stringify(personalAttrDisp[i]);
    printDet = JSON.stringify(transcriptData['personalData'][personalAttr[i]]);
    if(i == 0) {
      doc.text(line_X_position+80,line_Y_position,printStr.split('"')[1]+' of ');
      doc.text(line_X_position+94,line_Y_position,printDet.split('"')[1]);
      line_Y_position += 4;
    }
    if(i == 1) {
      doc.text(line_X_position+74,line_Y_position,printStr.split('"')[1]+' of ');
      doc.text(line_X_position+94,line_Y_position,printDet.split('"')[1]);
      line_Y_position += 4;
    }
    if(i != 0 && i != 1) {
      doc.text(line_X_position,line_Y_position,printStr.split('"')[1]+' : '+printDet.split('"')[1]);
      line_Y_position += 4;
    }
  }
  line_Y_position += 4;
  //Check Semester
  var semester = [];
  for(var i = 0 ; i < transcriptData['subjects'].length ; i++) {
     if(semester.indexOf(transcriptData['subjects'][i]['semester']) === -1) {
         semester.push(transcriptData['subjects'][i]['semester']);
     }
  }
  //Display Subject
  for(var k = 0 ; k < semester.length ; k++) {
    printSem = JSON.stringify(semester[k])
    doc.text(line_X_position+32,line_Y_position,'Semester : '+printSem.split('"')[1]);
    line_Y_position += 4;
    for(var i = 0; i < transcriptData['subjects'].length; i++) {
      if(transcriptData['subjects'][i]['semester'] == semester[k]) {
        for(var j = 1; j < 5; j++) {
          printSub = JSON.stringify(transcriptData['subjects'][i][subjectsAttr[j]]);
          if(j == 1) {
            doc.text(line_X_position,line_Y_position,printSub.split('"')[1]);
          }
          if(j == 3) {
            doc.text(line_X_position+85,line_Y_position,printSub.split('"')[1]);
          }
          if(j == 4) {
            doc.text(line_X_position+89,line_Y_position,printSub.split('"')[1]);
          }
          if(j == 2) {
            printSub = printSub.split('"')[1]
            doc.text(line_X_position+14,line_Y_position,printSub.slice(0,35));
            doc.text(line_X_position+14,line_Y_position+4,printSub.slice(35,));
            if(printSub.length > 35) {
              line_Y_position += 4;
            }
          }
        }line_Y_position += 4;
        if(line_Y_position > 284) {
          line_X_position = 110;
          line_Y_position = 60;
        }
      }
    }
    // Display GPS GPA
    for(var i = 0; i < transcriptData['grade'].length; i++) {
      if(transcriptData['grade'][i]['semester'] == semester[k]) {
          printGPS = JSON.stringify(transcriptData['grade'][i]['GPS']);
          printGPA = JSON.stringify(transcriptData['grade'][i]['GPA']);
          doc.text(line_X_position+28,line_Y_position,'GPS : '+printGPS.split('"')[1]+'  GPA : '+printGPA.split('"')[1]);
      }
    }line_Y_position += 4;
  }
  line_Y_position += 4;
  for(var i = 9; i < 11; i++) {
    printStr = JSON.stringify(personalAttr[i]);
    printDet = JSON.stringify(transcriptData['personalData'][personalAttr[i]]);
    doc.text(line_X_position,line_Y_position,printStr.split('"')[1]+' : '+printDet.split('"')[1]);
    line_Y_position += 4;
  }

  doc.save(transcriptData['personalData']['name']+'.pdf');
}

readFile_veri = function() {
      /// Read file and parse to variable(obj)
    var fileToLoad = document.getElementById("fileToLoad").files[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
      var textFromFileLoaded = fileLoadedEvent.target.result;
      try
      {
        var obj = JSON.parse(textFromFileLoaded);
      }
      catch(e)
      {
        alert("Invalid transcript file.");
      }

      var txHash = obj['txHash']  // read txHash from JSON file
      delete obj['txHash'];     // delete txHash for new hashing

      var objString = JSON.stringify(obj);
      var objStringHash = web3.sha3(objString);  // Hash in string
      console.log(objStringHash);
      /// read Transaction Hash
      var isFileInvalid = false;

      console.log("txHash: " + txHash)
      try
      {
        var origTranscriptHash = getOrigTranscriptHash(txHash);
      }
      catch(e)
      {
        if(txHash != null) {
          alert("Cannot get data from Blockchain. Please try again.");
        }
        else {
          alert("txHash does not exist. Please try another transcript file.");
        }
        isFileInvalid = true;
      }

      /// compare hash
      var cmpResult = false;
      if(!strcmp(origTranscriptHash,objStringHash)) {  // equal
        cmpResult = true;
      }
      else {    // not equal
        cmpResult = false;
      }

      /// Sustain result and transcript data to another pages
      try
      {
        Session.setPersistent("data", obj) ;
        Session.setPersistent("cmpResult", cmpResult) ;
      }
      catch(e)
      {
        alert("Session erro. Please try again.");
      }
      if(!isFileInvalid) {   /// Go to result page if there is no error.
        Router.go('result');
      }
    };
    try
    {
      fileReader.readAsText(fileToLoad, "UTF-8");
    }
    catch(e)
    {
      alert("Invalid transcript file. Please try again.");
    }
}

readFile_regis = function() {
  /// Read file and parse to variable(obj)
  var fileToLoad = document.getElementById("fileToLoad").files[0];
  var fileReader = new FileReader();
  fileReader.onload = function(fileLoadedEvent) {
    var textFromFileLoaded = fileLoadedEvent.target.result;
    var obj = JSON.parse(textFromFileLoaded);
    var objLength = obj.length;
    var JSZip = require("jszip");

    // init array
    var objString = [];
    var objStringHash = [];
    var txHash = []
    var fileStr = []
    var fileName = []
    var file = []
    for(var i = 0 ; i< objLength ; i++ ) {
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
    try
    {
      web3.personal.unlockAccount(regPubKey,regPassph,60);  // unlock account for 60 secconds
    }
    catch(e)
    {
      alert("Incorrect username or passphrase.");
    }

    for(var i = 0 ; i < objLength ; i++ ) {
        objString[i] = JSON.stringify(obj[i]);
        objStringHash[i] = web3.sha3(objString[i]); // Hash file in string
        console.log(objString[i])

        /// Store data in Blockchain
        try
        {
          txHash[i] = createTransaction(objStringHash[i], regPubKey); // Store data and receive txHash value
        }
        catch(e)
        {
          alert("Cannot create Transaction for index:" + i);
        }
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
