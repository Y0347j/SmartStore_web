var number = [1,400,12,34];
var i = 0;
var total = 0;
while(i < number.length){
  console.log(number[i]); // 값을 하나 하나 꺼낼 수 있음
  total = total + number[i];
  i = i+1;
}
console.log(`total : ${total}`);
