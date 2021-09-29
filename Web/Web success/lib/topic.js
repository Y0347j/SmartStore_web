var template = require('./template.js');
var db =require('./db');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');


exports.home = function(request,response){
// database를 main.js로 load 하는 방법
  db.query('SELECT * FROM topic',function(error,topics){
    if(error){
      throw error;
    }
    var list = template.list(topics);
    var html = template.HTML(list,
        ``,
        ``
    );
    response.writeHead(200);
    response.end(html);
  });
}
