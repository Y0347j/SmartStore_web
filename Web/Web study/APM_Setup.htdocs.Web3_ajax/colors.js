var Links ={
  setColor:function(color){
    // var links = document.querySelectorAll('a');
    // var i =0;
    // while(i<links.length){
    //   links[i].style.color = color;
    //   i=i+1;
    // }
    // 이 웹페이지 모든 a 태그를 jquery로 제어하겠다는 의미
    $('a').css('color',color);
  }
}

var Body ={
  setColor:function(color){
    // document.querySelector('body').style.color=color;
    $('body').css('color',color);
  },
  setBackgroundColor:function(color){
    // document.querySelector('body').style.background=color;
    $('body').css('background',color);
  }
}

function nightDayHandler(self){
  if(self.value=='night'){
    Body.setBackgroundColor('black');
    Body.setColor('white');
    self.value='day';
    Links.setColor('powderblue');
  }else{
    Body.setBackgroundColor('white');
    Body.setColor('black');
    self.value='night';
    Links.setColor('blue');
  }
}
