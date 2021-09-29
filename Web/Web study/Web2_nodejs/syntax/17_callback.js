// function a(){
//   console.log('A');
// }
// a();

// callback의 형식
// javascript에서는 함수는 값임
var a = function(){
  console.log('A');
} // 익명함수


function slowFunc(callback){
  callback();
}

slowFunc(a);
