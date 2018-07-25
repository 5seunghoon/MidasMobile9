const async = require("async");
const datetime = require('node-datetime');
const forEach = require('async-foreach').forEach;
var mLog = require("./log");
module.exports = {
    select: function (request, response) {
        var json = { result: false, message: '잘못된 접근 방식입니다.' };
        if (!request.session.auth)
            return response.json(json);
        var no = 1;
        var sql;
        var params;
        if (request.params.no) {
            no = request.params.no;
            sql = "SELECT * FROM menu_info WHERE no=? ORDER BY no DESC";
            params = [no];
        } else {
            sql = "SELECT * FROM menu_info WHERE enable=? ORDER BY no DESC";
            params = [no];
        }
        connection.query(sql, params, function (error, results, fields) {
            var json = { result: false, message: error };
            if (error) {
                json["message"] = "잘못된 접근 방식입니다.";
                mLog.addlog(request.session.no, "menu try select err" , 0);
                response.json(json);
            } else {
                json = { result: true, message: "성공", data: new Array() };
                if (results.length == 0) {
                    if(request.params.no){
                        json['message'] = "존재하지 않는 메뉴입니다.";
                    }else{
                        json['message'] = "메뉴가 존재하지 않습니다.";
                    }
                    mLog.addlog(request.session.no, "menu try select none exist" , 0);
                } else {
                    json['data'] = results;
                    mLog.addlog(request.session.no, "menu select success" , 1);
                }
                response.json(json);
            }
        });
    },

    insert: function (request, response) {
        var json = { result: false, message: '잘못된 접근 방식입니다.' };
        if (!request.session.auth)
            return response.json(json);
        if (!request.session.root)
            return response.json(json);

        var name = request.body.name;
        var info = request.body.info;
        var price = request.body.price;
        var img = 'basemenu.png';
        if (request.file)
            img = request.file.filename;
        var hotcold = request.body.hotcold;
        var enable = 1;
        
        async.waterfall([
            function (callback) {
                var sql = "SELECT * FROM menu_info WHERE name=?";
                var params = [name];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(request.session.no, "menu try insert err name" , 0);
                        return callback(1, json);
                    } else {
                        if (results.length == 0) {
                            callback(null);
                        } else {
                            mLog.addlog(request.session.no, "menu try insert aleardy name="+name , 0);
                            json["message"] = "이미 존재하는 메뉴이름입니다.";
                            return callback(1, json);
                        }
                    }
                });
            },
            function (callback) {
                var sql = "INSERT INTO menu_info values(null, ?, ?, ?, ?, ?, ?)";
                var params = [name, info, price, img, hotcold, enable];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        mLog.addlog(request.session.no, "menu try insert err" , 0);
                        json["message"] = "잘못된 접근 방식입니다.";
                        return callback(1, json);
                    } else {
                        mLog.addlog(request.session.no, "menu insert success no="+results.insertId ,1);
                        json = { result: true, message: "성공" };
                        callback(null, json);
                    }
                });
            }
        ], function (error, result) {
            response.json(result);
        });

    },

    update: function (request, response) {
        var json = { result: false, message: '잘못된 접근 방식입니다.' };
        if (!request.session.auth)
            return response.json(json);
        if (!request.session.root)
            return response.json(json);

        var no = request.body.no;
        var name = request.body.name;
        var info = request.body.info;
        var price = request.body.price;
        var hotcold = request.body.hotcold;
        var enable = 1;

        var set = "name=?, info=?, price=?, hotcold=?, enable=?";
        var Params = [name, info, price, hotcold, enable, no];

        if (request.file) {
            set = set + ", img=?";
            var filename = request.file.filename;
            Params = [name, info, price, hotcold, enable, filename, no];
        }

        async.waterfall([
            function (callback) {
                var sql = "SELECT * FROM menu_info WHERE no=?";
                var params = [no];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        mLog.addlog(request.session.no, "menu update err no" , 0);
                        json["message"] = "잘못된 접근 방식입니다.";
                        return callback(1, json);
                    } else {
                        if (results.length == 0) {
                            mLog.addlog(request.session.no, "menu try update none exist no" , 0);
                            json["message"] = "존재하지 않는 메뉴입니다.";
                            return callback(1, json);
                        } else {
                            callback(null);
                        }
                    }
                });
            },
            function (callback) {
                var sql = "SELECT * FROM menu_info WHERE no!=? AND name=?";
                var params = [no,name];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(request.session.no, "menu try update err" , 0);
                        return callback(1, json);
                    } else {
                        if (results.length == 0) {
                            callback(null);
                        } else {
                            mLog.addlog(request.session.no, "menu try update already exist name="+name , 0);
                            json["message"] = "이미 존재하는 메뉴이름입니다.";
                            return callback(1, json);
                        }
                    }
                });
            },
            function (callback) {
                var sql = "UPDATE menu_info SET "+set+" WHERE no=?";
                connection.query(sql, Params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(request.session.no, "menu try update err" , 0);
                        return callback(1, json);
                    } else {
                        json = { result: true, message: "성공" };
                        mLog.addlog(request.session.no, "menu update success" , 1);
                        callback(null, json);
                    }
                });
            }
        ], function (error, result) {
            response.json(result);
        });
    },

    delete: function (request, response) {
        var json = { result: false, message: '잘못된 접근 방식입니다.' };
        if (!request.session.auth)
            return response.json(json);
        if (!request.session.root)
            return response.json(json);

        var no = request.body.no;

        async.waterfall([
            function (callback) {
                var sql = "SELECT * FROM menu_info WHERE no=?";
                var params = [no];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(request.session.no, "menu try delete err" , 0);
                        return callback(1, json);
                    } else {
                        if (results.length == 0) {
                            json["message"] = "존재하지 않는 메뉴입니다.";
                            mLog.addlog(request.session.no, "menu try delete none exist no="+no , 0);
                            return callback(1, json);
                        } else {
                            
                            callback(null);
                        }
                    }
                });
            },
            function (callback) {
                var sql = "UPDATE menu_info SET enable=0 WHERE no=?";
                var params = [no];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(request.session.no, "menu try delete no="+no , 0);
                        return callback(1, json);
                    } else {
                        mLog.addlog(request.session.no, "menu delete success" , 1);
                        json = { result: true, message: "성공" };
                        callback(null, json);
                    }
                });
            }
        ], function (error, result) {
            response.json(result);
        });
    }
}