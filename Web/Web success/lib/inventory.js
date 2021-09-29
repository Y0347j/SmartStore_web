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
    db.query('SELECT * FROM product',function(error2,products){
      if(error2){
        throw error2;
      }
      var list = template.list(topics);
      var html = template.HTML(list,
      `
        ${template.projectTable(products)}
        <style>
        table{
          border-collapse: collapse;
        }
        table, th, td{
          border:1px solid black;
        }
        </style>
        `,
        `<a href="/inventory/create">상품 추가</a><br><br>`
    );
    response.writeHead(200);
    response.end(html);
    });
  });
}
