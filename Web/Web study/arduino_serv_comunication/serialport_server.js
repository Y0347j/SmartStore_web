var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("COM3", {
 baudrate: 9600
}, false);
serialPort.open(function () {
 console.log('connected...');
serialPort.on('data', function(data) {
 // 아두이노에서 오는 데이터를 출력한다.
 console.log('data received: ' + data);
 });
});
