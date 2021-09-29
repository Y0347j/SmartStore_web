var express = require('express') // 모듈을 load 해 옴
var app = express() // express()는 함수, application이라는 객체가 app에 담김
const port = 3000

// route, routung => 사용자들이 여러 가지 경로를 통해서 들어올 때 경로마다 적당한 응답을 해주는 것
// app.get('/', (req, res) => {  res.send('Hello World!') })
// 아래의 코드는 위의 코드와 동일한 코드임
app.get('/',function(req,res){
  return res.send("/")
});

app.get('/page',function(req,res){
  return res.send("page")
});

// app.listen(port, () => {  console.log(`Example app listening at http://localhost:${port}`) })

app.listen(port, function(){
  console.log(`Example app listening at http://localhost:${port}`)
});


// express가 제공하는 가장 중요한 기능임
