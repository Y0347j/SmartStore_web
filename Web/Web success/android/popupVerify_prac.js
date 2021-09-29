var express = require('express');
var http = require('http');
var bodyParser= require('body-parser');
var app = express();
var db =require('../lib/db');

app.set('port',process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(function(request, response,next){
  console.log('개인정보 수정시 비밀번호 확인 테스트');
  var result ={'resultCode':'FAIL'};

  var paramCmd = request.body.cmd;
  var paramId = request.body.id;
  var paramPassword = request.body.pw;

  var selectCnt = 'SELECT COUNT(*) as cnt FROM employee WHERE login_id=?';
  var select = 'SELECT * FROM employee WHERE login_id=?';
  console.log('id : '+paramId+'  pw : '+paramPassword);
  console.log(paramCmd);
  if(paramCmd == 'VerifyEmp'){
  db.query(selectCnt,[paramId],function(error,Row){
    console.log(Row[0].cnt)
    if(Row[0].cnt > 0){
      db.query(select,[paramId],function(error1,employees){
        if(error1){
          throw errorl;
        }
        console.log(employees);
        if(paramPassword == employees[0].password) result.resultCode='OK';
        response.send(result);
      });
    }
  });
  }else{
    next();
  }
});

var server = http.createServer(app).listen(app.get('port'),function(){
   console.log("익스프레스로 웹 서버를 실행함 : "+ app.get('port'));
});
