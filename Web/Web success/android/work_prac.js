var express = require('express');
var http = require('http');
var bodyParser= require('body-parser');
var app = express();
var db =require('../lib/db');

app.set('port',process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(function(request, response,next){
  console.log('로봇 이동 관련 통신 테스트');
  var result ={'stateA':'','nameA':'','stateB':'','nameB':'','stateC':'','nameC':'','stateD':'','nameD':'','stateE':'','nameE':'','stateF':'','nameF':'','stateG':''
  ,'nameG':'','stateH':'','nameH':''};

  var paramCmd = request.body.cmd;

  var select = 'SELECT * FROM display LEFT JOIN work ON display.Dalpha=work.Walpha';
  console.log(paramCmd);
  if(paramCmd == 'workState'){
    db.query(select,function(error1,workstate){
      result.stateA = workstate[0].sState;
      result.nameA = workstate[0].name;
      result.stateB = workstate[1].sState;
      result.nameB = workstate[1].name;
      result.stateC = workstate[2].sState;
      result.nameC = workstate[2].name;
      result.stateD = workstate[3].sState;
      result.nameD = workstate[3].name;
      result.stateE = workstate[4].sState;
      result.nameE = workstate[4].name;
      result.stateF = workstate[5].sState;
      result.nameF = workstate[5].name;
      result.stateG = workstate[6].sState;
      result.nameG = workstate[6].name;
      result.stateH = workstate[7].sState;
      result.nameH = workstate[7].name;
      response.send(result);
   });
  }else{
    next();
  }
});

app.use(function(request, response,next){
  console.log('로봇 수락 테스트');
  var result ={'resultCode':'FAIL'};

  var paramCmd = request.body.cmd;
  var paramAlpha = request.body.alpha;
  var paramId = request.body.id;
  var paramName = request.body.name;

  var updateD = 'UPDATE display SET sState=? WHERE Dalpha=?';
  var updateW = 'UPDATE work SET login_id=?, name=? WHERE Walpha=?';
  console.log(paramCmd);
  if(paramCmd == 'workAccept'){
    db.query(updateD,['accepted',paramAlpha],function(error,displayUp){
      db.query(updateW,[paramId,paramName,paramAlpha],function(error1,workUp){
      result.resultCode='OK';
      response.send(result);
   });
  });
  }else{
    next();
  }
});

app.use(function(request, response,next){
  console.log('로봇 완료 테스트');
  var result ={'resultCode':'FAIL'};

  var paramCmd = request.body.cmd;
  var paramAlpha = request.body.alpha;

  var updateD = 'UPDATE display SET sState=? WHERE Dalpha=?';
  var updateW = 'UPDATE work SET login_id=?, name=? WHERE Walpha=?';
  console.log(paramCmd);
  if(paramCmd == 'workAccept'){
    db.query(updateD,['done',paramAlpha],function(error,displayUp){
      db.query(updateW,['','',paramAlpha],function(error1,workUp){
      result.resultCode='OK';
      response.send(result);
   });
  });
  }else{
    next();
  }
});

var server = http.createServer(app).listen(app.get('port'),function(){
   console.log("익스프레스로 웹 서버를 실행함 : "+ app.get('port'));
});
