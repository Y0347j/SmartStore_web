// 라즈베리파이 연결 연습 <= 서버 용
var http = require('http');

// 클라이언트에서 요청이 왔을 때 들어가는 함수
var app = http.createServer(function (req, res) {
  var jsonData = "";
  req.on('data', function (chunk) {
    jsonData += chunk;
  }); // 요청 스트림에서 데이터를 읽은 후

  req.on('end', function () {
    // 이벤트 핸들러에서 데이터 객체를 반환하고 message와 question 속성을 가진 새로운 객체를 만듦
    console.log("jsonData: "+jsonData);
    var reqObj = JSON.parse(jsonData);
    console.log(reqObj);
    var resObj = {
      message: "Hello " + reqObj.name,
      question: "Are you a good " + reqObj.occupation + "?"
    };

    // 클라이언트에 응답을 보냄
    // 새로운 객체를 JSON 문자열로 반환하여 응답 개체에 씀
    res.writeHead(200);
    res.end(JSON.stringify(resObj));
  });

}).listen(8080);
