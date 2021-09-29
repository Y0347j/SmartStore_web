var http = require('http');

var options = {
  host: "192.168.43.6",
  port: 3000,
  path: "/"
}

var req = http.request(options, (res) => {
  var data = "";

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(data);
  });
});

req.end();

// 라즈베리파이에서 node raspiPrac_client.js 실행
// host는 윈도우 Ip, port 맞추기

// 결과 => hello world 날아옴
