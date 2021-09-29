// 라즈베리파이 연결 연습 <= 클라이언트 용
var http = require('http');
var options = {
  host: '192.168.43.6',
  path: '/',
  port: '8080',
  method: 'POST'
};

// 서버로부터 응답 정보를 보여줌
function readJSONResponse(response) {
  var responseData = '';
  //서버에서 응답을 받으면 on('data') 핸들러가 JSON응답을 읽음
  response.on('data', function (chunk) {
    responseData += chunk;
  });

  //on('end')핸들러가 응답을 JSON 객체로 변환하고 원시 응답과 메시지, 질문 형태로 출력함
  response.on('end', function () {
    var dataObj = JSON.parse(responseData);
    console.log("Raw Response: " +responseData);
    console.log("Message: " + dataObj.message);
    console.log("Question: " + dataObj.question);
  });
}

var name = "yj";
// 서버에 요청을 보냄
// 클라이언트에서 JSON 문자열이 요청 스트림에 기록되고 end() 호출로 요청이 종료되면 웹서버는 클라이언트에서 name과 occupation 속성을 가진 JSON 문자열을 받음
var req = http.request(options, readJSONResponse);
req.write(`{"name":"${name}", "occupation":"Burglar"}`);
req.end();

// https://mylko72.gitbooks.io/node-js/content/chapter7/chapter7_4.html
