// 11_lecture.js의 코드를 수정하는 것
// 이때 부터 pm2 사용 시작함 => 설명은 npm_pm2 폴더 안에 존재
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
  </body>
  </html>
  `;
}
function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

// request : 서버에 요청할때 웹브라우저가 보낸 정보
// response : 서버가 응답할 때 웹브라우저한테 전송할 정보
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);
          var template = templateHTML(title, list,`<h2>${title}</h2>${description}`);
          response.writeHead(200);
          response.end(template);
        });
      } else {
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list,`<h2>${title}</h2>${description}`);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if(pathname==='/create'){
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list,`
          <form action="http://localhost:3000/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
          </form>
          `);
        response.writeHead(200);
        response.end(template); // template내용을 웹페이지에 보여주는 역할을 함
      });
    } else if(pathname==='/create_process'){
      var body='';
      // 웹브라우저가 전송하는 데이터가 엄청나게 많을 경우에 사용하는 함수 방법 => event(이벤트)
      request.on('data',function(data){
        body = body + data; // body 변수에 callback으로 전달 되어오는 data를 더해줌
      });
      request.on('end',function(){ // data 전송이 끝났을 경우
        var post = qs.parse(body); // post된 정보가 들어 있음
        var title = post.title;
        var description = post.description;
        console.log(post.title);
      });
      response.writeHead(200);
      response.end('success');
    }else {
        response.writeHead(404);
        response.end('Not found');
    }

});
app.listen(3000);
