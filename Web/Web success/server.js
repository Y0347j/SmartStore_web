var express = require('express');
//var http = require('http');
var path = require('path');
var bodyParaser = require('body-parser');
var template = require('./lib/templateAr.js');
var app = express();
const port = 3000

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParaser.urlencoded({extended: true}));

// 아두이노에서 정보를 받아오는 함수 + 경로를 계산해서 전달하는 함수
app.get('/',function(request, response){

  var paramId = request.param('qr'); // 아두이노에서 보내는 qr 정보
  console.log('Qr: '+ paramId);
  // Robot rStatㄷ='store', rpos='qr정보' update
  
  // 경로 계산 후 (A star)
  var string = '';

  // 보낼 data => string
  response.write(string); // 아두이노로 보내는 값
  response.end();
});

// 1. 예외 처리
app.use(function(req, res,next){
  res.status(404).send("Sorry can't find that!!");
});

// 2. 예외 처리
app.use(function(err, req, res,next){
    console.error(err.stack)
    res.status(500).send('Something broke!')
 });

app.listen(port, function(){
  console.log(`Example app listening at http://localhost:${port}`)
});

// http.createServer(app).listen(3000, function() {
//     console.log('Express 서버가 3000번 포트에서 시작됨.');
// });


// 1. req.param
// 주소에 포함된 변수를 담는다. 예를 들어 https://okky.com/post/12345 라는 주소가 있다면 12345를 담는다
// 2. req.query
// 주소 바깥, ? 이후의 변수를 담는다. 예를 들어 https://okky.com/post?q=Node.js 일 경우 Node.js를 담는다
// 3. req.body
// XML, JSON, Multi Form 등의 데이터를 담는다. 당연히 주소에선 확인할 수 없다.
