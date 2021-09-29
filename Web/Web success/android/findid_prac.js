var express = require('express');
var http = require('http');
var bodyParser= require('body-parser');
var app = express();
var db =require('../lib/db');

app.set('port',process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(function(request, response,next){
  console.log('아이디 찾기 테스트');
  var result ={'resultId':''};

  var paramCmd = request.body.cmd;
  var paramName = request.body.name;
  var paramPhone = request.body.phone;

  var selectCnt = 'SELECT COUNT(*) as cnt FROM employee WHERE name=? and phoneNumber=?';
  var select = 'SELECT * FROM employee WHERE name=? and phoneNumber=?';
  console.log('  name : '+paramName+'  phone : '+paramPhone);
  if(paramCmd == 'searchEmpId'){
  db.query(selectCnt,[paramName,paramPhone],function(error,Row){
    console.log(Row[0].cnt)
    if(Row[0].cnt > 0){
      db.query(select,[paramName,paramPhone],function(error1,employees){
        if(error1){
          throw errorl;
        }
        console.log(employees);
        result.resultId = employees[0].login_id;
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
