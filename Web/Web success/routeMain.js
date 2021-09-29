var express = require('express')
var app = express()
var fs = require('fs');
var bodyParser = require('body-parser');
var compression =require('compression');

var employeeRouter = require('./routes/employee2');
var inventoryRouter = require('./routes/inventory2');
var topicRouter = require('./routes/topic2');

var db =require('./lib/db');

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

// ---------------- 안드로이드와 웹 통신 -----------------

// 로그인 미들웨어
app.use(function(request, response,next){
  var result ={'resultId':'FAIL','resultPw':'FAIL','name':'','gender':'', 'join':'','phone':'','email':'','address':'','bank':'','account':''};

  var paramCmd = request.body.cmd;
  var paramId = request.body.id;
  var paramPassword = request.body.pw;

  var selectCnt = 'SELECT COUNT(*) as cnt FROM employee WHERE login_id=?';
  var select = 'SELECT * FROM employee WHERE login_id=?';

  console.log(paramCmd);
  if(paramCmd == 'login'){
    db.query(selectCnt,[paramId],function(error,Row){
      if(Row[0].cnt > 0){
         db.query(select,[paramId],function(error,employees){
          if(paramId == employees[0].login_id ) result.resultId ='OK';
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

// 비밀번호 찾기 미들웨어
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
        if(error1){
          throw errorl;
        }
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
        if(error1){
          throw errorl;
        }
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

// 비밀번호 변경 미들웨어
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
        if(error1){
          throw errorl;
        }
        if(paramOPassword == employees[0].password) result.resultCode='OK';
        response.send(result);
      });
    }
  });
  }else{
    next();
  }
});

// 비밀번호 변경 처리 미들웨어
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
        if(error1){
          throw errorl;
        }
        result.resultCode='OK';
        response.send(result);
      });
    }
  });
  }else{
    next();
  }
});

// ---------------- 웹 데이터베이스 통신 -----------------

app.use('/',topicRouter);
app.use('/employee',employeeRouter);
//app.use('/inventory',inventoryRouter);

// ------------------ 웹 아두이노 통신 -------------------



// ---------------- 웹 라즈베리파이 통신 -----------------

// --------------------- 예외 처리 -----------------------
app.use(function(req, res,next){
  res.status(404).send("Sorry can't find that!!");
});

app.use(function(err, req, res,next){
    console.error(err.stack)
    res.status(500).send('Something broke!')
 });

app.listen(port, function(){
  console.log(`Example app listening at http://localhost:${port}`)
});
