// 시간의 흐름이 따라 진행되는 코드
console.log('A');
console.log('B');

var i = 0;
//while(true){ // 무한루프는 심각한 버그임
while(i < 1){
  console.log('C1');
  console.log('C2');
  i=i+1;
}
console.log('D');
