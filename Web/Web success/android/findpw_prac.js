var express = require('express');
var http = require('http');
var bodyParser= require('body-parser');
var app = express();
var db =require('../lib/db');

app.set('port',process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(function(request, response,next){
  console.log('비밀번호 찾기 테스트');
  var result ={'resultPw':''};
  var paramCmd = request.body.cmd;
  var paramId = request.body.id;
  var paramName = request.body.name;
  var paramPhone = request.body.phone;
  var selectCnt = 'SELECT COUNT(*) as cnt FROM employee WHERE login_id=? and name=? and phoneNumber=?';
  var select = 'SELECT * FROM employee WHERE login_id=? and name=? and phoneNumber=?';
  console.log('id : '+paramId+'  name : '+paramName+'  phone : '+paramPhone);
  if(paramCmd == 'searchEmpPw'){
  db.query(selectCnt,[paramId,paramName,paramPhone],function(error,Row){
    console.log(Row[0].cnt)
    if(Row[0].cnt > 0){
      db.query(select,[paramId,paramName,paramPhone],function(error1,employees){
        if(error1){
          throw errorl;
        }
        console.log(employees);
        result.resultPw = employees[0].password ;
        response.send(result);
        });
    }else{
      response.send(result);
    }
  });
  }else{
    next();
  }
});

var server = http.createServer(app).listen(app.get('port'),function(){
   console.log("익스프레스로 웹 서버를 실행함 : "+ app.get('port'));
});
