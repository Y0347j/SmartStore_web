var express = require('express')
var app = express()
var path = require('path');
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var db =require('./lib/db');
var bodyParaser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParaser.urlencoded({extended: true}));

app.use(function(error, result){
  db.query('SELECT COUNT(*) as cnt FROM display WHERE sNum < 3',function(error3,Row){
    if(error3){
      throw error3;
    }
    if(Row[0].cnt >0){
    db.query('SELECT Dalpha as CausedAlpha FROM display WHERE sNum < 3',function(error4, Caused){
      if(error4){
        throw error4;
      }
      for(var i=0;i<Casued.length;i++){
        db.query('UPDATE display SET sState=? on Dalpha=?'['caused',Caused[i].CausedAlpha],function(error5,result4){
          if(error5){
            throw error5;
          }
        });
        }
      });
      result.buyFunction='OK';
      res.writeHead(200);
      res.end(JSON.stringify(result));
      }else{
        result.buyFunction='OK';
        res.writeHead(200);
        res.end(JSON.stringify(result));
      }
    });
});

app.get('/insert',function (req,res){
  var jsonData = "";
  req.on('data', function (chunk) {
    jsonData += chunk;
  });
  req.on('end', function () {
    var paramCmd = req.param('cmd');
    var paramRfid = req.param('rfid');
    console.log(paramCmd);
    if(paramCmd == "insertRFID"){
    db.query('INSERT into product (name, price, rfid,sDisplay,wDisplay) VALUES(?,?,?,?,?)',['',0,paramRfid,'',''],function(error, addproduct){
      if(error){
        throw error;
      }
        res.write();
        res.end();
    });
    }else{
      next();
    }
});

app.get('/delete',function(req,res){
  var jsonData = "";
  req.on('data', function (d) {
    jsonData += d;
  });
  req.on('end', function () {
     var paramCmd = req.param('cmd');
     var paramRfid = req.param('rfid');
      if(paramCmd == "deleteRFID"){
      db.query('UPDATE product LEFT JOIN display ON product.sDisplay=display.Dalpha SET display.sNum=display.sNum-1 WHERE product.rfid=?',[paramRfid],function(error,result){
        if(error){
          throw error;
        }
        db.query('DELETE FROM product WHERE rfid=?',[paramRfid],function(error2, buyproduct){
          if(error2){
            throw error2;
          }
          });
          res.write();
          res.end();
        });
    }else{
        next();
    }
});

// 1. 예외 처리
app.use(function(req, res,next){
  res.status(404).send("Sorry can't find that!!");
});

// 2. 예외 처리
app.use(function(err, req, res,next){
    console.error(err.stack)
    res.status(500).send('Something broke!')
 });

app.listen(23);
