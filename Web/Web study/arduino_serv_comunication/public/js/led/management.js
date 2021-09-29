/* public/js/led/management.js */
'use strict';

// 버튼 변수 선언
const ledOnBtn = document.querySelector('#led-on'),
  ledOffBtn = document.querySelector('#led-off');

// LED 상태 메세지 변수 선언
const status = document.querySelector('#status');

// LED On 함수
function onLed() {
  // fetch()로 post 메소드 요청
  fetch('/on', {
    method : 'POST',
    headers : {
      'Content-Type' : 'application/json'
    }
  })
    .then((promise) => promise)
    .then((result) => {
      // 반환된 결과가 true이면 실행
      if (result) {
        status.innerText = `LED가 켜졌습니다`;
      }
    });
}

// LED Off 함수
function offLed() {
  // fetch()로 post 메소드 요청
  fetch('/off', {
    method : 'POST',
    headers : {
      'Content-Type' : 'application/json'
    }
  })
  .then((promise) => promise)
  .then((result) => {
    // 반환된 결과가 true이면 실행
    if (result) {
      status.innerText = `LED가 꺼졌습니다`;
    }
  });
}

// 초기 실행 함수
function init() {
  // 버튼 이벤드
  ledOnBtn.addEventListener('click', onLed);
  ledOffBtn.addEventListener('click', offLed);
}

// 함수 실행
init();