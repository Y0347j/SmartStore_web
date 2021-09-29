/* Main */

// 기본 모듈 포함
const express = require('express'), // 웹 프레임워크
  bodyParser = require('body-parser'); // 바디에 담기는 데이터를 파싱해주는 모듈

// 기본 인스턴스 생성
const app = express(); // express를 사용하기 위한 인스턴스 생성

// 포트 설정
const PORT = process.env.PORT || 3000;

// 기본 앱 세팅
app.set('view engine', 'ejs'); // HTML 뷰 엔진은 ejs 사용
app.use(express.static(`${__dirname}/public`)); // 프런트 개발 파일들의 정적 경로 세팅 => public
app.use(bodyParser.json()); // body-parser를 사용하기 위한 초기 설정
app.use(bodyParser.urlencoded({ extended: true })); // body-parser를 사용하기 위한 초기 설정

// 라우팅
app.use('/', require('./routes/led'));

// 서버 오픈
app.listen(PORT, () => console.log(`서버가 ${PORT} 포트에서 정상 가동되었습니다.`));
