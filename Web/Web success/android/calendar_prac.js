var express = require('express');
var http = require('http');
var bodyParser= require('body-parser');
var app = express();
var db =require('../lib/db');

app.set('port',process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//요청 (cmd:searchCheckTime, id, date), 응답 (inTime, outTime)
app.use(function(request, response,next){
  console.log('출,퇴근 조회 테스트');
  var result ={'inTime':'','outTime':''};
  console.log("1. result inTime: " + result.inTime + "result outTime : "+ result.outTime);
  var paramCmd = request.body.cmd;
  //var paramId = request.body.id;
  var paramName = request.body.name;
  var paramDate = request.body.date;

  console.log('name: '+paramName);
  console.log('date: '+ paramDate);
 // select * from checkin where date LIKE '2020-09-12%'; 이용하기
  var selectCnt = 'SELECT COUNT(*) as cnt FROM employee LEFT JOIN checkin ON employee.name=checkin.Iname LEFT JOIN checkout ON employee.name=checkout.Oname WHERE employee.name=? and checkin.Idate LIKE ? and checkout.Odate LIKE ?';
  var select = 'SELECT * FROM employee LEFT JOIN checkin ON employee.name=checkin.Iname LEFT JOIN checkout ON employee.name=checkout.Oname WHERE employee.name=? and checkin.Idate LIKE ? and checkout.Odate LIKE ?';

  console.log(paramCmd);
  if(paramCmd == 'searchCheckTime'){
  db.query(selectCnt,[paramName,paramDate+"%",paramDate+"%"],function(error,Row){
    console.log(Row[0].cnt);
    if(Row[0].cnt > 0){
      db.query(select,[paramName,paramDate+"%",paramDate+"%"],function(error1,employees){
        console.log(employees);
        var Ihour = employees[0].Idate.getHours();
        var Iminute = employees[0].Idate.getMinutes();
        var Isecond = employees[0].Idate.getSeconds();
        Iminute = Iminute < 10 ? '0'+ Iminute : Iminute;
        Isecond = Isecond < 10 ? '0'+ Isecond : Isecond;

        var Ohour = employees[0].Odate.getHours();
        var Ominute = employees[0].Odate.getMinutes();
        var Osecond = employees[0].Odate.getSeconds();
        Ominute = Ominute < 10 ? '0'+ Ominute : Ominute;
        Osecond = Osecond < 10 ? '0'+ Osecond : Osecond;

        console.log(Ihour+':'+Iminute+':'+Isecond);
        console.log(Ohour+':'+Ominute+':'+Osecond);

        result.inTime = Ihour+':'+Iminute+':'+Isecond;
        result.outTime = Ohour+':'+Ominute+':'+Osecond;
        console.log("2. result inTime: " + result.inTime + "result outTime : "+ result.outTime);
        response.send(result);
        });
    }else{
      console.log("3. result inTime: " + result.inTime + "result outTime : "+ result.outTime);
      response.send(result);
    }
  });
  }else{
    next();
  }
});

// 요청 (cmd:updateInTime, id, name, date+time), 응답 (cmpTime);
app.use(function(request, response,next){
  console.log('출근시간 입력 테스트');
  var result ={'cmpTime':'LATE'};
  var paramCmd = request.body.cmd;
  var paramName = request.body.name;
  var paramDate = request.body.date;

  console.log('name: '+paramName);
  console.log('date: '+ paramDate);

  var insert = 'INSERT INTO checkin (Idate, Iname) VALUES (?,?)'; //
  var select = 'SELECT checkin FROM commute WHERE name = ?'
  console.log(paramCmd);
  if(paramCmd == 'updateInTime'){
  db.query(insert,[paramDate,paramName],function(error,InTimeAdd){
      db.query(select,[paramName],function(error1,CheckIn){
        console.log(CheckIn);

        // 정해진 출근시간
        var Ihour = CheckIn[0].checkin.getHours();
        var Iminute = CheckIn[0].checkin.getMinutes();
        var Isecond = CheckIn[0].checkin.getSeconds();
        Iminute = Iminute < 10 ? '0'+ Iminute : Iminute;
        Isecond = Isecond < 10 ? '0'+ Isecond : Isecond;

        // 실제 출근한 시간
        var Phour = paramDate.getHours();
        var Pminute = paramDate.getMinutes();
        var Psecond = ParamDate.getSeconds();
        Pminute = Pminute < 10 ? '0'+ Pminute : Pminute;
        Psecond = Psecond < 10 ? '0'+ Psecond : Psecond;

        // 마트가 오전 10시부터 오후 10시까지 하는 마트라고 생각함...(새벽에 일하는 사람 없음...ㅎㅎ)
        if(Phour-Ihour > 0){
          response.send(result);
        }else if(Pminute-Iminute > 0){
          response.send(result);
        }else{
            result.cmpTime='OK';
            response.send(result);
        }
      });
  });
  }else{
    next();
  }
});

// 요청 (cmd:updateOutTime, id, date+time), 응답 (cmpTime);
app.use(function(request, response,next){
  console.log('퇴근시간 입력 테스트');
  var result ={'cmpTime':'EARLY'};
  var paramCmd = request.body.cmd;
  var paramName = request.body.name;
  var paramDate = request.body.date;

  console.log('name: '+paramName);
  console.log('date: '+ paramDate);

  var insert = 'INSERT INTO checkout (Odate, Oname) VALUES (?,?)'; //
  var select = 'SELECT checkout FROM commute WHERE name = ?'
  console.log(paramCmd);
  if(paramCmd == 'updateOutTime'){
  db.query(insert,[paramDate,paramName],function(error,InTimeAdd){
      db.query(select,[paramName],function(error1,CheckOut){
        console.log(CheckOut);

        // 정해진 출근시간
        var Ihour = CheckOut[0].checkin.getHours();
        var Iminute = CheckOut[0].checkin.getMinutes();
        var Isecond = CheckOut[0].checkin.getSeconds();
        Iminute = Iminute < 10 ? '0'+ Iminute : Iminute;
        Isecond = Isecond < 10 ? '0'+ Isecond : Isecond;

        // 실제 출근한 시간
        var Phour = paramDate.getHours();
        var Pminute = paramDate.getMinutes();
        var Psecond = ParamDate.getSeconds();
        Pminute = Pminute < 10 ? '0'+ Pminute : Pminute;
        Psecond = Psecond < 10 ? '0'+ Psecond : Psecond;

        // 마트가 오전 10시부터 오후 10시까지 하는 마트라고 생각함...(새벽에 일하는 사람 없음...ㅎㅎ)
        if(Phour-Ihour<0){
          response.send(result);
        }else if(Pminute-Iminute < 0){
          response.send(result);
        }else{
            result.cmpTime='OK';
            response.send(result);
        }
      });
  });
  }else{
    next();
  }
});


var server = http.createServer(app).listen(app.get('port'),function(){
   console.log("익스프레스로 웹 서버를 실행함 : "+ app.get('port'));
});
