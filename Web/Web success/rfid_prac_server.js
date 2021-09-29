// 라즈베리파이와 연결용 서버 완성

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var db =require('./lib/db');


// ----------------- 라즈베리파이와 웹 통신 ------------------
var app = http.createServer(function (req, res) {
  var _url = req.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if(pathname==='/insert'){
  // cmd: addproduct일 때
  // 1. RFID 값을 받으면 product db에 상품 추가
  // -> process/update_process에서 display sNum, wNum 개수 하나씩늘리기
  var jsonData = "";
  req.on('data', function (chunk) {
    jsonData += chunk;
  });

  req.on('end', function () {
    var reqObj = JSON.parse(jsonData);
    var paramCmd = reqObj.cmd;
    var paramRfid = reqObj.rfid;
    console.log(paramCmd);
    var result ={'resultCode':'FAIL'};
    if(paramCmd == "insertRFID"){
    db.query('INSERT into product (name, price, rfid,sDisplay,wDisplay) VALUES(?,?,?,?,?)',['',0,paramRfid,'',''],function(error, addproduct){
      if(error){
        throw error;
      }
        console.log(addproduct);
        result.resultCode='OK';
        res.writeHead(200);
        res.end(JSON.stringify(result));
    });
    }else{
      next();
    }
  });
}else if(pathname==='/delete'){
  // cmd: buyproduct일 때
  // 2. RFID 값을 받으면 product db에서 상품 삭제, display sNum 개수 하나 줄이기
  //  -> 재고 비교, sDisplay < 3 이면 display의 sState를 caused로 update
  var jsonData = "";
  var result = {'buyFunction':'FAIL'};
  req.on('data', function (d) {
    jsonData += d;
  });
  req.on('end', function () {
      var reqObj = JSON.parse(jsonData);
      var paramCmd = reqObj.cmd;
      var paramRfid = reqObj.rfid;
      console.log(paramCmd);
      console.log(paramRfid);
      if(paramCmd == "deleteRFID"){
      db.query('UPDATE product LEFT JOIN display ON product.sDisplay=display.Dalpha SET display.sNum=display.sNum-1 WHERE product.rfid=?',[paramRfid],function(error,result){
        if(error){
          throw error;
        }
        db.query('DELETE FROM product WHERE rfid=?',[paramRfid],function(error2, buyproduct){
          if(error2){
            throw error2;
          }
          db.query('SELECT COUNT(*) as cnt FROM display WHERE sNum < 3',function(error3,Row){
            if(error3){
              throw error3;
            }
            // if(Row[0].cnt >0){
            // db.query('SELECT Dalpha as CausedAlpha FROM display WHERE sNum < 3',function(error4, Caused){
            //   if(error4){
            //     throw error4;
            //   }
              // for(var i=0;i<Casued.length;i++){
              //   db.query('UPDATE display SET sState=? on Dalpha=?'['caused',Caused[i].CausedAlpha],function(error5,result4){
              //     if(error5){
              //       throw error5;
              //     }
              //   });
              //   }
              // });
              // result.buyFunction='OK';
              // res.writeHead(200);
              // res.end(JSON.stringify(result));
              // }else{
              //   result.buyFunction='OK';
              //   res.writeHead(200);
              //   res.end(JSON.stringify(result));
              // }
            });
          });
        });
      }else{
        next();
      }
    });
}else {
        res.writeHead(404);
        res.end('Not found');
    }

});

app.listen(8080);
