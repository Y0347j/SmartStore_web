var template = require('./template.js');
var db = require('./db');
var qs = require('querystring');
var url = require('url');
var sanitizeHtml = require('sanitize-html');

exports.home = function(request,response){
  db.query('SELECT * FROM topic',function(error,topics){
    if(error){
      throw error;
    }
    db.query('SELECT * FROM customer',function(error2,customers){
      if(error2){
        throw error2;
      }
      var list = template.list(topics);
      var html = template.HTML(list,
      `
        ${template.customerTable(customers)}
        <style>
        table{
          border-collapse: collapse;
        }
        table, th, td{
          border:1px solid black;c
        }
        </style>
        `,
        ``
    );
    response.writeHead(200);
    response.end(html);
    });
  });
}

exports.payment = function(request,response){
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  request.on('end', function(){
      var post = qs.parse(body);
      db.query('SELECT * FROM topic',function(error,topics){
        if(error){
          throw error;
        }
        db.query('SELECT * FROM customer',function(error2,customers){
          if(error2){
            throw error2;
          }
        db.query('SELECT * FROM customer LEFT JOIN payment ON customer.id=payment.customer_id WHERE customer.id=? ',[queryData.id],function(error3,customerPayment){

          if(error3){
            throw error3;
          }

          db.query(`SELECT * FROM customer LEFT JOIN payment ON customer.id=payment.customer_id WHERE customer.id=? and payment.refund='x'and payment.allPrice =0`,[queryData.id], function(error4, customerNotRefund){
            if(error4) {
              throw error4;
            }
            var i =0;
            while(i < customerNotRefund.length){
            var allPrice =0;
            var j=0;
            var paymentId = sanitizeHtml(customerNotRefund[i].payment.id);
            console.log(paymentId);
            var payment = sanitizeHtml(customerNotRefund[i].item);
            var paymentSplit = payment.split(',');
            while(j<paymentSplit.length){
              if(j%2 == 1){
                allPrice += Number(paymentSplit[j]);
              }
              j++;
            }
            db.query('UPDATE customer LEFT JOIN payment ON customer.id=payment.customer_id SET payment.allPrice=? WHERE payment.id=? ', [allPrice,paymentId]);
            i++;
          }
        });
        var list = template.list(topics);
        var html = template.HTML(list,
        `
          ${template.customerTable(customers)}
          ${template.customerSum(customerPayment)}
          ${template.customerPayment(customerPayment)}
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
  });
}

exports.refund_process = function(request,response){
  var body = '';

  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      db.query(`UPDATE customer LEFT JOIN payment ON customer.id=payment.customer_id SET payment.refund='o', payment.allPrice=0 WHERE payment.id=?`,[post.id],function(error,result){
        if(error){
          throw error;
        }
        response.writeHead(302, {Location: `/customer/payment?id=${post.cus_id}`});
        response.end();
      })
  });
}
