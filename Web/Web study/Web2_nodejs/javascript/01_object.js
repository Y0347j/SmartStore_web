// object vs Array
// object : 정보를 정리 정돈하는 수납상자, 순서가 없는 정보를 저장하 수납장, 식별자를 줄 수 있음, 코드의 복잡성을 낮춤

// 실행시키는 방법1(atom) : alt + R
// 실행시키는 방법2(cmd) : node 01_Object.js

// 배열 - 대괄호
var members = ['egoing','k8805','hoya'];
console.log(members[1]); // k8805

var i = 0;
while(i<members.length){
  console.log('array loop',members[i]);
  i = i + 1;
}

// 객체 - 중괄호
var roles = {
  'programmer':'egoing',
  'designer' : 'k8805',
  'manager' : 'hoya'
}

console.log(roles.designer); // k8805
console.log(roles['designer']); // k8805

for(var n in roles){
  console.log('object =>',n, 'value =>', roles[n]);
}
