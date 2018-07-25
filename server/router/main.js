const fs = require('fs');
const url = require('url');
const mysql = require('mysql');
const multer = require('multer');
const datetime = require('node-datetime');
require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss.l');

var profileStorage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, 'public/uploads/profileimg') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (request, file, callback) {
    var fileori = file.originalname.split('.');
    var png = fileori[fileori.length - 1];
    var dt = datetime.create();
    dt.getTime();
    callback(null, dt.getTime() + '.' + png) // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
})
var menuStorage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, 'public/uploads/menuimg') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (request, file, callback) {
    var fileori = file.originalname.split('.');
    var png = fileori[fileori.length - 1];
    var dt = datetime.create();
    dt.getTime();
    callback(null, dt.getTime() + '.' + png) // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
})
var upload = multer({ dest: 'uploads/' });
var profileUpload = multer({ storage: profileStorage });
var menuimgUpload = multer({ storage: menuStorage });

const hostname = '127.0.0.1';
var db_config = {
  host: hostname,
  user: 'root',
  password: '123654',
  database: 'midas'
};

global.connection;
function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.
  connection.connect(function (err) {              // The server is either down
    if (err) {                                     // or restarting (takes a while sometimes).
      console.log('error When connecting to MariaDB : ', err);
      setTimeout(handleDisconnect, 2000);          // We introduce a delay before attempting to reconnect,
    } else {                                         // to avoid a hot loop, and to allow our node script to
      console.log("MariaDB is Connected.");
    }
  });                                     // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {
    console.log('MariaDB Connection error : ', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      setTimeout(handleDisconnect, 2000);         // server variable configures this)
    }
  });
}
handleDisconnect();


//var url_request = require("./url_request");
var check = require("./check");
var join = require("./join");
var login = require("./login");
var user = require("./user");
var menu = require("./menu");
var order = require("./order");
var sess;

var OneHour = 1000 * 60 * 60;
var OneDay = OneHour * 24;


// setInterval(function () {
//   //현재 시간.
//   var dt = datetime.create();
//   var date = dt.format('Y/m/d H:M:S');
//   var year = dt.format('Y');
//   var month = dt.format('m');
//
//   //1년 전 시간.
//   var past = datetime.create(year+"/"+month+"/"+"01 00:00:00");
//   past.offsetInDays(-365);
//   var pDate = past.format('Y/m/d H:M:S');
//   var pYear = past.format('Y');
//   var pMonth = past.format('m');
//
//
//   console.log(nDate);
// }, OneHour);

module.exports = function (app, server) {
  app.get('/', function (request, response) {
    response.end("hello world");
  })
  app.post('/join', profileUpload.single('file'), function (request, response) {
    join.do(request, response);
  })
  app.post('/login', function (request, response) {
    login.do(request, response);
  })
  app.post('/addtoken', function(request, response){
    user.addtoken(request,response);
  })
  app.post('/logout', function (request, response) {
    if (request.session.auth) {
      request.session.destroy();
      response.clearCookie('sessionKEY');
    }
    var json = { result: true, message: "성공" };
    response.json(json);
  })
  app.post('/delete/user', function (request, response) {
    user.delete(request, response);
  })
  app.post('/update/user', profileUpload.single('file'), function (request, response) {
    user.update(request, response);
  })
  app.get('/check/email/:email', function (request, response) {
    check.email(request, response);
  })
  app.get('/check/nickname/:nickname', function (request, response) {
    check.nickname(request, response);
  })
  app.get('/check/rootcode/:rootcode', function(request, response){
    check.rootcode(request, response);
  })
  app.get('/userinfo/:no', function (request, response) {
    user.info(request, response);
  })
  app.get('/userinfo', function (request, response) {
    user.infoall(request, response);
  })
  app.get('/profileimg/:filename', function (request, response) {
    fs.readFile('public/uploads/profileimg/' + request.params.filename, function (error, img) {
      if (error) {
        response.status(404).send("Not Found Image.");
      } else {
        response.end(img);
      }
    });
  })
  app.get('/menuimg/:filename', function (request, response) {
    fs.readFile('public/uploads/menuimg/' + request.params.filename, function (error, img) {
      if (error) {
        response.status(404).send("Not Found Image.");
      } else {
        response.end(img);
      }
    });
  })
  app.post('/menu/insert',menuimgUpload.single('file'), function (request, response) {
    menu.insert(request, response);
  });
  app.post('/menu/update',menuimgUpload.single('file'), function (request, response) {
    menu.update(request, response);
  });
  app.post('/menu/delete', function (request, response) {
    menu.delete(request, response);
  });
  app.get('/menu/:no', function (request, response) {
    menu.select(request, response);
  });
  app.get('/menu', function (request, response) {
    menu.select(request, response);
  });


  app.post('/order/update', function(request, response){
    order.update(request, response);
  })
  app.get('/order/done', function (request, response) {
    order.selectDone(request, response);
  });
  app.get('/order/:yearmonth', function (request, response) {
    order.selectMonth(request, response);
  });
  app.post('/order', function(request, response){
    order.insert(request, response);
  })
  app.get('/order', function(request, response){
    order.select(request, response);
  })
 

  app.get('/license', function (request, response) {
    fs.readFile('license.txt', function (error, text) {
      if (error) {
        response.status(404).send("Not Found license.");
      } else {
        response.end(text);
      }
    });
  })
  app.all('*', function (req, res) {
    var json = { result: false, message: "잘못된 url 주소" };
    res.status(404).json(json);
  })
}
