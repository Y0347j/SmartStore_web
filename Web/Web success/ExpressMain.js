var express = require('express')
var app = express()
var fs = require('fs');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');

var db =require('./lib/db');

var bodyParser = require('body-parser');
var compression = require('compression');

const port = 3000

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(compression());

app.use(bodyParser.json());

// topic list 조회
app.use(function(request, response, next){
  db.query('SELECT * FROM topic',function(error,topics){
    if(error){
      throw error;
    }
    request.topics = topics;
    next();
  });
});

// employee commute join 결과 조회
app.use(function(request, response, next){
  db.query('SELECT * FROM employee LEFT JOIN commute ON employee.name = commute.name',function(error,employees){
    if(error){
      throw error;
    }
    request.employees = employees;
    next();
  });
});

// product list 조회
app.use(function(request, response, next){
  db.query('SELECT * FROM product',function(error, products){
    if(error){
      throw error;
    }
    request.products = products;
    next();
  });
});

// ---------------- 안드로이드와 웹 통신 -----------------

//로그인 미들웨어
app.use(function(request, response,next){
  var result ={'resultId':'FAIL','resultPw':'FAIL','name':'','gender':'', 'join':'','phone':'','email':'','address':'','bank':'','account':''};

  var paramCmd = request.body.cmd;
  var paramId = request.body.id;
  var paramPassword = request.body.pw;

  var selectCnt1 = 'SELECT COUNT(*) as cnt FROM employee WHERE login_id=?';
  var selectCnt2 = 'SELECT COUNT(*) as cnt FROM employee WHERE password=?';
  var select = 'SELECT * FROM employee WHERE login_id=?';

  console.log(paramCmd);
  if(paramCmd == 'login'){
    db.query(selectCnt1,[paramId],function(error,RowI){
      db.query(selectCnt2,[paramPassword],function(error1,RowP){
        if(RowI[0].cnt > 0 && RowP[0].cnt > 0){
           db.query(select,[paramId],function(error2,employees){
             if(paramId == employees[0].login_id ){
               result.resultId ='OK';
             }
             if (paramPassword == employees[0].password ){
                result.resultPw = 'OK';
             }
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
         }else if(RowI[0].cnt > 0 && RowP[0].cnt <= 0){
           result.resultId='OK';
           response.send(result);
         }else if(RowI[0].cnt <= 0 && RowP[0].cnt > 0){
           result.resultPw='OK';
           response.send(result);
         }else{
           response.send(result);
         }
      });
    });
    }else{
      next();
   }
 });

// 비밀번호 탐색 미들웨어
app.use(function(request, response,next){
  var result ={'resultPw':''};

  var paramCmd = request.body.cmd;
  var paramId = request.body.id;
  var paramName = request.body.name;
  var paramPhone = request.body.phone;

  var selectCnt = 'SELECT COUNT(*) as cnt FROM employee WHERE login_id=? and name=? and phoneNumber=?';
  var select = 'SELECT * FROM employee WHERE login_id=? and name=? and phoneNumber=?';

  console.log(paramCmd);
  if(paramCmd == 'searchEmpPw'){
  db.query(selectCnt,[paramId,paramName,paramPhone],function(error,Row){
    if(Row[0].cnt > 0){
      db.query(select,[paramId,paramName,paramPhone],function(error1,employees){
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

// 아이디 찾기 미들웨어
app.use(function(request, response,next){
  var result ={'resultId':''};

  var paramCmd = request.body.cmd;
  var paramName = request.body.name;
  var paramPhone = request.body.phone;

  var selectCnt = 'SELECT COUNT(*) as cnt FROM employee WHERE name=? and phoneNumber=?';
  var select = 'SELECT * FROM employee WHERE name=? and phoneNumber=?';

  console.log(paramCmd);
  if(paramCmd == 'searchEmpId'){
  db.query(selectCnt,[paramName,paramPhone],function(error,Row){
    if(Row[0].cnt > 0){
      db.query(select,[paramName,paramPhone],function(error1,employees){
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

// 비밀번호 인증 미들웨어
app.use(function(request, response,next){
  var result ={'resultCode':'FAIL'};

  var paramCmd = request.body.cmd;
  var paramId = request.body.id;
  var paramOPassword = request.body.pw;

  var selectCnt = 'SELECT COUNT(*) as cnt FROM employee WHERE login_id=?';
  var select = 'SELECT * FROM employee WHERE login_id=?';
  console.log(paramCmd);
  if(paramCmd == 'VerifyEmp'){
  db.query(selectCnt,[paramId],function(error,Row){
    if(Row[0].cnt > 0){
      db.query(select,[paramId],function(error1,employees){
        if(paramOPassword == employees[0].password) result.resultCode='OK';
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

// 비밀번호 수정 미들웨어
app.use(function(request, response,next){
  var result ={'resultCode':'FAIL'};

  var paramCmd = request.body.cmd;
  var paramId = request.body.id;
  var paramNPassword = request.body.pw;

  var selectCnt = 'SELECT COUNT(*) as cnt FROM employee WHERE login_id=?';
  var update = 'UPDATE employee SET password=? WHERE login_id=?';
  console.log(paramCmd);
  if(paramCmd == 'updateEmpPw'){
  db.query(selectCnt,[paramId],function(error,Row){
    if(Row[0].cnt > 0){
      db.query(update,[paramNPassword,paramId],function(error1,employees){
        result.resultCode='OK';
        response.send(result);
      });
    }
  });
  }else{
    next();
  }
});

// 개인 정보 수정 미들웨어
app.use(function(request, response,next){
  var result ={'resultCode':'FAIL'};

  var paramCmd = request.body.cmd;
  var paramId = request.body.id;
  var paramPhone = request.body.phone;
  var paramEmail = request.body.email;
  var paramAddress = request.body.address;
  var paramBank = request.body.bank;
  var paramAccount = request.body.account;

  var selectCnt = 'SELECT COUNT(*) as cnt FROM employee WHERE login_id=?';
  var update = 'UPDATE employee SET phoneNumber=?, email=?, accountNumber=?, bank=?, address=? WHERE login_id=?';

  console.log(paramCmd);
  if(paramCmd == 'updateEmpInfo'){
  db.query(selectCnt,[paramId],function(error,Row){
    if(Row[0].cnt > 0){
      db.query(update,[paramPhone,paramEmail,paramAccount,paramBank,paramAddress,paramId],function(error1,employees){
        result.resultCode='OK';
        response.send(result);
      });
    }
  });
  }else{
    next();
  }
});

// 달력 조회 미들웨어
app.use(function(request, response,next){
  var result ={'inTime':'','outTime':''};

  var paramCmd = request.body.cmd;
  //var paramId = request.body.id;
  var paramName = request.body.name;
  var paramDate = request.body.date;

 // select * from checkin where date LIKE '2020-09-12%'; 이용하기
  var selectCnt = 'SELECT COUNT(*) as cnt FROM employee LEFT JOIN checkin ON employee.name=checkin.Iname LEFT JOIN checkout ON employee.name=checkout.Oname WHERE employee.name=? and checkin.Idate LIKE ? and checkout.Odate LIKE ?';
  var select = 'SELECT * FROM employee LEFT JOIN checkin ON employee.name=checkin.Iname LEFT JOIN checkout ON employee.name=checkout.Oname WHERE employee.name=? and checkin.Idate LIKE ? and checkout.Odate LIKE ?';

  console.log(paramCmd);
  if(paramCmd == 'searchCheckTime'){
  db.query(selectCnt,[paramName,paramDate+"%",paramDate+"%"],function(error,Row){
    if(Row[0].cnt > 0){
      db.query(select,[paramName,paramDate+"%",paramDate+"%"],function(error1,employees){
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

        result.inTime = Ihour+':'+Iminute+':'+Isecond;
        result.outTime = Ohour+':'+Ominute+':'+Osecond;
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

// 출근 시간 입력 미들웨어
app.use(function(request, response,next){
  var result ={'cmpTime':'LATE'};
  var paramCmd = request.body.cmd;
  var paramName = request.body.name;
  var paramDate = request.body.date;

  var insert = 'INSERT INTO checkin (Idate, Iname) VALUES (?,?)'; //
  var select = 'SELECT checkin FROM commute WHERE name = ?'
  console.log(paramCmd);
  if(paramCmd == 'updateInTime'){
  db.query(insert,[paramDate,paramName],function(error,InTimeAdd){
      db.query(select,[paramName],function(error1,CheckIn){

        // 정해진 출근시간
        var Ihour = CheckIn[0].checkin.substring(0,2);
        var Iminute = CheckIn[0].checkin.substring(3,5);
        var Isecond = CheckIn[0].checkin.substring(6);

        // 실제 출근한 시간
        var Phour = paramDate.substring(11,13);
        var Pminute = paramDate.substring(14,16);
        var Psecond = paramDate.substring(17);

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

// 퇴근 시간 입력 미들웨어
app.use(function(request, response,next){
  var result ={'cmpTime':'EARLY'};
  var paramCmd = request.body.cmd;
  var paramName = request.body.name;
  var paramDate = request.body.date;

  var insert = 'INSERT INTO checkout (Odate, Oname) VALUES (?,?)'; //
  var select = 'SELECT checkout FROM commute WHERE name = ?'
  console.log(paramCmd);
  if(paramCmd == 'updateOutTime'){
  db.query(insert,[paramDate,paramName],function(error,InTimeAdd){
      db.query(select,[paramName],function(error1,CheckOut){

        // 정해진 퇴근시간
        var Ihour = CheckOut[0].checkout.substring(0,2);
        var Iminute = CheckOut[0].checkout.substring(3,5);
        var Isecond = CheckOut[0].checkout.substring(6);

        // 실제 퇴근한 시간
        var Phour = paramDate.substring(11,13);
        var Pminute = paramDate.substring(14,16);
        var Psecond = paramDate.substring(17);

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

// 업무 상태 조회 미들웨어
app.use(function(request, response,next){
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

// 업무 수락 처리 미들웨어
app.use(function(request, response,next){
  var result ={'resultCode':'FAIL'};

  var paramCmd = request.body.cmd;
  var paramAlpha = request.body.alpha;
  var paramId = request.body.id;
  var paramName = request.body.name;

  var updateD = 'UPDATE display SET sState=? WHERE Dalpha=?';
  var updateW = 'UPDATE work SET login_id=?, name=? WHERE Walpha=?';
  console.log(paramCmd);
  if(paramCmd == 'workAccept'){
  db.query(updateD,['accept',paramAlpha],function(error1,displayUp){
    db.query(updateW,[paramId,paramName,paramAlpha],function(error,workUp){
      result.resultCode='OK';
      response.send(result);
   });
  });
  }else{
    next();
  }
});

// 업무 완료 처리 미들웨어
app.use(function(request, response,next){
  var result ={'resultCode':'FAIL'};

  var paramCmd = request.body.cmd;
  var paramAlpha = request.body.alpha;

  var updateD = 'UPDATE display SET sState=? WHERE Dalpha=?';
  var updateW = 'UPDATE work SET login_id=?, name=? WHERE Walpha=?';
  console.log(paramCmd);
  if(paramCmd == 'workDone'){
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

// 로봇 이동 확인 미들웨어
app.use(function(request, response,next){
  var result ={'robotState':'idle','robotPos':''};

  var paramCmd = request.body.cmd;
  //var selectDstate = 'select sState from display';
  var select = 'select * from robot';
  console.log(paramCmd);
  if(paramCmd == 'robotPos'){
    db.query(select,function(error,robot){
      console.log(robot);
      // result.robotState=robot[0].rState;
      // result.robotPos=robot[0].rPos;

      //result.robotState='idle';
      result.robotState='store';
      //result.robotPos='S0007';
       //result.robotPos='S0006';
      //result.robotPos='S0005';
       //result.robotPos='S0004';
      //result.robotPos='S0104';
       //result.robotPos='S0204';
      //result.robotPos='S0304';
       //result.robotPos='S0404';
      result.robotPos='S0504';

      response.send(result);
   });
  }else{
    next();
  }
});

// ---------------- 웹 데이터베이스 통신 -----------------
app.get('/',function(request, response){
  console.log("home page");
  var list = template.list(request.topics);
  var html = template.HTML(list,
      `<img class="map" src="/images/map.png">`
  );
  response.send(html);
});

// 직원 관리 페이지
app.get('/employee',function(request,response,next){
  console.log("employee page");
    var list = template.list(request.topics);
    var html = template.HTML(list,
      `
       <button class="relative" type="button" onclick="location.href='/employee/create' ">직원 추가</button><br>
        ${template.employeeTable(request.employees)}
        `
    );
    response.send(html);
});

app.get('/employee/create',function(request,response){
  console.log("employee create");
  var list = template.list(request.topics);
  var html = template.HTML(list,
    `
    <button class="relative" type="button" onclick="location.href='/employee/create' ">직원 추가</button><br>
      ${template.employeeTable(request.employees)}

      <form action="/employee/create_process" method="post" class="relative">
        <p> 이름:
          <input type="text" name="name" placeholder="name">
        </p>
        <p> 아이디:
          <input type="text" name="login_id" placeholder="아이디">
        </p>
        <p>
          비밀번호:
          <input type="password" name="password" placeholder="비밀번호">
        </p>
        <p>
          성별:
          <input type="text" name="gender" placeholder="남/여">
        </p>
        <p>
          전화번호:
          <input type="text" name="phoneNumber" placeholder="000000000">
        </p>
        <p>
          이메일:
          <input type="text" name="email" placeholder="이메일">
        </p>
        <p>
          주소:
          <input type="text" name="address" placeholder="주소">
        </p>
        <p>
          계좌번호:
          <input type="text" name="accountNumber" placeholder="0000000000000000">
        </p>
        <p>
          은행:
          <input type="text" name="bank" placeholder="은행">
        </p>
        <p>
          직급:
          <input type="text" name="position" placeholder="직급">
        </p>
        <p>
          입사일:
          <input type="date" name="date">
        </p>
        <p>
         출근시간:
         <input type="text" name="checkin" placeholder="00:00:00">
        </p>
        <p>
         퇴근시간:
         <input type="text" name="checkout" placeholder="00:00:00">
        </p>
        <p>
          <input type="submit" value="추가">
        </p>
      </form>
      `
  );
  response.send(html);
});

app.post('/employee/create_process',function(request,response){
  console.log("employee create process");
  var post = request.body;
  db.query(`INSERT INTO employee (name, login_id, password, gender, phoneNumber, email, accountNumber, bank,address, position, date) VALUES(?,?,?,?,?,?,?,?,?,?,?)`,[post.name,post.login_id,post.password, post.gender,post.phoneNumber, post.email, post.accountNumber,post.bank,post.address, post.position, post.date], function(error,result){
    if(error) {
      throw error;
    }
    db.query(`INSERT INTO commute (checkin, checkout, name) VALUES(?,?,?)`,[post.checkin, post.checkout,post.name],function(error1, result1){
    if(error1){
      throw error1;
    }
    db.query(`INSERT INTO checkin (Idate, Iname) VALUES(?,?)`,[post.date,post.name],function(error2,result2){
      if(error2){
        throw error2;
      }
      db.query(`INSERT INTO checkout (Odate, Oname) VALUES(?,?)`,[post.date,post.name],function(error3,result3){
        if(error3){
          throw error3;
        }
        response.writeHead(302, {Location: `/employee`});
        response.end();
        });
      });
    });
  });
});

app.get('/employee/update/:pageId',function(request,response){
  console.log("employee update");
  var filteredId = path.parse(request.params.pageId).base;
  db.query('SELECT * FROM employee LEFT JOIN commute ON employee.name = commute.name WHERE employee.name=?',[filteredId],function(error,employee){
    if(error){
      throw error;
    }
    var list = template.list(request.topics);
    var html = template.HTML(list,
        `
        <button class="relative" type="button" onclick="location.href='/employee/create' ">직원 추가</button>
        <button class="relative" type="button" onclick="location.href='/employee' ">개인정보 수정취소</button><br>
        ${template.employeeTable(request.employees)}

        <form action="/employee/update_process" method="post" class="relative">
          <p>
            <input type="hidden" name="id" value="${filteredId}">
          </p>
          <p>
            이름:
            <input type="text" name="name" value="${sanitizeHtml(employee[0].name)}" placeholder="name" readonly>
          </p>
          <p>
            아이디:
            <input type="text" name="login_id" value="${sanitizeHtml(employee[0].login_id)}" placeholder="아이디">
          </p>
          <p>
            비밀번호:
            <input type="text" name="password" value="${sanitizeHtml(employee[0].password)}" placeholder="비밀번호">
          </p>
          <p>
            성별:
            <input type="text" name="gender" value="${sanitizeHtml(employee[0].gender)}" placeholder="남/여">
          </p>
          <p>
            전화번호:
            <input type="text" name="phoneNumber" value="${sanitizeHtml(employee[0].phoneNumber)}" placeholder="전화번호">
          </p>
          <p>
            이메일:
            <input type="text" name="email" value="${sanitizeHtml(employee[0].email)}" placeholder="이메일">
          </p>
          <p>
            주소:
            <input type="text" name="address" value="${sanitizeHtml(employee[0].address)}" placeholder="주소">
          </p>
          <p>
            계좌번호:
            <input type="text" name="accountNumber" value="${sanitizeHtml(employee[0].accountNumber)}" placeholder="계좌번호">
          </p>
          <p>
            은행:
            <input type="text" name="bank" value="${sanitizeHtml(employee[0].bank)}" placeholder="은행">
          </p>
          <p>
            직급:
            <input type="text" name="position" value="${sanitizeHtml(employee[0].position)}" placeholder="직급">
          </p>
          <p>
           출근시간:
           <input type="text" name="checkin" value="${sanitizeHtml(employee[0].checkin)}"placeholder="00:00:00">
          </p>
          <p>
           퇴근시간:
           <input type="text" name="checkout" value="${sanitizeHtml(employee[0].checkout)}" placeholder="00:00:00">
          </p>
          <p>
            <input type="submit" value="수정">
          </p>
        </form>
        `
    );
    response.send(html);
  });
});

app.post('/employee/update_process',function(request, response){
  console.log("employee update process");
  var post = request.body;
  db.query(`UPDATE employee SET login_id=?, password=?,  gender=?, phoneNumber=?, email=?, accountNumber=?,bank=?, address=?, position=? WHERE name=?`,[post.login_id,post.password,post.gender,post.phoneNumber,post.email,post.accountNumber,post.bank,post.address,post.position,post.id],function(error,result){
    if(error) {
      throw error;
    }
    db.query(`UPDATE commute SET checkin=?, checkout=? WHERE name=?`,[post.checkin, post.checkout, post.id],function(error1,result1){
      if(error1) {
        throw error1;
      }
      response.redirect(`/employee`);
    });
  });
});

app.post('/employee/delete_process',function(request, response){
  console.log("employee delete process");
  var post = request.body;
  db.query(`DELETE FROM employee WHERE name=?`,[post.name],function(error1,result1){
    if(error1) {
      throw error1;
    }
    db.query(`DELETE FROM checkin WHERE Iname=?`,[post.name],function(error2,result2){
      if(error2) {
        throw error2;
      }
      db.query(`DELETE FROM checkout WHERE Oname=?`,[post.name],function(error3,result3){
        if(error3) {
          throw error3;
        }
        db.query(`DELETE FROM commute WHERE name=?`,[post.name],function(error4,result4){
          if(error4) {
            throw error4;
          }
            response.redirect(`/employee`);
        });
      });
    });
  });
});

app.get('/employee/checkin/:pageId',function(request, response){
  console.log("employee checkin");
  var filteredId = path.parse(request.params.pageId).base;
  db.query('SELECT * FROM employee LEFT JOIN checkin ON employee.name=checkin.Iname WHERE employee.name=?',[filteredId],function(error, employeecheckin){
    if(error){
        throw error;
    }
    var list = template.list(request.topics);
    var html = template.HTML(list,
       `
       <button class="relative" type="button" onclick="location.href='/employee/create' ">직원 추가</button><br>
        ${template.employeeTable(request.employees)}
        ${template.employeeCheckin(employeecheckin)}
        `
    );
    response.send(html);
 });
});

app.get('/employee/checkin/update/:pageId/:pageId2',function (request, response){
  console.log("employee checkin update");
  var filteredId = path.parse(request.params.pageId).base;
  var filteredId2 = path.parse(request.params.pageId2).base;
  db.query('SELECT * FROM employee LEFT JOIN checkin ON employee.name=checkin.Iname WHERE employee.name=? and checkin.id=?',[filteredId, filteredId2],function(error, employeecheckin){
    if(error){
        throw error;
    }
    var list = template.list(request.topics);
    var html = template.HTML(list,
      `
      <button class="relative" type="button" onclick="location.href='/employee/create' ">직원 추가</button>
      <br>
        ${template.employeeTable(request.employees)}
        <br><button class="relative" type="button" onclick="location.href='/employee/checkin/${filteredId}' ">출근시간 수정취소</button>
        ${template.employeeCheckin(employeecheckin)}
        <form action="/employee/checkin/update_process" method="post" class="relative" >
        <input type="hidden" name="id" value="${filteredId2}">
        <input type="hidden" name="name" value="${filteredId}">
        <p>
          출근시간 수정:
          <input type="text" style="width:165px;" name="time" value="">
        <p>
        <p>
          <input type="submit" value="수정">
        </p>
        </from>
        `
    );
    response.send(html);
  });
});

app.post('/employee/checkin/update_process',function(request, response){
  console.log("employee checkin update proccess");
  var post = request.body;
  db.query(`UPDATE checkin SET Idate=? WHERE id=?`,[post.time, post.id],function(error,result){
    if(error) {
      throw error;
    }
    response.redirect(`/employee/checkin/${post.name}`);
  });
});

app.post('/employee/checkin/delete_process',function(request, response){
  console.log("employee checkin delete process");
  var post = request.body;
  db.query(`DELETE FROM checkin WHERE id=?`,[post.id],function(error,result){
    if(error) {
      throw error;
    }
      response.redirect(`/employee/checkin/${post.name}`);
  });
});

app.get('/employee/checkout/:pageId',function(request, response){
  console.log("employee checkout");
   var filteredId = path.parse(request.params.pageId).base;
   db.query('SELECT * FROM employee LEFT JOIN checkout ON employee.name=checkout.Oname WHERE employee.name=?',[filteredId],function(error, employeecheckout){
     if(error){
         throw error;
     }
     var list = template.list(request.topics);
     var html = template.HTML(list,
       `
      <button class="relative" type="button" onclick="location.href='/employee/create' ">직원 추가</button><br>
         ${template.employeeTable(request.employees)}
         ${template.employeeCheckout(employeecheckout)}
      `
     );
     response.send(html);
   });

});

app.get('/employee/checkout/update/:pageId/:pageId2',function(request, response){
  console.log("employee checkout update");
   var filteredId = path.parse(request.params.pageId).base;
   var filteredId2 = path.parse(request.params.pageId2).base;
   db.query('SELECT * FROM employee LEFT JOIN checkout ON employee.name=checkout.Oname WHERE employee.name=? and checkout.id=?',[filteredId, filteredId2],function(error3, employeecheckout){
     var list = template.list(request.topics);
     var html = template.HTML(list,
       `
       <button class="relative" type="button" onclick="location.href='/employee/create'">직원 추가</button>
      <br>
         ${template.employeeTable(request.employees)}
         <br> <button class="relative" type="button" onclick="location.href='/employee/checkout/${filteredId}'">퇴근시간 수정취소</button>
         ${template.employeeCheckout(employeecheckout)}
         <form action="/employee/checkout/update_process" method="post" class="relative">
         <input type="hidden" name="id" value="${filteredId2}">
         <input type="hidden" name="name" value="${filteredId}">
         <p>
           퇴근시간 수정:
           <input type="text" name="time" value="">
         <p>
         <p>
           <input type="submit" value="수정">
         </p>
         </from>
         `
     );
     response.send(html);
   });
});

app.post('/employee/checkout/update_process',function(request, response){
  console.log("employee checkout update process");
  var post = request.body;
  db.query(`UPDATE checkout SET Odate=? WHERE id=?`,[post.time, post.id],function(error,result){
    if(error) {
      throw error;
    }
    response.redirect(`/employee/checkout/${post.name}`);
  });

});

app.post('/employee/checkout/delete_process',function(request, response){
  console.log("employee checkout delete process");
  var post = request.body;
  db.query(`DELETE FROM checkout WHERE id=?`,[post.id],function(error,result){
    if(error) {
      throw error;
    }
      response.redirect(`/employee/checkout/${post.name}`);
  });
});

// 상품 관리 페이지
app.get('/product',function(request, response){
  console.log("product home");
  var list = template.list(request.topics);
  var html = template.HTML(list,
      `<button class="relative" type="button" onclick="location.href='/product/create' ">상품 추가</button><br>
        ${template.productTable(request.products)}`
  );
  response.send(html);
});

app.get('/product/create',function(request, response){
  console.log("product create");
  var list = template.list(request.topics);
  var html = template.HTML(list,
      ` <button class="relative" type="button" onclick="location.href='/product/create' ">상품 추가</button><br>
        ${template.productTable(request.products)}
        <form action="/product/create_process" method="post" class="relative">
          <p> 이름:
            <input type="text" name="pName" placeholder="상품 이름">
          </p>
          <p> 가격:
            <input type="text" name="pPrice" placeholder="가격">
          </p>
          <p>
            RFID:
            <input type="text" name="rfid" placeholder="rfid">
          </p>
          <p>
            상점진열대:
            <input type="text" name="sDisplay" placeholder="A-H">
          </p>
          <p>
            창고진열대:
            <input type="text" name="wDisplay" placeholder="A-H">
          </p>
          <p>
            <input type="submit" value="추가">
          </p>
        </form>
        `
  );
  response.send(html);
});

app.post('/product/create_process',function(request,response){
  console.log("product create process");
  var post = request.body;
  db.query('INSERT INTO product (name, price, rfid,sDisplay,wDisplay) VALUES(?,?,?,?,?)',[post.pName, post.pPrice,post.rfid, post.sDisplay, post.wDisplay],function (error, result){
    if(error) {
      throw error;
    }
    db.query('SELECT COUNT(*) as cnt from product WHERE sDisplay=?',[post.sDisplay],function(error1,Row){
      db.query('UPDATE display SET sNum=? WHERE Dalpha=?',[Row[0].cnt, post.sDisplay],function(error2,result1){
        response.writeHead(302, {Location: `/product`});
        response.end();
      });
    });
  });
});

app.get('/product/update/:pageId',function(request, response){
  console.log("product update");
  var filteredId = path.parse(request.params.pageId).base;
  db.query('SELECT * FROM product WHERE product.id=?',[filteredId],function(error,products){
    if(error){
      throw error;
    }
    var list = template.list(request.topics);
    var html = template.HTML(list,
      ` <button class="relative" type="button" onclick="location.href='/product/create' ">상품 추가</button><br>
        ${template.productTable(request.products)}
        <br>
 <button class="relative" type="button" onclick="location.href='/product' ">상품 수정취소</button><br>
        <form action="/product/update_process" method="post" class="relative">
          <p>
            <input type="hidden" name="id" value="${filteredId}">
          </p>
          <p> 이름:
            <input type="text" name="pName" value="${sanitizeHtml(products[0].name)}" placeholder="상품 이름">
          </p>
          <p> 가격:
            <input type="text" name="pPrice"value="${sanitizeHtml(products[0].price)}" placeholder="가격">
          </p>
          <p>
            RFID:
            <input type="text" name="rfid" value="${sanitizeHtml(products[0].rfid)}" placeholder="rfid" readonly>
          </p>
          <p>
            상점진열대:
            <input type="text" name="sDisplay" value="${sanitizeHtml(products[0].sDisplay)}" placeholder="A-H">
          </p>
          <p>
            창고진열대:
            <input type="text" name="wDisplay" value="${sanitizeHtml(products[0].wDisplay)}"  placeholder="A-B">
          </p>
          <p>
            <input type="submit" value="수정">
          </p>
        </form>
        `
  );
  response.send(html);
  });
});

app.post('/product/update_process',function(request, response){
  console.log("product update process");
  var post = request.body;
  db.query(`UPDATE product SET name=?, price=?, sDisplay=?, wDisplay=? WHERE id=?`,[post.pName,post.pPrice,post.sDisplay,post.wDisplay,post.id],function(error,result){
      if(error) {
        throw error;
      }
      // => 상품 등록 시 진열대별 개수(sNum, wNum) 증가 시키는 부분
      db.query('UPDATE display SET wNum=wNum+1 WHERE display.Dalpha=?',[post.wDisplay],function(error2,result2){
        db.query('UPDATE display SET sNum=sNum+1 WHERE display.Dalpha=?',[post.sDisplay],function(error1, result1){
          response.redirect(`/product`);
        });
      });
  });
});

app.post('/product/delete_process',function(request, response){
  console.log("product delete process");
  var post = request.body;
  db.query(`DELETE FROM product WHERE id=?`,[post.id],function(error,result){
    if(error) {
      throw error;
    }
    db.query('SELECT COUNT(*) as cnt from product WHERE sDisplay=?',[post.display],function(error1,Row){
      db.query('UPDATE display SET sNum=? WHERE Dalpha=?',[Row[0].cnt, post.display],function (erro2, result1){
          response.redirect(`/product`);
      });
    });
  });
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

app.listen(port, function(){
  console.log(`Example app listening at http://localhost:${port}`)
});

//     } else if(pathname === '/customer'){
//        customer.home(request,response);
//     } else if(pathname === '/customer/payment'){
//        customer.payment(request,response);
//     } else if(pathname === '/customer/refund_process'){
//         customer.refund_process(request,response);
