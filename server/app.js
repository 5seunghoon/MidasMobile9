const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlinjection = require('sql-injection');

const ipAddress = '127.0.0.1';
const port = 52273;

var app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  key: 'sessionKEY', // 세션키
  secret: '!@#midasMobile9', //쿠키에 저장할 connect.sid값을 암호화할 키값
  resave: false,   //세션 아이디를 접속할 때마다 새롭게 발급하지 않음
  saveUninitialized: true,   //세션 아이디를 실제 사용하기 전에는 발급하지 않음
  cookie: {
    maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
  }
}));
//app.use(sqlinjection);

var server = require('http').createServer(app);
var router = require('./router/main')(app, server);

server.listen(port, ipAddress, function () {
  console.log(`Server is Running at http:${ipAddress}:${port}`);
});
