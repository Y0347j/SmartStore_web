
var express = require('express')
var app = express()
var path = require('path');
var db =require('./lib/db');

// ----------------- ASTAR 경로 탐색 ------------------
const MAX = 8;
const DONTMOVE = -1;
const WALL = -2;
const CLOSED =-3;
const UNDEF = -1;
const INF = 0;

class deque {
  constructor() {
    this.data = [];
    this.rear = 0;
  }

  push_front(element) {
    this.data.unshift(element);
    this.rear = this.rear + 1;
  }

  push_back(element) {
    this.data[this.rear] = element;
    this.rear = this.rear + 1;
  }

  pop_front() {
    if (this.isEmptydeque() === false) {
      this.rear = this.rear - 1;
      return this.data.shift();
    }

    return false;
  }

  pop_back() {
    if (this.isEmptydeque() === false) {
      this.rear = this.rear - 1;
      return this.data.pop();
    }

    return false;
  }

  length() {
    return this.rear;
  }

  isEmptydeque() {
    return this.rear === 0;
  }

  getFront() {
    if (this.isEmptydeque() === false) {
      return this.data[0];
    }

    return false;
  }

  getLast() {
    if (this.isEmptydeque() === false) {
      return this.data[this.rear - 1];
    }

    return false;
  }

  print() {
    for (let i = 0; i < this.rear; i++) {
      console.log(this.data[i]);
    }
  }
}

function queue (r, c, g, next){
  this.r = r;
  this.c = c;
  this.g = g;
  this.next = next;
}

function create2DArray(rows, columns) {
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array(columns);
        for(var j=0;j<columns;j++){
          arr[i][j]=INF;
        }
    }
    return arr;
}

function empty_queue(){
//  console.log("empty_queue");
  //if(q == undefined) q = new queue();
  return (Q.r == null || Q.c == null);
}

function dequeue(){
//  console.log("dequeue");
  var f = new queue(null,null,null,null);
  f = Q;
  var v = new queue(null,null,null,null);
  v.r=0; v.c=0; v.g=0;
  if(f.r != null && f.c != null){
    Q = f.next;
    v.r = f.r;
    v.c = f.c;
    v.g = f.g;
    delete f;
    return v;
  }
  return v;
}

function enqueue(v){
console.log("enqueue");
  var f = new queue(null,null,null,null);
  f=Q;
  console.log(f);
  var newq = new queue(null,null,null,null);
  var temp = new queue(null,null,null,null);
  var key;

  newq.next = null;
  newq.r = v.r;
  newq.c = v.c;
  newq.g = v.g;

  if(f.r == null && f.c == null){
    Q = newq;
    console.log(Q);
    return;
  }

  while(f.next != null){
    key = g[v.r][v.c];
    if(key < g[f.r][f.c]){
      tempR =f.r;
      tempC = f.c;
      tempG = f.g;
      f.r = v.r;
      f.c = v.c;
      f.g = v.g;
      v.r = tempR;
      v.c = tempC;
      v.g = tempG;
    }
    f = f.next;
  }
  newq.r = v.r;
  newq.c = v.c;
  newq.g = v.g;
  f.next = newq;
}

function calc_heuristic(v,r,c){
  console.log("calc_heuristic");
  var result = ((Math.abs(E.c-c)+Math.abs(E.r-r))*2);
  var  gx = v.g;

  if(Math.abs(v.c-c) == Math.abs(v.r - r)){
    gx = gx +14;
  }else{
    gx = gx +10;
  }
  console.log("gx: "+gx);
  return [result + gx, gx];
}

function add_openlist(v){
  console.log("add_openlist");
  var temp = new queue(null,null,null,null);
  var i,j,w;
  for(var k =0; k< 4;k++){
    i = parseInt(v.r) + parseInt(loc[k][0]);
    j = parseInt(v.c) + parseInt(loc[k][1]);
    if (i < 0 || i >= MAX || j < 0 || j >= MAX || (i == v.r && j == v.c) ||visit[i][j] <= DONTMOVE) continue;

    w = calc_heuristic(v, i, j);
    console.log("after calc");
    if( w < g[i][j] || g[i][j] == INF){
      g[i][j]  = w[0]; console.log(g[i][j] + " " +w[0]);
      pre[i][j] = (v.r * MAX) + v.c;
      //console.log("pre: " + pre[i][j]);
      if( E.r == i && E.c == j){
        Q.r = null; Q.c = null; return;
      }
    }
    console.log("W[0]: "+w[0] +" W[1]: "+w[1]);
    temp.r = i; temp.c = j; temp.g = w[1]; console.log(temp.r +" "+ temp.c +" " +temp.g);
    enqueue(temp);
  }
}

function astar(){
  console.log("astar");
  var v = new queue(null,null,null,null);
  g[S.r][S.c] =0;
  pre[S.r][S.c] = UNDEF;
  S.g = 0;
  v = S;
  add_openlist(v);
  while(!empty_queue()){
    visit[v.r][v.c] = CLOSED;
    v = dequeue();
    add_openlist(v);
  }
}

function print_weights(){
  var i, j;
  console.log("pre: ");
  for( i = 0 ; i < MAX ; i ++)
  {
    for( j = 0 ; j < MAX ; j ++)
    {
      console.log(pre[i][j]);
    }
  }

  console.log("g: ");
  for( i = 0 ; i < MAX ; i ++)
  {
    for( j = 0 ; j < MAX ; j ++)
    {
      console.log(g[i][j]);
    }
  }
}

function get_path(){
  //console.log("get_path");
  var i,j,backtrack;
  resultpath.push_front(E.r*MAX+E.c);
  resultpath.push_front(pre[E.r][E.c]);
  i = parseInt(pre[E.r][E.c] / MAX);
  j = pre[E.r][E.c] % MAX;

  while( pre[i][j] != UNDEF){
    resultpath.push_front(pre[i][j]);
    backtrack = pre[i][j];

    g[i][j] = 7;
    i = parseInt(backtrack / MAX);
    j = backtrack % MAX;
  }
}

var resultpath = new deque();
var Q = new queue(null,null,null,null);

var g = create2DArray(MAX,MAX);
var visit = create2DArray(MAX,MAX);
var pre = create2DArray(MAX,MAX);

var loc = [[0,1],[0,-1],[1,0],[-1,0]];
var S, E;

// 각 진열대에 로봇이 도착하는 위치
var dest = {'A': 41, 'B':43 ,'C':44, 'D':46, 'E':17,'F':19,'G':20, 'H':22};

function direction(sr,sc,er,ec){
  S = new queue(sr,sc,null,null);
  E = new queue(er,ec,null,null);

  // 상점 진열대 위치
  visit[2][2]=WALL;
  visit[2][5]=WALL;
  visit[4][2]=WALL;
  visit[4][5]=WALL;

  astar();
  print_weights();
  get_path();
  var d = resultpath.data[1] - resultpath.data[0];
  return d;
}
}

// * 웹에서 displayDB의 sState가 caused / accept가 되면 아두이노로 'W'를 보냄
// * 웹에서 displayDB의 sState가 done이 되면 아두이노로 이동을 요청함
// 3. 아두이노에서 qr정보를 받으면, 경로탐색 알고리즘으로 찾은 경로를 아두이노로 보내줌(현재 위치의 방형을 보내줌)
//  -> 웹에서는 robot의 rPos, rStatew정보를 update
app.get('/',function(request, response,next){
    console.log("direction");

    var paramCmd = req.param('cmd');
    var paramQR = req.param('qr');
    var i= paramQR.substring(2,3);
    var j= paramQR.substring(4,5);

    var selectCnt ='SELECT COUNT(*) as cnt from display WHERE sState=?';
    var select = 'SELECT * from display WHERE sState=?';

    console.log(paramCmd);
    if(paramCmd == 'robotPath'){
    db.query(selectCnt,['accept'],function(error, Row){
      console.log(Row[0].cnt);
      if(Row[0].cnt > 0){
      db.query(select,['accept'],function(error, display){
        console.log(display[0].Dalpha);
        if(display[0].Dalpha == 'A'){
             if( i == parseInt(dest.A / MAX) && j == parseInt(dest.A % MAX)){
               var robotPos ='I';
               response.send(robotPos);
             }else{
             db.query('update robot set rPos=?, rState=? WHERE id=1',[paramData,'store'],function(error,result){
               if(error){
                 throw error;
               }
               var robotPos = direction(i,j,5,1);
               response.send(robotPos);
             });
           }
         }else if(display[0].Dalpha == 'B'){
           if( i == parseInt(dest.B / MAX) && j == parseInt(dest.B % MAX)){
             var robotPos ='I';
             response.send(robotPos);
           }else{
           db.query('update robot set rPos=?, rState=? WHERE id=1',[paramData,'store'],function(error,result){
             if(error){
               throw error;
             }
             var robotPos = direction(i,j,5,3);
             response.send(robotPos);
           });
         }
         }else if(display[0].Dalpha == 'C'){
            if( i == parseInt(dest.C / MAX) && j == parseInt(dest.C % MAX)){
              var robotPos ='I';
              response.send(robotPos);
            }else{
            db.query('update robot set rPos=?, rState=? WHERE id=1',[paramData,'store'],function(error,result){
              if(error){
                throw error;
              }
              var robotPos = direction(i,j,5,4);
              response.send(robotPos);
            });
          }
        }else if(display[0].Dalpha=='D'){
            if( i == parseInt(dest.D / MAX) && j == parseInt(dest.D % MAX)){
              var robotPos ='I';
              response.send(robotPos);
            }else{
            db.query('update robot set rPos=?, rState=? WHERE id=1',[paramData,'store'],function(error,result){
              if(error){
                throw error;
              }
              var robotPos = direction(i,j,5,6);
              response.send(robotPos);
            });
          }
        } else if(display[0].Dalpha == 'E'){
          if( i == parseInt(dest.E / MAX) && j == parseInt(dest.E % MAX)){
            var robotPos ='I';
            response.send(robotPos);
          }else{
          db.query('update robot set rPos=?, rState=? WHERE id=1',[paramData,'store'],function(error,result){
            if(error){
              throw error;
            }
            var robotPos = direction(i,j,2,1);
            response.send(robotPos);
          });
        }
        }else if(display[0].Dalpha == 'F'){
          if( i == parseInt(dest.F / MAX) && j == parseInt(dest.F % MAX)){
            var robotPos ='I';
            response.send(robotPos);
          }else{
          db.query('update robot set rPos=?, rState=? WHERE id=1',[paramData,'store'],function(error,result){
            if(error){
              throw error;
            }
            var robotPos = direction(i,j,2,3);
            response.send(robotPos);
          });
        }

        }else if(display[0].Dalpha == 'G'){
          if( i == parseInt(dest.G / MAX) && j == parseInt(dest.G % MAX)){
            var robotPos ='I';
            response.send(robotPos);
          }else{
          db.query('update robot set rPos=?, rState=? WHERE id=1',[paramData,'store'],function(error,result){
            if(error){
              throw error;
            }
            var robotPos = direction(i,j,2,4);
            response.send(robotPos);
          });
        }

        }else if(display[0].Dalpha == 'H'){
          if( i == parseInt(dest.H / MAX) && j == parseInt(dest.H % MAX)){
            var robotPos ='I';
            response.send(robotPos);
           } else{
          db.query('update robot set rPos=?, rState=? WHERE id=1',[paramData,'store'],function(error,result){
            if(error){
              throw error;
            }
            var robotPos = direction(i,j,2,6);
            response.send(robotPos);
          });
          }
        }
      });
     }
    });
   }
});

app.listen(24);var express = require('express')
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
