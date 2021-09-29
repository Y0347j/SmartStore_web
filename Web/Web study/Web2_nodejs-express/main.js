var express = require('express')
var app = express()
var fs = require('fs');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression =require('compression');
const port = 3000

// express의 2가지 기능 -> route, middleware(다른사림이 만든 소프트웨어)

app.use(express.static('public'));

// 이 코드가 실행되면 그 결과로 이 곳에 미들웨어가 들어오게 됨
app.use(bodyParser.urlencoded({ extended: false })); // 바디파써가 만들어내느 미들웨어를 표현하는 코드
// -> 내부적으로 하는일: 사용자가 전송한 post data를 내부적으로 분석해서 모든 데이터를 가져온 다음에 관련 경로에 해당되는 콜백을 호출하도록 약속되어 있음
// post를 받는 부분에서 쓰임

app.use(compression());//호출한 미들웨어를 리턴

// 내가 만드는 미들웨어
app.use(function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist; // request라는 객체의 list라는 변수에 filelist값을 줌
    next(); // 그 다음에 호출되어야 할 미들웨어가 담겨 있는 함수
  });
});

app.get('/',function(request,response){
//표현해 주는 기능 - 공통적으로 사용되고 있음 => 미들웨어호 만들어서 사용하기
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    //var list = template.list(filelist);
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
      `
      ,
      `<a href="/create">create</a>`
    );
    response.send(html);
//  });
});

// querystring이 아닌 path방식을 통해서 파라미터가 전달되는 경우의 처리 방법
app.get('/page/:pageId',function(request,response,next){
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
    if(err){
      next(err); // 미들웨어를 던져줌
      // 1. next의 값에다가 아무값을 주지 않으면 정상적인 상황이고 다음 미들웨어를 호출하는 것
      // 2. next('route'): 이것도 정상적인 것
      // 3. 그외의 인자가 들어오면 에러라는 것을 내부적으로 알려줌

    }else{
      var title = request.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1']
      });
      var list = template.list(request.list);
      var html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/create">create</a>
          <a href="/update/${sanitizedTitle}">update</a>
          <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      );
      response.send(html);
    }
  });
});

app.get('/create',function(request,response){
  var title = 'WEB - create';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <form action="/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `, '');
  response.send(html);
});


app.post('/create_process',function(request, response){
/*
// 미들웨어를 쓰기 전에는 다소 너저분 함
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  // 데이터가 더 이상 없다는 이벤트가 발생했을 때 실제 처리 해주는 코드
  request.on('end', function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      })
  });
*/
  var post = request.body; // request 객체의 body property에 접근하는 걸 통해서 간결하게 코드를 만들 수 있음
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    // response.writeHead(302, {Location: `/?id=${title}`});
    // response.end();
    response.redirect(`/page/${title}`);
  });
});

app.get('/update/:pageId',function(request,response){
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
    var title = request.params.pageId;
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `
      <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `,
      `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
    );
    response.send(html);
  });
});

app.post('/update_process',function(request, response){
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error){
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      response.redirect(`/page/${title}`);
    })
  });
});

app.post('/delete_process',function(request, response){
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error){
    response.redirect('/');
  });
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
