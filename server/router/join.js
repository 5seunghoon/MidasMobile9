const datetime = require('node-datetime');
const async = require("async");
var mLog = require("./log");
module.exports = {
    do: function (request, response) {
        var email = request.body.email;
        var password = request.body.password;
        var nickname = request.body.nickname;
        var filename = 'baseprofile.png';
        if (request.file)
            filename = request.file.filename;
        var phone = request.body.phone;
        var part = request.body.part;
        var root = request.body.root;
        if (request.session.root)
            root = 0;
        var token = request.body.token;
        async.waterfall([
            function (callback) {
                var sql = "SELECT * FROM user_info WHERE email=?";
                var params = [email];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(null, "join try email err", 0);
                        return callback(1, json);
                    } else {
                        if (results.length == 0) {
                            callback(null);
                        } else {
                            mLog.addlog(null, "join try email aleady exist email="+email, 0);
                            json["message"] = "이미 등록된 메일입니다.";
                            return callback(1, json);
                        }
                    }
                });
            },

            function (callback) {
                var sql = "SELECT * FROM user_info WHERE nickname=?";
                var params = [nickname];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(null, "join try nickname err", 0);
                        return callback(1, json);
                    } else {
                        if (results.length == 0) {
                            callback(null);
                        } else {
                            json["message"] = "이미 등록된 닉네임입니다.";
                            mLog.addlog(null, "join try nickname aleady exist nickname="+nickname, 0);
                            return callback(1, json);
                        }
                    }
                });
            },

            function (callback) {
                var sql = "INSERT INTO user_info values(null, ?, ?, ?, ?, ?, ?, ?, ?)";
                var params = [email, password, nickname, filename, phone, part, root, token];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(null, "join try insert err", 0);
                        response.json(json);
                    } else {
                        json = { result: true, message: "가입이 완료되었습니다.", data: {} };
                        mLog.addlog(results.insertId, "join success", 1);
                        json['data'] = {
                            no: results.insertId,
                            email: email,
                            nickname: nickname
                        };
                        response.json(json);
                    }
                });
            }
        ], function (error, result) {
            response.json(result);
        });
    }
}