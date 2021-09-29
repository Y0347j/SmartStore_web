var express = require('express')
var router = express.Router()
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var db =require('../lib/db');

router.get('/',function(request,response,next){
    var list = template.list(request.topics);
    var html = template.HTML(list,
      `
      <a class="relative" href="/employee/create">직원 추가</a><br>
        ${template.employeeTable(request.employees)}
        `
    );
    response.send(html);
});

router.get('/create',function(request,response){
  var list = template.list(request.topics);
  var html = template.HTML(list,
    `
    <a class="relative" href="/employee/create">직원 추가</a><br>
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

router.post('/create_process',function(request,response){
  var post = request.body;
  console.log(post.date);
  db.query(`INSERT INTO employee (name, login_id, password, gender, phoneNumber, email, accountNumber, bank,address, position, date) VALUES(?,?,?,?,?,?,?,?,?,?,?)`,[post.name,post.login_id,post.password, post.gender,post.phoneNumber, post.email, post.accountNumber,post.bank,post.address, post.position, post.date], function(error,result){
    if(error) {
      throw error;
    }
    db.query(`INSERT INTO commute (checkin, checkout, name) VALUES(?,?,?)`,[post.checkin, post.checkout,post.name],function(error1, result1){
    if(error1){
      throw error1;
    }
    db.query(`INSERT INTO checkin (date, name) VALUES(?,?)`,[post.date,post.name],function(error2,result2){
      if(error2){
        throw error2;
      }
      db.query(`INSERT INTO checkout (date, name) VALUES(?,?)`,[post.date,post.name],function(error3,result3){
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

router.get('/update/:pageId',function(request,response){
  var filteredId = path.parse(request.params.pageId).base;
  db.query('SELECT * FROM employee LEFT JOIN commute ON employee.name = commute.name WHERE employee.name=?',[filteredId],function(error,employee){
    if(error){
      throw error;
    }
    var list = template.list(request.topics);
    var html = template.HTML(list,
        `
        <a class="relative" href="/employee/create">직원 추가</a>
        <a class="relative" href="/employee">직원 정보 수정 취소</a><br>
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

router.post('/update_process',function(request, response){
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

router.post('/delete_process',function(request, response){
  var post = request.body;
  console.log(post.name);
  db.query(`DELETE FROM employee WHERE name=?`,[post.name],function(error1,result1){
    if(error1) {
      throw error1;
    }
    db.query(`DELETE FROM checkin WHERE name=?`,[post.name],function(error2,result2){
      if(error2) {
        throw error2;
      }
      db.query(`DELETE FROM checkout WHERE name=?`,[post.name],function(error3,result3){
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

router.get('/checkin/update/:pageId/:pageId2',function (request, response){
  var filteredId = path.parse(request.params.pageId).base;
  console.log(filteredId);
  var filteredId2 = path.parse(request.params.pageId2).base;
  console.log(filteredId2);
  db.query('SELECT * FROM employee LEFT JOIN checkin ON employee.name=checkin.name WHERE employee.name=? and checkin.id=?',[filteredId, filteredId2],function(error, employeecheckin){
    if(error){
        throw error;
    }
    var list = template.list(request.topics);
    var html = template.HTML(list,
      `
      <a class="relative" href="/employee/create">직원 추가</a><br>
        ${template.employeeTable(request.employees)}
        <br><a href="/employee/checkin/${filteredId}" class="relative">출근시간 수정 취소</a>
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

router.post('/checkin/update_process',function(request, response){
  var post = request.body;
  console.log('checkin update');
  console.log(post.time);
  console.log(post.id);
  console.log(post.name);
  db.query(`UPDATE checkin SET date=? WHERE id=?`,[post.time, post.id],function(error,result){
    if(error) {
      throw error;
    }
    response.redirect(`/employee/checkin/${post.name}`);
  });

});

router.get('/checkin/:pageId',function(request, response){
  var filteredId = path.parse(request.params.pageId).base;
  db.query('SELECT * FROM employee LEFT JOIN checkin ON employee.name=checkin.name WHERE employee.name=?',[filteredId],function(error, employeecheckin){
    if(error){
        throw error;
    }
    var list = template.list(request.topics);
    var html = template.HTML(list,
       `
       <a class="relative" href="/employee/create">직원 추가</a><br>
        ${template.employeeTable(request.employees)}
        ${template.employeeCheckin(employeecheckin)}
        `
    );
    response.send(html);
 });
});

router.get('/checkout/update/:pageId/:pageId2',function(request, response){
   var filteredId = path.parse(request.params.pageId).base;
   var filteredId2 = path.parse(request.params.pageId2).base;
   db.query('SELECT * FROM employee LEFT JOIN checkout ON employee.name=checkout.name WHERE employee.name=? and checkout.id=?',[filteredId, filteredId2],function(error3, employeecheckout){
     var list = template.list(request.topics);
     var html = template.HTML(list,
       `
       <a class="relative" href="/employee/create">직원 추가</a><br>
         ${template.employeeTable(request.employees)}
         <br><a href="/employee/checkout/${filteredId}" class="relative">퇴근시간 수정 취소</a>
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

router.post('/checkout/update_process',function(request, response){
  var post = request.body;
  console.log('checkout update');
  console.log(post.time);
  console.log(post.id);
  console.log(post.name);
  db.query(`UPDATE checkout SET date=? WHERE id=?`,[post.time, post.id],function(error,result){
    if(error) {
      throw error;
    }
    response.redirect(`/employee/checkout/${post.name}`);
  });

});

router.get('/checkout/:pageId',function(request, response){
   var filteredId = path.parse(request.params.pageId).base;
   db.query('SELECT * FROM employee LEFT JOIN checkout ON employee.name=checkout.name WHERE employee.name=?',[filteredId],function(error, employeecheckout){
     if(error){
         throw error;
     }
     var list = template.list(request.topics);
     var html = template.HTML(list,
       `
       <a class="relative" href="/employee/create">직원 추가</a><br>
         ${template.employeeTable(request.employees)}
         ${template.employeeCheckout(employeecheckout)}
      `
     );
     response.send(html);
   });

});

module.exports = router;
