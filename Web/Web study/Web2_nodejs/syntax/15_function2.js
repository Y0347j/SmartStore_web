console.log(Math.round(1.6)); // 2
console.log(Math.round(1.4)); // 1

// 함수의 입력
function sum(first,second){ // parameter
  console.log(first + second);
}

sum(2,4); // argument

// 함수의 출력
function sum2(first,second){
  console.log('a');
  return first+second; // 여기서 종료 됨
  console.log('b');
}

console.log(sum2(2,4));
