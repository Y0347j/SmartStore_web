var testFolder = './data/';
var fs = require('fs');

fs.readdir(testFolder,function(error,filelist){
  console.log(filelist); // 결과 : 배열의 형태
})
