var M ={
  v:'v',
  f:function(){
    console.log(this.v);
  }
}

// 약속임 -> M이 가리키는 객체를 module 밖에서 사용할 수 있도록 하겠다는 것
module.exports = M;
