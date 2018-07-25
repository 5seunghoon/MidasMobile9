const async = require("async");
const datetime = require('node-datetime');
const forEach = require('async-foreach').forEach;
var mLog = require("./log");
module.exports = {
    delete: function (request, response) {
        var json = { result: false, message: '잘못된 접근 방식입니다.' };
        if (!request.session.auth)
            return response.json(json);
        var email = request.body.email;
        var password = request.body.password;
        async.waterfall([
            function (callback) {
                if (request.session.root)
                    return callback(null);
                var sql = "SELECT * FROM user_info WHERE email=? AND password=?";
                var params = [email, password];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(request.session.no, "user try delete false email and password  err", 0);
                        return callback(1, json);
                    } else {
                        if (results.length == 0) {
                            json["message"] = "비밀번호가 틀립니다. 다시 확인해 주세요.";
                            mLog.addlog(request.session.no, "user try delete false password", 0);
                            return callback(1, json);
                        } else {
                            callback(null);
                        }
                    }
                });
            },
            function (callback) {
                var sql = "DELETE FROM user_info WHERE email=? AND password=?";
                var params = [email, password];
                var no;
                if (request.session.root) {
                    no = request.body.no;
                    sql = "DELETE FROM user_info WHERE no=?";
                    params = [no];
                }
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        console.log(error);

                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(request.session.no, "user try delete false email and password err", 0);
                    } else {
                        mLog.addlog(request.session.no, "user delete success no=" + no, 1);
                        request.session.destroy();
                        response.clearCookie('sessionKEY');
                        json = { result: true, message: "성공" };
                    }
                    return callback(1, json);
                });
            }
        ], function (error, result) {
            response.json(result);
        });
    },

    update: function (request, response) {
        var json = { result: false, message: '잘못된 접근 방식입니다.' };
        if (!request.session.auth) {
            return response.json(json);
        }


        var email = request.body.email;
        var password = request.body.password;
        var nickname = request.body.nickname;
        var phone = request.body.phone;
        var part = request.body.part;
        var newpassword = request.body.newpassword;


        if (request.session.root && request.body.no) {
            var no = request.body.no;
            var email = request.body.email;
            var Params = new Array();
            var sets = new Array();
            var set = "";
            if (request.body.email) {
                Params.push(email);
                sets.push("email=?");
            }
            if (request.body.nickname) {
                Params.push(nickname);
                sets.push("nickname=?");
            }
            if (request.body.phone) {
                Params.push(phone);
                sets.push("phone=?");
            }
            if (request.body.part) {
                Params.push(part);
                sets.push("part=?");
            }
            if (request.body.newpassword) {
                Params.push(newpassword);
                sets.push("password=?");
            }
            if (request.file) {
                Params.push(request.file.filename);
                sets.push("profileimg=?");
            }
            Params.push(no);

            forEach(Params, function (item, index, arr) {
                if (index != Params.length - 1) {
                    if (index == 0) {
                        set = sets[index];
                    } else {
                        set = set + "," + sets[index];
                    }
                }
            });

            async.waterfall([
                function (callback) {
                    var sql = "SELECT * FROM user_info WHERE no=?";
                    var params = [no];
                    connection.query(sql, params, function (error, results, fields) {
                        var json = { result: false, message: error };
                        if (error) {
                            json["message"] = "잘못된 접근 방식입니다.";
                            mLog.addlog(request.session.no, "user try update err no=" + no, 0);
                            return callback(1, json);
                        } else {
                            if (results.length == 0) {
                                mLog.addlog(request.session.no, "user try update none user no=" + no, 0);
                                json["message"] = "존재하지 않는 사용자입니다.";
                                return callback(1, json);
                            } else {
                                callback(null);
                            }
                        }
                    });
                },
                function (callback) {
                    var sql = "SELECT * FROM user_info WHERE email=? AND no!=?";
                    var params = [email, no];
                    connection.query(sql, params, function (error, results, fields) {
                        var json = { result: false, message: error };
                        if (error) {
                            json["message"] = "잘못된 접근 방식입니다.";
                            mLog.addlog(request.session.no, "user try update err email=" + email + " and no=" + no, 0);
                            return callback(1, json);
                        } else {
                            if (results.length == 0) {
                                callback(null);
                            } else {
                                json["message"] = "이미 등록된 메일입니다.";
                                mLog.addlog(request.session.no, "user try update already email=" + email, 0);
                                return callback(1, json);
                            }
                        }
                    });
                },
                function (callback) {
                    var sql = "SELECT * FROM user_info WHERE nickname=? AND no!=?";
                    var params = [nickname, no];
                    connection.query(sql, params, function (error, results, fields) {
                        var json = { result: false, message: error };
                        if (error) {
                            json["message"] = "잘못된 접근 방식입니다.";
                            mLog.addlog(request.session.no, "user try update nickname err", 0);
                            return callback(1, json);
                        } else {
                            if (results.length == 0) {
                                callback(null);
                            } else {
                                mLog.addlog(request.session.no, "user try update already nickname=" + nickname, 0);
                                json["message"] = "이미 등록된 닉네임입니다.";
                                return callback(1, json);
                            }
                        }
                    });
                },
                function (callback) {
                    var sql = "UPDATE user_info SET " + set + " WHERE no=?";
                    connection.query(sql, Params, function (error, results, fields) {
                        var json = { result: false, message: error };
                        if (error) {
                            json["message"] = "잘못된 접근 방식입니다.";
                            mLog.addlog(request.session.no, "user try update err", 0);
                        } else {
                            mLog.addlog(request.session.no, "user try update success no=" + no, 1);
                            json = { result: true, message: "성공" };
                        }
                        response.json(json);
                    });
                }
            ], function (error, result) {
                response.json(result);
            });
        } else {
            var Params = new Array();
            var sets = new Array();
            var set = "";
            if (request.body.email) {
                Params.push(email);
                sets.push("email=?");
            }
            if (request.body.nickname) {
                Params.push(nickname);
                sets.push("nickname=?");
            }
            if (request.body.phone) {
                Params.push(phone);
                sets.push("phone=?");
            }
            if (request.body.newpassword) {
                Params.push(newpassword);
                sets.push("password=?");
            }
            if (request.file) {
                Params.push(request.file.filename);
                sets.push("profileimg=?");
            }
            forEach(Params, function (item, index, arr) {
                if (index == 0) {
                    set = sets[index];
                } else {
                    set = set + "," + sets[index];
                }
            });


            async.waterfall([
                function (callback) {
                    var sql = "SELECT * FROM user_info WHERE email=? AND password=?";
                    var params = [request.body.email, request.body.password];
                    connection.query(sql, params, function (error, results, fields) {
                        var json = { result: false, message: error };
                        if (error) {
                            mLog.addlog(request.session.no, "user try update err", 0);
                            json["message"] = "잘못된 접근 방식입니다.";
                            return callback(1, json);
                        } else {
                            if (results.length == 0) {
                                mLog.addlog(request.session.no, "user try update false password", 0);
                                json["message"] = "비밀번호가 틀립니다. 다시 확인해 주세요.";
                                return callback(1, json);
                            } else {
                                callback(null);
                            }
                        }
                    });
                },
                function (callback) {
                    if (!request.body.nickname) {
                        return callback(null);
                    }
                    var sql = "SELECT * FROM user_info WHERE nickname=? AND email!=? AND password!=?";
                    var params = [nickname, email, password];
                    connection.query(sql, params, function (error, results, fields) {
                        var json = { result: false, message: error };
                        if (error) {
                            mLog.addlog(request.session.no, "user try update nickname err", 0);
                            json["message"] = "잘못된 접근 방식입니다.";
                            return callback(1, json);
                        } else {
                            if (results.length == 0) {
                                callback(null);
                            } else {
                                mLog.addlog(request.session.no, "user try update already nickname=" + nickname, 0);
                                json["message"] = "이미 등록된 닉네임입니다.";
                                return callback(1, json);
                            }
                        }
                    });
                },
                function (callback) {
                    Params.push(request.body.email);
                    Params.push(request.body.password);
                    var sql = "UPDATE user_info SET " + set + " WHERE email=? AND password=?";
                    connection.query(sql, Params, function (error, results, fields) {
                        var json = { result: false, message: error };
                        if (error) {
                            json["message"] = "잘못된 접근 방식입니다.";
                            mLog.addlog(request.session.no, "user try update err", 0);
                            return callback(1, json);
                        } else {
                            callback(null);
                        }
                    });
                },
                function (callback) {
                    var sql = "SELECT no,nickname,profileimg,phone,part FROM user_info WHERE email=? AND password=?";
                    var params = [request.body.email, request.body.password];
                    connection.query(sql, params, function (error, results, fields) {
                        var json = { result: false, message: error };
                        if (error) {
                            json["message"] = "잘못된 접근 방식입니다.";
                            mLog.addlog(request.session.no, "user try update select err", 0);
                        } else {
                            json = { result: true, message: "성공", data: {} };
                            json['data'] = results[0];
                            mLog.addlog(request.session.no, "user try update success no=" + results[0].no, 1);
                        }
                        callback(null, json);
                    });
                }
            ], function (error, result) {
                response.json(result);
            });
        }

    },

    info: function (request, response) {
        var json = { result: false, message: '잘못된 접근 방식입니다.' };
        if (!request.session.auth)
            return response.json(json);
        if (!request.session.email)
            return response.json(json);
        var no = request.params.no;
        var sql = "SELECT * FROM user_info WHERE no=?";
        var params = [no];
        connection.query(sql, params, function (error, results, fields) {
            var json = { result: false, message: error };
            if (error) {
                json["message"] = "잘못된 접근 방식입니다.";
                mLog.addlog(request.session.no, "user try info err no=" + no, 0);
                response.json(json);
            } else {
                if (results.length == 0) {
                    json = { result: false, message: "존재하지 않는 사용자 입니다." };
                    mLog.addlog(request.session.no, "user try info none exist user  no=" + no, 0);
                    response.json(json);
                } else {
                    json = { result: true, message: "성공", data: {} };
                    mLog.addlog(request.session.no, "user info success no=" + no, 1);
                    json['data'] = {
                        no: results[0].no,
                        email: results[0].email,
                        nickname: results[0].nickname,
                        profileimg: results[0].profileimg,
                        phone: results[0].phone,
                        part: results[0].part
                    };
                    response.json(json);
                }
            }
        });
    },
    infoall: function (request, response) {
        var json = { result: false, message: '잘못된 접근 방식입니다.' };
        if (!request.session.auth)
            return response.json(json);
        if (!request.session.email)
            return response.json(json);
        var fields = "no,email,nickname,profileimg,phone,part"
        var sql = "SELECT " + fields + " FROM user_info WHERE root=0 ORDER BY no DESC";
        connection.query(sql, function (error, results, fields) {
            var json = { result: false, message: error };
            if (error) {
                json["message"] = "잘못된 접근 방식입니다.";
                mLog.addlog(request.session.no, "user try info all err", 0);
                response.json(json);
            } else {
                if (results.length == 0) {
                    json = { result: false, message: "사용자가 존재하지 않습니다." };
                    mLog.addlog(request.session.no, "user try info all none exist user", 0);
                    response.json(json);
                } else {
                    json = { result: true, message: "성공", data: new Array() };
                    mLog.addlog(request.session.no, "user info all success", 1);
                    json['data'] = results;
                    response.json(json);
                }
            }
        });
    },
    addtoken: function (request, response) {
        var json = { result: false, message: '잘못된 접근 방식입니다.' };
        if (!request.session.auth)
            return response.json(json);
        if (!request.session.email)
            return response.json(json);

        var sql = "UPDATE user_info SET token=? WHERE email=?";
        var params = [request.body.token,request.session.email];
        connection.query(sql, params, function (error, results, fields) {
            var json = { result: false, message: error };
            if (error) {       
                json["message"] = "잘못된 접근 방식입니다.";
                mLog.addlog(request.session.no, "user try update token err", 0);
                response.json(json);
            } else {
                json = { result: true, message: "성공"};
                mLog.addlog(request.session.no, "user try update token success", 1);
                response.json(json);
            }
        });
    }
}