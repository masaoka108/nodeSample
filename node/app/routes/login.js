var express = require('express');
var router = express.Router();

/**
* ログイン画面
*/
router.get('/', function(req, res, next) {
  res.render('login', { title: 'ログイン ページ' });
});

module.exports = router;
