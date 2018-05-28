var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

//******** Socket.io
console.log("app.js");
var socket_io = require("socket.io");
var io = socket_io();
app.io = io;
io.on( "connection", function(socket)
{
    console.log( "A user connected" );
    app.set('io', io);
});

io = socket_io.listen(app.listen(8080));

var server = require('http').createServer(app);


//******** routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');


//var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
//
// app.get('/', function(req, res){
//   res.sendfile('index.html');
// });
//
// io.on('connection', function(socket){
//   console.log('a user connected');
// });
//
// http.listen(8080, function(){
//   console.log('listening on *:8080');
// });


// var http = require('http').Server(app);
//
// // app.get('/', function(req, res){
// //   res.send('<h1>Hello world</h1>');
// // });
// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });
//
// http.listen(8080, function(){
//   console.log('listening on *:8080');
// });



// var server = require('http').createServer(app);
// //var io = require('socket.io')(server);
// var io = require('socket.io').listen(server);
// // io.on('connection', function(socket){
// // console.log('a user connected');
// // });
//
// server.listen(4200);

// var app = express();
// var http = require('http').createServer(app);
//
// var io = require('socket.io');
// io.listen(http);
//
// http.listen(8080);



// var http = require('http').createServer(app);
// var io = require('socket.io');
//
// io.listen(http);
// http.listen(8080);


// var http = require('http');
// // var socket = require('socket.io')
// var io = require('socket.io');
//
// var server = require('http').createServer(app).listen(8080)
// io.listen(http); server.listen(8080);


// //**** これで治ったらしいが。
// //まだlistenしない
// var server = require('http').createServer(app);
//
// var io = require('socket.io').listen(server);
// io.sockets.on('connection', function(socket) {
//   //do something
//
// });
//
// //socket.ioの準備をしてからlistenする
// server.listen(app.get('port'), function(){
//   console.log("Express server listening on port " + app.get('port'));
// });



// var server = http.createServer(app).listen(app.get('port'), function(){
//   console.log("Express server listening on port " + app.get('port'));
// });
//
// var io = socket.listen(server);
// io.sockets.on('connection', function () {
//   console.log('hello world im a hot socket');
// });


// var server = require('http').createServer(app);
// var io = require('socket.io').listen(server);
//
// io.on('connection',function(socket){
//     console.log("connected");
//     socket.emit('open');
// });


// server.listen(app.get('port'),function(){
//     console.log('this server is listening on port:'+app.get('port'));
// });

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

//**** URLからid取る場合
app.get('/user/:id', function (req, res, next) {
  console.log('ID:', req.params.id)
  next()
}, function (req, res, next) {
  res.send('User Info')
})


//******** middleware functionの設定
//middleware function としてmyLoggerを定義
var myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()  //これがないと処理が続行されない。
}
app.use(myLogger)

//middleware function としてrequestTimeを定義
var requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}
app.use(requestTime)

//******** configured middlewere
var mw = require('./config/my-middleware.js')
app.use(mw({ option1: '1', option2: '2' }))



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

module.exports = app;


//server.listen(9005);
