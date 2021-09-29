var http = require('http');

var options = {
  host: '192.168.43.6',
  path: '/delete',
  port: '3000',
  method: 'POST'
};

function readJSONResponse(response) {
  var responseData = '';

  response.on('data', function (chunk) {
    responseData += chunk;
  });

  response.on('end', function () {
    var dataObj = JSON.parse(responseData);
    console.log("Raw Response: " +responseData);
    console.log("Message: " + dataObj.resultCode);
  });
}

// var rfid="DC77F701";
// var rfid="D6067B2B";
// var rfid="FCC6F901";
// var rfid="9979EAB3";

var req = http.request(options, readJSONResponse);
//req.write(`{"cmd":"addproduct", "rfid":"${rfid}"}`); // 상품이 상점, 창고 진열대에 추가 되는 경우
req.write(`{"cmd":"deleteRFID", "rfid":"${rfid}"}`); // 상품이 상점 진열대에서 빠지는 경우
req.end();
