var express = require('express')
var app = express() // express라는 모듈 자체를 호출, application이라는 객체를 리턴해줌
var fs = require('fs');
var bodyParser = require('body-parser');
var compression =require('compression');
var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');
const port = 3000

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(compression());

app.use(function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});


// 라우터라는 기능을 이용해서 파일로 쪼개서 간단하게 정리함
app.use('/',indexRouter);

// "/topic" 으로 사작하는 주소들에게 topicRouter라는 이름의 미들웨어를 적용하겠다는 의미
app.use('/topic',topicRouter);

app.use(function(req, res,next){
  res.status(404).send("Sorry can't find that!!");
});

app.use(function(err, req, res,next){
    console.error(err.stack)
    res.status(500).send('Something broke!')
 });

app.listen(port, function(){
  console.log(`Example app listening at http://localhost:${port}`)
});
