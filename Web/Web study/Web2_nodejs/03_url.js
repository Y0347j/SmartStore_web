// http://localhost/?id=HTML
// id=HTML : Query String
// query String에 따라서 다르데 동작하는 nodejs 코드를 살펴 봄
var http = require('http');
var fs = require('fs');
var url = require('url'); // url이라는 모듈을 url 변수로 사용할 것이라고 알려줌 => 모듈 url

// 모듈 : 기본적으로 제공하는 기능들을 그룹핑해 놓은 각각의 그룹들

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;//url을 분석(parse)해서 추출해야 됨
    console.log(queryData.id);
    if(_url == '/'){
      _url = '/index.html';
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    response.end(queryData.id);

    //console.log(__dirname + url);
    //response.end(fs.readFileSync(__dirname + url)); // 사용자가 접속한 url에 따라서 정적파일(1.html,2.html,3.html 등등)을 읽어주는 코드임

});
app.listen(3000);
