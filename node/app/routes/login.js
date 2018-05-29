// var express = require('express');
// var router = express.Router();
//
// /**
// * ログイン画面
// */
// router.get('/', function(req, res, next) {
//   res.render('login', { title: 'ログイン ページ' });
// });
//
// module.exports = router;


const express = require('express');
const router = express.Router();

/**
* ログイン画面
*/
router.get('/', function(req, res, next) {
  var hostname = req.headers.host;

  res.render('login', { title: 'ログイン', hostname: hostname });
});

router.post('/', function(req, res, next) {
    if (req.body.mail) {
        req.session.user = { mail: req.body.mail };
        res.redirect('../users');
    } else {
        const err = 'data is wrong';
        res.render('login', { error: err });
    }
});

module.exports = router;
