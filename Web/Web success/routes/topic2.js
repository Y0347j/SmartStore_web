var express = require('express')
var router = express.Router()
var template = require('../lib/template.js');

router.get('/',function(request, response){
  var list = template.list(request.topics);
  var html = template.HTML(list,
      `<img class="map" src="/images/map.png">`
  );
  response.send(html);
});

module.exports = router;
