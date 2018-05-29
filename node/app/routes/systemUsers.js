var express = require('express');
var router = express.Router();
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var common = require('../util/common.js');


/**
* システムユーザー 一覧
*/
router.get('/', function(req, res) {
  var firebase = req.app.get('firebase');
  var database = req.app.get('database');
  var hostname = req.headers.host;

  //******** Firebase Realtime DBのデータを取得
  //**** 1回だけの読み取り
  // var userId = firebase.auth().currentUser.uid;
  // var userId = "6BLRrWLBNEZfqaGYC1YKxPGIgtI3";
  return firebase.database().ref('/systemUsers').once('value').then(function(snapshot) {
    var systemUsers = snapshot.val();
    console.log(systemUsers);

    res.render('systemUsers/list', { title: 'システムユーザー 一覧', hostname: hostname, systemUsers: systemUsers });
  });

  // res.render('users/list', { title: 'ユーザー 一覧', hostname: hostname, username: username });

});


/**
* システムユーザー 登録画面
*/
router.get('/edit', function (req, res, next) {
  var hostname = req.headers.host;

  var cipheredPass = common.getDeciphered("f579ef104d02a2099c355ef36985b89e");
  console.log("de:" + cipheredPass);

  res.render('systemUsers/edit', { title: 'システムユーザー 登録', hostname: hostname, id: null, systemUser: null });
  //next();
});

/**
* システムユーザー 登録処理
*/
router.post(
  '/edit',
  body('name', '名前を入力して下さい').isLength({ min: 1 }),
  body('mail', 'Emailの形式で入力して下さい').isEmail(),
  body('password', 'パスワードを入力して下さい').isLength({ min: 1 }),
  body('password').custom((value, { req }) => {
    if (value !== req.body.passwordCnf) {
      throw new Error('パスワードが確認用と一致しません');
    }
    return true;
  }),
  (req, res) => {
    const {
      name = '',
      email = '',
      password = '',
      passwordCnf = '',
  } = req.body;

  var firebase = req.app.get('firebase');
  var database = req.app.get('database');
  var hostname = req.headers.host;

  const errors = validationResult(req);

  console.log(errors.isEmpty())

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(i => i.msg);

    //@ToDo エラーメッセージは取れれいるので画面に表示。
    return res.send(`
      <p>Villur:</p>
      <ul>
      <li>${errorMessages.join('</li><li>')}</li>
      `
    );
  }

  console.log(req.body.mail)
  console.log(req.body.name)
  console.log(req.body.password)
  console.log(req.body.passwordCnf)

  var systemUserID = "";
  if (req.body.id) {
    // 更新
    systemUserID = req.body.id;
  } else {
    // 新規登録
    systemUserID = firebase.database().ref().child('systemUsers').push().key;
  }

  firebase.database().ref('systemUsers')
    .orderByChild("mail")   // ソートキー
    .equalTo(req.body.mail) // 切り取る範囲
    .once('value').then(function(snapshot) {
      console.log("snapshot.val():" + snapshot.val());
      if (snapshot.val() != null) {
        //メールアドレスが登録されている。
          console.log("メールアドレスが重複しています。")
          res.render('systemUsers/edit', { title: 'システムユーザー 登録', hostname: hostname, id: null, systemUser: null });
      } else {
        // 登録処理

        // Password AES192で暗号化
        var cipheredPass = common.getCiphered(req.body.password);
        console.log("pass:" + cipheredPass);

        firebase.database().ref('systemUsers/' + systemUserID).set({
          name: req.body.name,
          mail: req.body.mail,
          password: cipheredPass
        });
    }

    //エラーがなければ一覧に遷移
    res.redirect('/systemUsers');
    // res.render('systemUsers/list', { title: 'システムユーザー 一覧', hostname: hostname, id: null, systemUser: null });
  });

  //res.send('ポスト');
   // return res.send(`<p>Skráning móttekin</p>
   //   <a href = '/'>Forsíða</a>`
   // );
});

/**
* システムユーザー 修正画面
* @param {int} id ユーザーID
*/
router.get('/edit/:id', function (req, res, next) {

  res.render('systemUsers/edit', { title: 'システムユーザー 修正', id: req.params.id });
  // res.render('users/detail', { title: 'ユーザー 一覧', id: req.params.id });
  next();
});

router.get('/logout', function(req, res) {
  delete req.session.user;
  res.redirect('/');
});


module.exports = router;


// server.listen(9005);
