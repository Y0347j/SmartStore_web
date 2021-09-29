var template = require('./template.js');
var db = require('./db');
var qs = require('querystring');
var url = require('url');
var sanitizeHtml = require('sanitize-html');

// employee read
exports.home = function(request,response){
  db.query('SELECT * FROM topic',function(error,topics){
    if(error){
      throw error;
    }
    db.query('SELECT * FROM employee',function(error2,employees){
      if(error2){
        throw error2;
      }
    var list = template.list(topics);
    var html = template.HTML(list,
      `
        ${template.employeeTable(employees)}
        <style>
        table{
          border-collapse: collapse;
        }
        table, th, td{
          border:1px solid black;
        }
        </style>
        `,
        `<a href="/employee/create">직원 추가</a><br><br>`
    );
    response.writeHead(200);
    response.end(html);
    });
  });
}

// employee create
exports.create = function(request, response){
  db.query('SELECT * FROM topic',function(error,topics){
    if(error){
      throw error;
    }
    db.query('SELECT * FROM employee',function(error2,employees){
      if(error2){
        throw error2;
      }
    var list = template.list(topics);
    var html = template.HTML(list,
      `
        ${template.employeeTable(employees)}
        <style>
          table{
            border-collapse: collapse;
          }
          table, th, td{
            border:1px solid black;
          }
        </style>

        <form action="/employee/create_process" method="post">
          <p> 이름:
            <input type="text" name="name" placeholder="name">
          </p>
          <p>
            비밀번호:
            <input type="password" name="password" placeholder="password">
          </p>
          <p>
            성별:
            <input type="text" name="gender" placeholder="gender">
          </p>
          <p>
            전화번호:
            <input type="text" name="phoneNumber" placeholder="phoneNumber">
          </p>
          <p>
            이메일:
            <input type="text" name="email" placeholder="email">
          </p>
          <p>
            주소:
            <input type="text" name="address" placeholder="address">
          </p>
          <p>
            계좌번호:
            <input type="text" name="accountNumber" placeholder="accountNumber">
          </p>
          <p>
            직급:
            <input type="text" name="position" placeholder="position">
          </p>
          <p>
            입사일:
            <input type="date" name="date">
          </p>
          <p>
            <input type="submit" value="추가">
          </p>
        </form>
        `,
        `<a href="/employee/create">직원 추가</a><br><br>`
    );
    response.writeHead(200);
    response.end(html);
    });
  });
}

// employee create_process
exports.create_process = function(request,response){
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      db.query(`INSERT INTO employee (name, password, gender, phoneNumber, email, accountNumber, address, position, date ) VALUES(?,?,?,?,?,?,?,?,?)`,[post.name,post.password, post.gender,post.phoneNumber, post.email, post.accountNumber, post.address, post.position, post.date], function(error,result){
        if(error) {
          throw error;
        }
        response.writeHead(302, {Location: `/employee`});
        response.end();
      });
  });
}

// employee update
exports.update = function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query('SELECT * FROM topic',function(error,topics){
    if(error){
      throw error;
    }
    db.query('SELECT * FROM employee',function(error2,employees){
      if(error2){
        throw error2;
      }
      db.query('SELECT * FROM employee WHERE id=?',[queryData.id],function(error3,employee){
        if(error3){
          throw error3;
        }
        var list = template.list(topics);
        var html = template.HTML(list,
            `
            ${template.employeeTable(employees)}
            <style>
              table{
                border-collapse: collapse;
              }
              table, th, td{
                border:1px solid black;
              }
            </style>

            <form action="/employee/update_process" method="post">
              <p>
                <input type="hidden" name="id" value="${queryData.id}">
              </p>
              <p>
                이름:
                <input type="text" name="name" value="${sanitizeHtml(employee[0].name)}" placeholder="name">
              </p>
              <p>
                비밀번호:
                <input type="text" name="password" value="${sanitizeHtml(employee[0].password)}" placeholder="password">
              </p>
              <p>
                성별:
                <input type="text" name="gender" value="${sanitizeHtml(employee[0].gender)}" placeholder="gender">
              </p>
              <p>
                전화번호:
                <input type="text" name="phoneNumber" value="${sanitizeHtml(employee[0].phoneNumber)}" placeholder="phoneNumber">
              </p>
              <p>
                이메일:
                <input type="text" name="email" value="${sanitizeHtml(employee[0].email)}" placeholder="email">
              </p>
              <p>
                주소:
                <input type="text" name="address" value="${sanitizeHtml(employee[0].address)}" placeholder="address">
              </p>
              <p>
                계좌번호:
                <input type="text" name="accountNumber" value="${sanitizeHtml(employee[0].accountNumber)}" placeholder="accountNumber">
              </p>
              <p>
                직급:
                <input type="text" name="position" value="${sanitizeHtml(employee[0].position)}" placeholder="position">
              </p>
              <p>
                <input type="submit" value="수정">
              </p>
            </form>
            `,
            `<a href="/employee/create">직원 추가</a>
            <a href="/employee">수정 취소</a><br><br>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  });
}

// employee update_process
exports.update_process = function(request,response){
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      db.query(`UPDATE employee SET name=?, password=?,  gender=?, phoneNumber=?, email=?, accountNumber=?, address=?, position=? WHERE id=?`,[post.name,post.password,post.gender,post.phoneNumber,post.email,post.accountNumber,post.address,post.position,post.id],function(error,result){
        if(error) {
          throw error;
        }
        response.writeHead(302, {Location: `/employee`});
        response.end();
      });
  });
}

// employee delete_process
exports.delete_process = function(request,response){
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
    var post = qs.parse(body);
      db.query(`DELETE FROM employee WHERE id=?`,[post.id],function(error,result){
        if(error) {
          throw error;
        }
        response.writeHead(302, {Location: `/employee`});
        response.end();
      });
    });
}

// employee checkin
exports.checkin = function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query('SELECT * FROM topic',function(error,topics){
    if(error){
      throw error;
    }
    db.query('SELECT * FROM employee',function(error2,employees){
      if(error2){
        throw error2;
      }
      db.query('SELECT * FROM employee LEFT JOIN checkin ON employee.id=checkin.employee_id WHERE employee.id=?',[queryData.id],function(error3, employeecheckin){
        var list = template.list(topics);
        var html = template.HTML(list,
          `
            ${template.employeeTable(employees)}
            ${template.employeeCheckin(employeecheckin)}
            <style>
              table{
                border-collapse: collapse;
              }
              table, th, td{
                border:1px solid black;
              }
            </style>
            `,
            ``
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  });
}

//employee checkin update
exports.checkin_update = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query('SELECT * FROM topic',function(error,topics){
    if(error){
      throw error;
    }
    db.query('SELECT * FROM employee',function(error2,employees){
      if(error2){
        throw error2;
      }
      db.query('SELECT * FROM employee LEFT JOIN checkin ON employee.id=checkin.employee_id WHERE checkin.id=?',[queryData.id],function(error3, employeecheckin){
        var list = template.list(topics);
        var html = template.HTML(list,
          `
            ${template.employeeTable(employees)}
            ${template.employeeCheckin(employeecheckin)}
            <style>
              table{
                border-collapse: collapse;
              }
              table, th, td{
                border:1px solid black;
              }
            </style>
            <form action="/employee/checkin/update_process" method="post">
            <input type="hidden" name="emp_id" value="${employeecheckin[0].employee_id}">
            <input type="hidden" name="id" value="${queryData.id}">
            <p>
              출근시간 수정:
              <input type="text" name="time" placeholder="1970.01.01 00:00:00">
            <p>
            <p>
              <input type="submit" value="수정">
            </p>
            </from>
            `,
            `<a href="/employee/checkin?id=${queryData.id}">취소</a><br><br>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  });
}

//employee checkin update_process
exports.checkin_update_process = function (request, response){
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      db.query(`UPDATE checkin SET time=? WHERE id=?`,[post.time, post.id],function(error,result){
        if(error) {
          throw error;
        }
        response.writeHead(302, {Location: `/employee/checkin?id=${post.emp_id}`});
        response.end();
      });
  });
}

// employee checkout
exports.checkout = function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query('SELECT * FROM topic',function(error,topics){
    if(error){
      throw error;
    }
    db.query('SELECT * FROM employee',function(error2,employees){
      if(error2){
        throw error2;
      }
      db.query('SELECT * FROM employee LEFT JOIN checkout ON employee.id=checkout.employee_id WHERE employee.id=?',[queryData.id],function(error3, employeecheckout){
        var list = template.list(topics);
        var html = template.HTML(list,
          `
            ${template.employeeTable(employees)}
            ${template.employeeCheckout(employeecheckout)}
            <style>
              table{
                border-collapse: collapse;
              }
              table, th, td{
                border:1px solid black;
              }
            </style>
            `,
            ``
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  });
}

// employee checkout update
exports.checkout_update = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query('SELECT * FROM topic',function(error,topics){
    if(error){
      throw error;
    }
    db.query('SELECT * FROM employee',function(error2,employees){
      if(error2){
        throw error2;
      }
      db.query('SELECT * FROM employee LEFT JOIN checkout ON employee.id=checkout.employee_id WHERE checkout.id=?',[queryData.id],function(error3, employeecheckout){
        var list = template.list(topics);
        var html = template.HTML(list,
          `
            ${template.employeeTable(employees)}
            ${template.employeeCheckout(employeecheckout)}
            <style>
              table{
                border-collapse: collapse;
              }
              table, th, td{
                border:1px solid black;
              }
            </style>
            <form action="/employee/checkout/update_process" method="post">
            <input type="hidden" name="emp_id" value="${employeecheckout[0].employee_id}">
            <input type="hidden" name="id" value="${queryData.id}">
            <p>
              퇴근시간 수정:
              <input type="text" name="time" placeholder="1970.01.01 00:00:00">
            <p>
            <p>
              <input type="submit" value="수정">
            </p>
            </from>
            `,
            `<a href="/employee/checkout?id=${queryData.id}">취소</a><br><br>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  });
}

//employee checkin update_process
exports.checkout_update_process = function (request, response){
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      db.query(`UPDATE checkout SET time=? WHERE id=?`,[post.time, post.id],function(error,result){
        if(error) {
          throw error;
        }
        response.writeHead(302, {Location: `/employee/checkout?id=${post.emp_id}`});
        response.end();
      });
  });
}
