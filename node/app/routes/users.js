var express = require('express');
var router = express.Router();

/**
* ユーザー一覧
*/
router.get('/', function(req, res) {
  var hostname = req.headers.host;

  var firebase = req.app.get('firebase');
  var database = req.app.get('database');

  //******** Firebase Realtime DBのデータを取得
  //**** 1回だけの読み取り
  return firebase.database().ref('/users')
    .once('value').then(function(snapshot) {
      var users = snapshot.val();

      res.render('users/list', { title: 'ユーザー 一覧', hostname: hostname, users:users });
    });

  // //**** observe
  // var username = "";
  // var userId = "6BLRrWLBNEZfqaGYC1YKxPGIgtI3";
  // firebase.database().ref('/users/' + userId).on('value',function(snapshot) {
  //     username = (snapshot.val() && snapshot.val().profiles.name) || 'Anonymous';
  //     console.log(username);
  //     console.log(snapshot.val().profiles.birthday);
  //
  //     //******** WebSocket でクライアント側を実行
  //     req.app.io.emit('chat message', username);
  // });
  //
  // res.render('users/list', { title: 'ユーザー 一覧', hostname: hostname, username: username });

});



/**
* ユーザー 詳細
* @param {int} id ユーザーID
*/
router.get('/profile/:id', function (req, res, next) {
  var hostname = req.headers.host;
  var firebase = req.app.get('firebase');
  var database = req.app.get('database');

  return firebase.database().ref(`/users/${req.params.id}`)
    .once('value').then(function(snapshot) {
      var user = snapshot.val();
      console.log(user);
      res.render('users/profile', { title: 'ユーザー プロフィール', hostname: hostname, id: req.params.id, user: user });
    });

  //res.send('ID:' + req.params.id);
  //next();
});

module.exports = router;


// server.listen(9005);
