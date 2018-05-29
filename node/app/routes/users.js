var express = require('express');
var router = express.Router();

// router.get('/', sessionCheck);
//
// // loginしてる場合はindex pageへ、してない場合はlogin pageへ
// function sessionCheck(req, res, next) {
//     if (req.session.user) {
//         //res.render('users', { title: req.session.user.name});
//         next()
//     } else {
//         res.redirect('/');
//     }
// };

/**
* ユーザー一覧
*/
router.get('/', function(req, res) {
  var hostname = req.headers.host;

  var firebase = req.app.get('firebase');
  var database = req.app.get('database');

  //******** Firebase Realtime DBのデータを取得
  //**** 1回だけの読み取り
  // var userId = firebase.auth().currentUser.uid;
  // var userId = "6BLRrWLBNEZfqaGYC1YKxPGIgtI3";
  // return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  //   var username = (snapshot.val() && snapshot.val().profiles.name) || 'Anonymous';
  //   console.log(username);
  //   console.log(snapshot.val().profiles.birthday);
  //
  //   res.render('users/list', { title: 'ユーザー 一覧', hostname: hostname });
  // });

  //**** observe
  var username = "";
  var userId = "6BLRrWLBNEZfqaGYC1YKxPGIgtI3";
  firebase.database().ref('/users/' + userId).on('value',function(snapshot) {
      username = (snapshot.val() && snapshot.val().profiles.name) || 'Anonymous';
      console.log(username);
      console.log(snapshot.val().profiles.birthday);

      //******** WebSocket でクライアント側を実行
      req.app.io.emit('chat message', username);
  });

  res.render('users/list', { title: 'ユーザー 一覧', hostname: hostname, username: username });

});



/**
* ユーザー 詳細
* @param {int} id ユーザーID
*/
router.get('/:id', function (req, res, next) {
    res.render('users/detail', { title: 'ユーザー 一覧', id: req.params.id });
    //res.send('ID:' + req.params.id);
    next();
});

module.exports = router;


// server.listen(9005);
