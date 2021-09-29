var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    var pathname = url.parse(_url, true).pathname; // query string을 제외한 path만을 보여줌

    console.log(url.parse(_url,true)); // url에 어떤 내용이 담겨있는지 확인 할 수 있음


    if(pathname === '/'){ // 루트로 접근 했는지 확인
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        var template = `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          <ul>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ul>
          <h2>${title}</h2>
          <p>${description}</p>
        </body>
        </html>
        `;
        response.writeHead(200); // 200이라는 숫자를 서버가 브라우저에게 주면 파일을 성공적으로 전송했다는 뜻
        response.end(template);
      });
    } else {
      // 존재하지 않는 파일로 들어왔을 경우
      response.writeHead(404); // 파일을 찾을 수 없는 경우
      response.end('Not found');
    }



});
app.listen(3000);
