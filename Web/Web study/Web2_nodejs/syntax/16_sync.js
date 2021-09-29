var fs = require('fs');

// readFileSync : 동기적 방법
// console.log('A');
// var result = fs.readFileSync('syntax/sample.txt','utf8');
// console.log(result);
// console.log('C');

// Asyncronous : 비동기적 방법
console.log('A');
fs.readFile('syntax/16_sample.txt','utf8',function(err, result){
  console.log(result);
});
console.log('C');
