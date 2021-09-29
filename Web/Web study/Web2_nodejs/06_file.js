var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var title = queryData.id;
    console.log(queryData.id);
    if(_url == '/'){
      title="Welcome";
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    fs.readFile(`data/${title}`,'utf8',function(err,data){
      var description = data;
      var template =`
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="colors.js"></script>
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <!-- <h1><a href="index.html">WEB</a></h1> -->
      <input type="button" value="night" onclick="nightDayHandler(this)">

        <ol>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ol>
        <h2>${title}</h2>
        <p>${description}
        </p>
      </body>
      </html>
      `;
      response.end(template);
    })

});
app.listen(3000);
