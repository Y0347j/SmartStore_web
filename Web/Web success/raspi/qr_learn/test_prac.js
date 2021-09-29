var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var app = http.createServer(function (req, res) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if(pathname === '/'){
  var qCmd = queryData.cmd;
  var qData = queryData.data;
  console.log(qCmd);
  console.log(qData);

  var jsonData = "";

  req.on('data', function (chunk) {
    jsonData += chunk;
  });

  req.on('end', function () {
    var reqObj = JSON.parse(jsonData);
    var paramCmd = reqObj.cmd;
    var paramQR = reqObj.data;
    console.log(paramCmd);
    var result ={'resultCode':'FAIL'};
    if(paramCmd == "sendQR"){
      console.log(paramQR);
      result.resultCode='OK';
      res.writeHead(200);
      res.end(JSON.stringify(result));
    }
  });
}
});

app.listen(3000);
