var http = require('http');
var url = require('url');
var employee = require('./lib/employee');
var customer = require('./lib/customer');
var inventory = require('./lib/inventory');
var topic = require('./lib/topic');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        topic.home(request,response);
      }else{
        console.log('not thing');
      }
    }else if(pathname === '/employee'){
       employee.home(request,response);
    } else if(pathname === '/employee/create'){
      employee.create(request,response);
    } else if(pathname === '/employee/create_process'){
       employee.create_process(request,response);
    } else if(pathname === '/employee/update'){
       employee.update(request,response);
    } else if(pathname === '/employee/update_process'){
       employee.update_process(request,response);
    } else if(pathname === '/employee/delete_process'){
       employee.delete_process(request,response);
    } else if(pathname === '/employee/checkin'){
      employee.checkin(request,response);
    } else if(pathname === '/employee/checkin/update'){
      employee.checkin_update(request,response);
    }else if(pathname === '/employee/checkin/update_process'){
      employee.checkin_update_process(request,response);
    } else if(pathname === '/employee/checkout'){
      employee.checkout(request, response);
    } else if(pathname === '/employee/checkout/update'){
      employee.checkout_update(request, response);
    } else if(pathname === '/employee/checkout/update_process'){
      employee.checkout_update_process(request, response);
    } else if(pathname === '/customer'){
       customer.home(request,response);
    } else if(pathname === '/customer/payment'){
       customer.payment(request,response);
    } else if(pathname === '/customer/refund_process'){
        customer.refund_process(request,response);
    } else if(pathname === '/inventory'){
        inventory.home(request,response);
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
