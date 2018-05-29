var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var login = require('./util/login.js');

var app = express();

var session = require('express-session');

//******** セッションの設定を行います.
app.use(session({

    // 必須項目（署名を行うために使います）
    secret : 'my-special-secret',

    // 推奨項目（セッション内容に変更がない場合にも保存する場合にはtrue）
    resave : false,

    // 推奨項目（新規にセッションを生成して何も代入されていなくても値を入れる場合にはtrue）
    saveUninitialized : true,

    // アクセスの度に、有効期限を伸ばす場合にはtrue
    rolling : true,

    // クッキー名（デフォルトでは「connect.sid」）
    name : 'my-special-site-cookie',

    // 一般的なCookie指定
    // デフォルトは「{ path: '/', httpOnly: true, secure: false, maxAge: null }」
    cookie            : {
        // 生存期間（単位：ミリ秒）
        maxAge : 1000 * 60 * 60 * 24 * 30, // 30日
    }
}));

//login.check()
app.use(login.check)
//
// app.get('/', (req, res) => {
//
//     // セッションから値を読み込みます.
//     // ここではJavaScriptのオブジェクトをセッションに入れています.
//     let user = req.session.user || { prevAccess : null, pv : 1 };
//
//     // 前回のアクセス日時
//     let prevAccess = user.prevAccess;
//
//     // ユーザーごとのPageView
//     let pv = user.pv;
//
//     // 今回アクセス分を更新して、セッションに保存します.
//     user.pv += 1;
//     user.prevAccess = new Date();
//     req.session.user = user;
//
//     // レスポンス返却
//     res.send(`Hello from express4! pv=${pv}, prevAccess=${prevAccess}`);
// });

//******** routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var systemUsersRouter = require('./routes/systemUsers');

app.use(express.static(__dirname + '/node_modules'));




//******** init
//**** view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//**** ライブラリ読み込み
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




//******** ルーティング設定

//**** routesフォルダ内のjsを使う場合
// app.use('/', indexRouter);
app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/systemUsers', systemUsersRouter);


//**** URLからid取る場合
app.get('/user/:id', function (req, res, next) {
  console.log('ID:', req.params.id)
  next()
}, function (req, res, next) {
  res.send('User Info')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




//******** Socket.
// //チャットと同じ
// app.get('/chat', function(req, res){
//   res.sendFile(__dirname + '/chat.html');
// });
//
// //var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// //app.set('io', io);
//
// io.on('connection', function(socket){
//   console.log('connected!');
//   // //clientから受ける
//   // socket.on('chat message', function(msg){
//   //   //clientのfunctionをキック
//   //   io.emit('chat message', msg);
//   // });
// });


//自力でとりあえずsocket.io.js をロード出来るようにした。
console.log("app.js");
var socket_io = require("socket.io");
var io = socket_io();
app.io = io;
//app.set('io', io);

io.on( "connection", function(socket)
{
    console.log( "A user connected" );
    // app.set('io', io);
    // app.set('socket', socket);

    // app.set('test_val', 'これはテスト');

    // //clientから受ける
    // socket.on('chat message', function(msg){
    //   console.log( "chat message on" );
    //
    //   //clientのfunctionをキック
    //   socket.emit('chat message', msg);
    // });

});

io = socket_io.listen(app.listen(8080));
var server = require('http').createServer(app);

app.set('socketio', io);


//******** firebase
var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyBTJ2OLkTaG1nLYlE2CpNOHsHE_Sq7Y_0A",
  authDomain: "drchat-e7a2b.firebaseapp.com",
  databaseURL: "https://drchat-e7a2b.firebaseio.com/",
  storageBucket: "gs://drchat-e7a2b.appspot.com",
};
firebase.initializeApp(config);
var database = firebase.database();

app.set('firebase', firebase);
app.set('database', database);


// //******** middleware functionの設定
// //middleware function としてmyLoggerを定義
// var myLogger = function (req, res, next) {
//   console.log('LOGGED')
//   next()  //これがないと処理が続行されない。
// }
// app.use(myLogger)
//
// //middleware function としてrequestTimeを定義
// var requestTime = function (req, res, next) {
//   req.requestTime = Date.now()
//   next()
// }
// app.use(requestTime)
//
// //******** configured middlewere
// var mw = require('./config/my-middleware.js')
// app.use(mw({ option1: '1', option2: '2' }))
//
//
//******** root URI を定義
var setRootUri = function (req, res, next) {
  var hostname = req.headers.host;
  console.log("setRootUri");
  console.log(hostname);
  app.set('hostname', hostname);
  next()
}
app.use(setRootUri)


module.exports = app;
