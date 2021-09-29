/* routes/led.js */

// 라우팅을 위한 기본 모듈 포함
const express = require('express'),
  router = express.Router(),
  serialPort = require('../arduino/serial-port'); // 시리얼 통신을위한 모듈 포함

// 라우팅
router.get('/', (req, res) => {
  res.render('led/management');
});

// /on으로 post 메소드로 요청이 올 경우
router.post('/on', (req, res) => {
  // 시리얼 포트를 사용하기 위해 오픈
  serialPort.open(() => {

    // 해당 포트로 1 전달 (LED 켜짐)
    serialPort.write('1', (err, results) => {
      // 에러 처리
      if (err) throw err;

      // /on으로 post 메소드를 요청한 fetch()에게 true 응답
      res.json(true);
    });
  });
});

// /off으로 post 메소드로 요청이 올 경우
router.post('/off', (req, res) => {
  // 시리얼 포트를 사용하기 위해 오픈
  serialPort.open(() => {

    // 해당 포트로 1 전달 (LED 꺼짐)
    serialPort.write('0', (err, results) => {
      // 에러 처리
      if (err) throw err;

      // /off으로 post 메소드를 요청한 fetch()에게 true 응답
      res.json(true);
    });
  });
});

// 모듈 내보내기
module.exports = router;