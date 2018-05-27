var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  console.log('testtest');

  // responseText += '<small>Requested at: ' + req.requestTime + '</small>'
  console.log('requestTime');
  console.log(req.requestTime);

  res.send('これはテスト');
});


module.exports = router;
