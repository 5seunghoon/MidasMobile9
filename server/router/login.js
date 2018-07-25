const async = require("async");
const datetime = require('node-datetime');
const forEach = require('async-foreach').forEach;
var mLog = require("./log");

module.exports = {
    do: function (request, response) {
        var email = request.body.email;
        var password = request.body.password;
        var root = request.body.root;
        async.waterfall([
            function (callback) {
                var sql = "SELECT * FROM user_info WHERE email=?";
                var params = [email];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(null, "login email check err", 0);
                        return callback(1, json);
                    } else {
                        if (results.length == 0) {
                            json["message"] = "존재하지 않는 이메일입니다.";
                            mLog.addlog(null, "login email check not found email", 0);
                            return callback(1, json);
                        } else {
                            callback(null);
                        }
                    }
                });
            },

            function (callback) {
                var sql = "SELECT * FROM user_info WHERE email=? AND root=?";
                var params = [email, root];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(null, "login try root err", 0);
                        return callback(1, json);
                    } else {
                        if (results.length == 0) {
                            if (root == 1) {
                                json["message"] = "관리자 계정이 아닙니다.";
                                mLog.addlog(null, "login try root==1", 0);
                            } else {
                                json["message"] = "잘못된 접근 방식입니다.";
                                mLog.addlog(null, "login try root==0", 0);
                            }
                            return callback(1, json);
                        } else {
                            callback(null);
                        }
                    }
                });
            },

            function (callback) {
                var sql = "SELECT * FROM user_info WHERE email=? AND password=?";
                var params = [email, password];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(null, "login try false email and password", 0);
                        return callback(1, json);
                    } else {
                        if (results.length == 0) {
                            json["message"] = "비밀번호가 틀립니다. 다시 확인해 주세요.";
                            mLog.addlog(null, "login try false password", 0);
                            callback(1, json);
                        } else {
                            mLog.addlog(results[0].no, "login success", 1);
                            json = { result: true, message: "성공", data: {} };
                            json['data'] = {
                                no: results[0].no,
                                nickname: results[0].nickname,
                                profileimg: results[0].profileimg,
                                phone: results[0].phone,
                                part: results[0].part
                            };
                            request.session.no = results[0].no;
                            request.session.email = email;
                            request.session.auth = true;
                            if (results[0].root == 1)
                                request.session.root = true;

                            callback(null, json);
                        }
                    }
                });
            }

        ], function (error, result) {
            response.json(result);
        });

    }
}