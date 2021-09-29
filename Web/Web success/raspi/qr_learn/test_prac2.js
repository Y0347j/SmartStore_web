var express = require('express')
var app = express()
var path = require('path');


// var bodyParser = require('body-parser');
// var compression = require('compression');
//
// app.use(express.static('public'));
//
// app.use(bodyParser.urlencoded({ extended: false }));
//
// app.use(compression());
//
// app.use(bodyParser.json());

app.get('/:pageId/:pageId2',function(request, response){
  var cmd = path.parse(request.params.pageId).base;
  var qr = path.parse(request.params.pageId2).base;
  console.log("cmd: "+ cmd);
  console.log("qr: "+qr);
  var i = qr.substring(2,3);
  var j = qr.substring(4,5);
});

app.listen(9000);
