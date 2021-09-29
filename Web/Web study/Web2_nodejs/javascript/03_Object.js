// 1억 줄짜리 프로젝트 + 20년 동안 진행 + 참여 프로젝트가 2000명 정도인 경우

// 문제1
// var v1 = 'v1';
// // 100000 code
// v1 = 'egoing'; // 다른 사람이 끼워 넣은 경우 v1 변수의 값이 변경이 되어 버림  => 버그로 이어짐
//
// var v2 = 'v2';

// 문제2
// function f1(){
//   console.log(o.v1);
// }
//
// // 함수의 처리 방법이 변경됨 -> 버그 됨
// function f1(){
//     console.log('egoing');
// }
//
// function f2(){
//   console.log(o.v2);
// }

// 위의 문제들을 해결할 수 있는 방법 -> 객체
var o ={
  v1:'v1',
  v2:'v2',
  f1: function(){
    console.log(this.v1); // 함수를 객체 안에서 사용할때 자신 내에 있는 객체를 사용하기 위해 참조할 수 있는 특수한 약속을 정의함 => this
  },
  f2: function(){
    console.log(this.v2);
  }
} // 서로 연관된 값들과 그 값들을 처리하는 함수들을 하나의 객체 안에 정리 정돈해서 넣어 둘 수 있게 됨


o.f1();
o.f2();
