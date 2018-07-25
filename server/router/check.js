const datetime = require('node-datetime');
var mLog = require("./log");
module.exports = {
    email: function (request, response) {
        var email = request.params.email;
        var sql = "SELECT * FROM user_info WHERE email=?";
        var params = [email];
        connection.query(sql, params, function (error, results, fields) {
            var json = { result: false, message: error };
            if (error) {
                json["message"] = "잘못된 접근 방식입니다.";
                mLog.addlog(null, "check email err", 0);
                response.json(json);
            } else {
                if (results.length == 0) {
                    json = { result: true, message: "사용하셔도 좋습니다."};
                    mLog.addlog(null, "check email success email="+email , 1);
                    response.json(json);
                } else {
                    json = { result: false, message: "이미 등록된 메일입니다."};
                    mLog.addlog(null, "check try email aleady exist email="+email , 0);
                    response.json(json);
                }
            } 
        });
    },
    nickname: function (request, response){
        var nickname = request.params.nickname;
        var sql = "SELECT * FROM user_info WHERE nickname=?";
        var params = [nickname];
        connection.query(sql, params, function (error, results, fields) {
            var json = { result: false, message: error };
            if (error) {
                json["message"] = "잘못된 접근 방식입니다.";
                mLog.addlog(null, "check nickname err", 0);
                response.json(json);
            } else {
                if (results.length == 0) {
                    json = { result: true, message: "사용하셔도 좋습니다."};
                    mLog.addlog(null, "check nickname success nickname="+nickname , 1);
                    response.json(json);
                } else {
                    json = { result: false, message: "이미 등록된 닉네임입니다."};
                    mLog.addlog(null, "check try nickname aleady exist nickname="+nickname , 0);
                    response.json(json);
                }
            } 
        });
    },
    rootcode: function (request, response){
        var rootcode = request.params.rootcode;
        if(rootcode=="midas"){
            var json = { result: true, message: "인증완료"};
            mLog.addlog(null, "check rootcode success" , 1);
            response.json(json);
        }else{
            var json = { result: false, message: "잘못된 접근 방식입니다."};
            mLog.addlog(null, "check try false rootcode="+rootcode , 0);
            response.json(json);
        }
    }
}