downloadPDF = function(){
  var personalAttr = ['faculty','department','studentID','name','dateOfBirth','dateOfAdmission','dateOfGraduation','degree','major','Total number of credit earned','Cumulative GPA'];
  var subjectsAttr = ['semester','subjectCode','subjectName','credit','grade']
  var dataStr = JSON.stringify(transcriptData);
  var printStr = '';
  var printDet = '';
  var printSub = '';
  var line_Y_position = 25;
  var line_X_position = 20;
  var doc = new jsPDF();
  doc.setFont("times");
  doc.setFontType("normal");
  //display name
  printStr = JSON.stringify(transcriptData['personalData']['instituteName']);
  doc.text(line_X_position+30,line_Y_position,printStr.split('"')[1]);
  line_Y_position += 10;
  //display detail
  for(var i = 0; i < 9; i++){
    printStr = JSON.stringify(personalAttr[i]);
    printDet = JSON.stringify(transcriptData['personalData'][personalAttr[i]]);
    if(i == 0) {
      doc.text(line_X_position+60,line_Y_position,printStr.split('"')[1]+' of ');
      doc.text(line_X_position+85,line_Y_position,printDet.split('"')[1]);
      line_Y_position += 10;
    }
    if(i == 1) {
      doc.text(line_X_position+50,line_Y_position,printStr.split('"')[1]+' of ');
      doc.text(line_X_position+85,line_Y_position,printDet.split('"')[1]);
      line_Y_position += 10;
    }
    if(i != 0 && i != 1){
      doc.text(line_X_position,line_Y_position,printStr.split('"')[1]+' : '+printDet.split('"')[1]);
      line_Y_position += 10;
    }
  }
  line_Y_position += 10;
  //Display Subject
  var semester = [];
  for(var i = 0 ; i < transcriptData['subjects'].length ; i++){
     if(semester.indexOf(transcriptData['subjects'][i]['semester']) === -1){
         semester.push(transcriptData['subjects'][i]['semester']);
     }
  }
  for(var k = 0 ; k < semester.length ; k++) {
    printSem = JSON.stringify(semester[k])
    doc.text(line_X_position+60,line_Y_position,'Semester : '+printSem.split('"')[1]);
    line_Y_position += 10;
    for(var i = 0; i < transcriptData['subjects'].length; i++) {
      if(transcriptData['subjects'][i]['semester'] == semester[k]){
        for(var j = 1; j < 5; j++){
          printSub = JSON.stringify(transcriptData['subjects'][i][subjectsAttr[j]]);
          if(j == 1) {
            doc.text(line_X_position,line_Y_position,printSub.split('"')[1]);
          }
          if(j == 2){
            doc.text(line_X_position+25,line_Y_position,printSub.split('"')[1]);
          }
          if(j == 3){
            doc.text(line_X_position+150,line_Y_position,printSub.split('"')[1]);
          }
          if(j == 4){
            doc.text(line_X_position+155,line_Y_position,printSub.split('"')[1]);
          }
        }line_Y_position += 10;
      }
    }
    // Display GPS GPA
    for(var i = 0; i < transcriptData['grade'].length; i++) {
      if(transcriptData['grade'][i]['semester'] == semester[k]) {
          printGPS = JSON.stringify(transcriptData['grade'][i]['GPS']);
          printGPA = JSON.stringify(transcriptData['grade'][i]['GPA']);
          doc.text(line_X_position+55,line_Y_position,'GPS : '+printGPS.split('"')[1]+'  GPA : '+printGPA.split('"')[1]);
      }
    }line_Y_position += 10;
  }
  line_Y_position += 10;
  for(var i = 9; i < 11; i++){
    printStr = JSON.stringify(personalAttr[i]);
    printDet = JSON.stringify(transcriptData['personalData'][personalAttr[i]]);
    doc.text(line_X_position,line_Y_position,printStr.split('"')[1]+' : '+printDet.split('"')[1]);
    line_Y_position += 10;
  }

  doc.save(transcriptData['personalData']['name']+'.pdf');

}
