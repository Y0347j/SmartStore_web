// 상황에 따라서 08_program1.js와 09_program2.js가 수행되어야 할 때 제어문인 조건문을 사용해서 아래와 같이 표현하면 됨

var args = process.argv;
console.log(args);
console.log('A');
console.log('B');
if(args[2] == '1'){
console.log('C1');
}else{
console.log('C2');
}
console.log('D');
