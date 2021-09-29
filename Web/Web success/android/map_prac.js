var express = require('express');
var http = require('http');
var bodyParser= require('body-parser');
var app = express();
var db =require('../lib/db');

app.set('port',process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(function(request, response,next){
  console.log('맵 테스트');
  var result ={'robotState':'idle','robotPos':''};

  var paramCmd = request.body.cmd;

  var select = 'select * from robot';
  console.log(paramCmd);
  if(paramCmd == 'robotPos'){
    db.query(select,function(error,robot){
      result.robotState=robot[0].rState;
      result.robotPos=robot[0].rPos;
      response.send(result);
   });
  }else{
    next();
  }
});


var server = http.createServer(app).listen(app.get('port'),function(){
   console.log("익스프레스로 웹 서버를 실행함 : "+ app.get('port'));
});
