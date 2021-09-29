var express = require('express');
var http = require('http');
var bodyParser= require('body-parser');
var app = express();
var db =require('../lib/db');

app.set('port',process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(function(request, response,next){
  console.log('로그인 테스트');
  var result ={'resultId':'FAIL','resultPw':'FAIL','name':'','gender':'', 'join':'','phone':'','email':'','address':'','bank':'','account':''};
  var paramCmd = request.body.cmd;
  var paramId = request.body.id;
  var paramPassword = request.body.pw;

  var selectCnt = 'SELECT COUNT(*) as cnt FROM employee WHERE login_id=?';
  var select = 'SELECT * FROM employee WHERE login_id=?';
  console.log('id : '+paramId+'  pw : '+paramPassword);
  if(paramCmd == 'login'){
    db.query(selectCnt,[paramId],function(error,Row){
      console.log(Row[0].cnt)
      if(Row[0].cnt > 0){
         db.query(select,[paramId],function(error,employees){
          if(paramId == employees[0].login_id ) result.resultId ='OK';
          console.log(result.resultId);
          if (paramPassword == employees[0].password )
             result.resultPw = 'OK';
          if(result.resultId == 'OK' && result.resultPw=='OK'){
          result.name = employees[0].name;
          result.gender = employees[0].gender;
          result.grade = employees[0].position;
          result.join = employees[0].date;
          result.phone = employees[0].phoneNumber;
          result.email = employees[0].email;
          result.address = employees[0].address;
          result.bank = employees[0].bank;
          result.account = employees[0].accountNumber;
          }
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
