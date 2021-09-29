// C:create, R:read, U: update, D:delete
// 파일을 nodejs로 읽는 방법
// https://nodejs.org/dist/latest-v12.x/docs/api/
const fs = require('fs');
fs.readFile('05_sample.txt','utf-8',function(err,data){
  console.log(data);
})
