var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyBTJ2OLkTaG1nLYlE2CpNOHsHE_Sq7Y_0A",
  authDomain: "drchat-e7a2b.firebaseapp.com",
  databaseURL: "https://drchat-e7a2b.firebaseio.com/",
  storageBucket: "gs://drchat-e7a2b.appspot.com",
};
firebase.initializeApp(config);
var database = firebase.database();

//******** Socket.io

/**
* ユーザー一覧
*/
router.get('/', function(req, res, next) {
  var hostname = req.headers.host;
  console.log("testest");
  console.log(hostname);

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
  // var userId = "6BLRrWLBNEZfqaGYC1YKxPGIgtI3";
  // return firebase.database().ref('/users/' + userId).on('value',function(snapshot) {
  //     var username = (snapshot.val() && snapshot.val().profiles.name) || 'Anonymous';
  //     console.log(username);
  //     console.log(snapshot.val().profiles.birthday);
  //
  //     res.render('users/list', { title: 'ユーザー 一覧', hostname: hostname });
  // });

  //******** WebSocket
  var io = module.parent.exports.set('io');



  //******** Firebase
  var username = "";
  var userId = "6BLRrWLBNEZfqaGYC1YKxPGIgtI3";
  firebase.database().ref('/users/' + userId).on('value',function(snapshot) {
      username = (snapshot.val() && snapshot.val().profiles.name) || 'Anonymous';
      console.log(username);
      console.log(snapshot.val().profiles.birthday);
      console.log(io);
      console.log(io.sockets);

      //クライアントへのデータ送信
      io.sockets.emit('server_to_client', {value : username});
  });

  res.render('users/list', { title: 'ユーザー 一覧', hostname: hostname, username: username });


  // var userId = "6BLRrWLBNEZfqaGYC1YKxPGIgtI3";
  // var starCountRef = firebase.database().ref('/users/' + userId);
  // starCountRef.on('value', function(snapshot) {
  //   updateStarCount(postElement, snapshot.val());
  // });

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
