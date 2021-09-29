var sanitizeHtml = require('sanitize-html'); // 사용자가 입력할 수 있는 정보나 데이터베이스에서 가져오는 정보가 오염되는 것을 막아주는 역할을 한다
const dayNames = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];

module.exports = {
  HTML:function(list, body){
    return `
    <!doctype html>
    <html>
    <head>
    <title>SmartStore</title>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="/css/style.css">
    </head>
    <body>
    <div id="wapper">
        <header>
        <a href="/">
        <img src="/images/webtitle.png"></a>
        </header>
        <nav>
          ${list}
        </nav>
        <section>
            <article>
                ${body}
            </article>
        </section>
      </div>
      </body>
      </html>
    `;
  },
  list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/${sanitizeHtml(topics[i].title)}">${sanitizeHtml(topics[i].title)}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },
  employeeTable:function(employees){
    console.log(employees);
    console.log(employees[0].Iname);
    var tag = `<br><table>  <tr>
        <th>이름</th>
        <th>아이디</th>
        <th>비밀번호</th>
        <th>성별</th>
        <th>전화번호</th>
        <th>이메일</th>
        <th>주소</th>
        <th>계좌번호</th>
        <th>은행</th>
        <th>직급</th>
        <th>입사일</th>
        <th>출근시간</th>
        <th>퇴근시간</th>
        <th>출근</th>
        <th>퇴근</th>
        <th>수정</th>
        <th>삭제</th>
      <tr>`;
    var i=0;

    while(i<employees.length){
      tag +=
      `
      <tr>
        <td>${sanitizeHtml(employees[i].name)}</td>
        <td>${sanitizeHtml(employees[i].login_id)}</td>
        <td>${sanitizeHtml(employees[i].password)}</td>
        <td>${sanitizeHtml(employees[i].gender)}</td>
        <td>${sanitizeHtml(employees[i].phoneNumber)}</td>
        <td>${sanitizeHtml(employees[i].email)}</td>
        <td>${sanitizeHtml(employees[i].address)}</td>
        <td>${sanitizeHtml(employees[i].accountNumber)}</td>
        <td>${sanitizeHtml(employees[i].bank)}</td>
        <td>${sanitizeHtml(employees[i].position)}</td>
        <td>${sanitizeHtml(employees[i].date.getFullYear()+'.'+(employees[i].date.getMonth()+1)+'.'+employees[i].date.getDate())}</td>
        <td>${sanitizeHtml(employees[i].checkin)}</td>
        <td>${sanitizeHtml(employees[i].checkout)}</td>
        <td><button type="button" onclick="location.href='/employee/checkin/${employees[i].name}' ">출근</button></td>
        <td><button type="button" onclick="location.href='/employee/checkout/${employees[i].name}' ">퇴근</button></td>
        <td><button type="button" onclick="location.href='/employee/update/${employees[i].name}' ">수정</button></td>
        <td>
          <form action ="/employee/delete_process" method="post">
            <input type="hidden" name="name" value="${employees[i].name}">
            <input type="submit" value="삭제">
          </form>
        </td>
      </tr>
      `
      i++;
    }
    tag += `</table>`;
    return tag;
  },
  employeeCheckin:function(employeecheckin){
    var tag =`<br><br><table> <tr>
    <th>이름</th>
    <th>출근시간</th>
    <th>수정</th>
    <th>삭제</th>
    </tr>`
    var i =0;
    var year, month, date, hour, minute, second,day;
    while(i<employeecheckin.length){
      year = employeecheckin[i].Idate.getFullYear();
      month = employeecheckin[i].Idate.getMonth()+1;
      date = employeecheckin[i].Idate.getDate();
      hour = employeecheckin[i].Idate.getHours();
      minute = employeecheckin[i].Idate.getMinutes();
      second = employeecheckin[i].Idate.getSeconds();
      day = dayNames[employeecheckin[i].Idate.getDay()];
      ampm = hour >= 12 ? 'PM':'AM';
      // 12시간제로 변경
      // hour %= 12;
      // hour = hour || 12;

      //10미만인 분과 초를 2자리로 변경
      minute = minute < 10 ? '0'+ minute : minute;
      second = second < 10 ? '0'+ second : second;
      tag +=
      `
      <tr>
      <td>${sanitizeHtml(employeecheckin[i].Iname)}</td>
      <td>${sanitizeHtml(year+'.'+month+'.'+date+' '+hour+':'+minute+':'+second+ampm+' '+day)}</td>
      <td><button type="button" onclick="location.href='/employee/checkin/update/${employeecheckin[i].Iname}/${employeecheckin[i].id}'">수정</button></td>
      <td>
        <form action ="/employee/checkin/delete_process" method="post">
          <input type="hidden" name="name" value="${employeecheckin[i].Iname}">
          <input type="hidden" name="id" value="${employeecheckin[i].id}">
          <input type="submit" value="삭제">
        </form>
      </td>
      </tr>
      `
      i++;
    }
    tag += `</table>`;
    return tag;

  },
  employeeCheckout:function(employeecheckout){
    var tag =`<br><br><table> <tr>
    <th>이름</th>
    <th>퇴근시간</th>
    <th>수정</th>
    <th>삭제</th>
    </tr>`
    var i =0;
    while(i < employeecheckout.length){
      var year = employeecheckout[i].Odate.getFullYear();
      var month = employeecheckout[i].Odate.getMonth()+1;
      var date = employeecheckout[i].Odate.getDate();
      var hour = employeecheckout[i].Odate.getHours();
      var minute = employeecheckout[i].Odate.getMinutes();
      var second = employeecheckout[i].Odate.getSeconds();
      var day = dayNames[employeecheckout[i].Odate.getDay()];
      var ampm = hour >= 12 ? 'PM':'AM';
      // 12시간제로 변경
      // hour %= 12;
      // hour = hour || 12;

      //10미만인 분과 초를 2자리로 변경
      minute = minute < 10 ? '0'+ minute : minute;
      second = second < 10 ? '0'+ second : second;
      tag +=
      `
      <tr>
      <td>${sanitizeHtml(employeecheckout[i].Oname)}</td>
      <td>${sanitizeHtml(year+'.'+month+'.'+date+' '+hour+':'+minute+':'+second+ampm+' '+day)}</td>
      <td><button type="button" onclick="location.href='/employee/checkout/update/${employeecheckout[i].Oname}/${employeecheckout[i].id}' ">수정</button></td>
      <td>
        <form action ="/employee/checkout/delete_process" method="post">
        <input type="hidden" name="name" value="${employeecheckout[i].Oname}">
          <input type="hidden" name="id" value="${employeecheckout[i].id}">
          <input type="submit" value="삭제">
        </form>
      </td>
      </tr>
      `
      i++;
    }
    tag += `</table>`;
    return tag;

  },
  customerTable:function(customers){
    var tag = `<table>  <tr>
        <th>이름</th>
        <th>비밀번호</th>
        <th>전화번호</th>
        <th>이메일</th>
        <th>결제내역</th>
      <tr>`;
    var i=0;

    while(i<customers.length){
      tag +=
      `
      <tr>
        <td>${sanitizeHtml(customers[i].name)}</td>
        <td>${sanitizeHtml(customers[i].password)}</td>
        <td>${sanitizeHtml(customers[i].phoneNumber)}</td>
        <td>${sanitizeHtml(customers[i].email)}</td>
        <td><a href="/customer/payment/${customers[i].id}">결제내역</a></td>
      </tr>
      `
      i++;
    }
    tag += `</table>`;
    return tag;
  },
  customerSum:function(customerPayment){
      var name = sanitizeHtml(customerPayment[0].name);
      var i = 0
      var sumPrice = 0;
      while(i < customerPayment.length){
        sumPrice += customerPayment[i].allPrice;
        i++;
      }

      var tag = `<br><h2>${name} : ${sumPrice} 원</h2><br>`
      return tag;
  },
  customerPayment:function(customerPayment){
    var tag =`<table> <tr>
    <th>주문일시</th>
    <th>주문내역</th>
    <th>총결제금액</th>
    <th>환불</th>
    <th>환불여부</th>
    `
    var i=0;

    while(i <customerPayment.length){
        tag += `
          <tr>
            <td>${sanitizeHtml(customerPayment[i].paytime)}</td>
            <td>${sanitizeHtml(customerPayment[i].item)}</td>
            <td>${sanitizeHtml(customerPayment[i].allPrice)}</td>
            <td>
            <form action ="/customer/refund_process" method="post">
              <input type="hidden" name="cus_id" value="${customerPayment[i].customer_id}">
              <input type="hidden" name="id" value="${customerPayment[i].id}">
              <input type="submit" value="환불">
            </form>
            </td>
            <td>${sanitizeHtml(customerPayment[i].refund)}</td>
          </tr>
        `
        i++;
    }
    tag += `</table>`;
    return tag;
  },
  productTable:function(products){
    var tag =`<br><table>
    <tr>
    <th>이름</th>
    <th>가격</th>
    <th>RFID</th>
    <th>상점진열대</th>
    <th>창고진열대</th>
    <th>상품 수정</th>
    <th>상품 삭제</th>
    </tr>`
    var i = 0;
    while(i < products.length){
      tag +=
      `<tr>
      <td>${sanitizeHtml(products[i].name)}</td>
      <td>${sanitizeHtml(products[i].price)}</td>
      <td>${sanitizeHtml(products[i].rfid)}</td>
      <td>${sanitizeHtml(products[i].sDisplay)}</td>
      <td>${sanitizeHtml(products[i].wDisplay)}</td>
      <td> <button type="button" onclick="location.href='/product/update/${products[i].id}' ">수정</button></td>
      <td>
        <form action ="/product/delete_process" method="post">
          <input type="hidden" name="display" value="${products[i].sDisplay}">
          <input type="hidden" name="id" value="${products[i].id}">
          <input type="submit" value="삭제">
        </form>
      </td>
      </tr>
      `
      i++;
    }
    tag +=`</table>`
    return tag;
  }
}
