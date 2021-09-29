var express = require('express');
var http = require('http');
var path = require('path');
var bodyParaser = require('body-parser');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParaser.urlencoded({extended: true}));

app.get('/process/login', function(req, res) {
    var paramId = req.param('id');

    console.log('/precess/login 처리, id: '+ paramId);

    res.write("Success");
    res.end();
});

http.createServer(app).listen(3000, function() {
    console.log('Express 서버가 3000번 포트에서 시작됨.');
});
