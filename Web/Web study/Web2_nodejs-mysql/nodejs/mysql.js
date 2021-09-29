var mysql      = require('mysql'); // mysql 모듈을 사용하겠다는 의미
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'apmsetup',
  database : 'opentutorials'
});
// host - DataBase 서버가 어떤 컴퓨터에 있는지 나타내는 것
// nodejs 서버와 mysql 서버가 같은 컴퓨터에 있다면 mysql 서버에서는 같은 컴퓨터에 있다는 뜻에서 localhost를 씀
// user - root이용
// database - database 이름


connection.connect(); // 실제 접속이 일어남

// 접속이 끝난 후
connection.query('SELECT * FROM topic', function (error, results, fields) {
  //result => 접속 결과가 전달됨
  if (error) console.log(error); // 에러가 있는 경우
  console.log(results);
}); // 첫 번째 인자를 sql문으로 주고, 두 번째 인자로 콜백을 주면 첫 번째 인자가 데이터베이스 서버에 전송돼서 실행이 끝난 다음에 응답을 하게 됨. 그럼 여기 있는 두 번째 인자의 콜백이 호출 됨

connection.end();
