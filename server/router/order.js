const async = require("async");
const datetime = require('node-datetime');
const forEach = require('async-foreach').forEach;
var mLog = require("./log");
var FCM = require('fcm-node');
var serverKey = 'AAAAWIytVsU:APA91bFfmYI_iyaHrDsVCvwEiN8q3Hqi8pdp7W5nLOGoyJVfZ8XMwTOEUN4QnV-MMUfBYtJzyFEjfmMmxWcWDPY874eeM2JATWqsgRlrjuo0JfduIXEz7Van33G8JuK0lFqdfgv6g3du';
var fcm = new FCM(serverKey);

module.exports = {

    selectDone: function (request, response) {
        var json = { result: false, message: '잘못된 접근 방식입니다.' };
        if (!request.session.auth)
            return response.json(json);
        var state = 4;
        var fields;
        var sql;
        var params = [state];
        if (!request.session.root) {
            fields = "order_list.no, order_list.user_no, order_list.menu_no, order_list.size, order_list.hotcold, order_list.count, order_list.price, order_list.state, order_list.date,menu_info.name,menu_info.info,menu_info.img,menu_info.enable";
            sql = "SELECT " + fields + " FROM order_list INNER JOIN user_info ON order_list.user_no=user_info.no INNER JOIN menu_info ON order_list.menu_no=menu_info.no WHERE user_no=? AND state=? ORDER BY no DESC;";
            params = [request.session.no, state];
        } else {
            fields = "order_list.no, order_list.user_no, order_list.menu_no, order_list.size, order_list.hotcold, order_list.count, order_list.price, order_list.state, order_list.date,user_info.email,user_info.nickname,user_info.profileimg,user_info.phone,user_info.part,menu_info.name,menu_info.info,menu_info.img,menu_info.enable";
            sql = "SELECT " + fields + " FROM order_list INNER JOIN user_info ON order_list.user_no=user_info.no INNER JOIN menu_info ON order_list.menu_no=menu_info.no WHERE state=? ORDER BY no DESC;";
        }
        connection.query(sql, params, function (error, results, fields) {
            var json = { result: false, message: error };
            if (error) {
                json["message"] = "잘못된 접근 방식입니다.";
                mLog.addlog(request.session.no, "order select done err", 0);
                response.json(json);
            } else {
                json = { result: true, message: "성공", data: new Array() };
                if (results.length == 0) {
                    mLog.addlog(request.session.no, "order select done none exist", 1);
                    json['message'] = "완료된 주문내역이 존재하지 않습니다.";
                } else {
                    json['data'] = results;
                    mLog.addlog(request.session.no, "order select done success", 1);
                }
                response.json(json);
            }
        });
    },

    selectMonth: function (request, response) {
        var json = { result: false, message: '잘못된 접근 방식입니다.' };
        if (!request.session.auth)
            return response.json(json);

        var fields;
        var sql;
        var params;
        var yearmonth = request.params.yearmonth;
        var date = new Date(yearmonth);
        var month = date.getMonth();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        firstDay = datetime.create(firstDay).format('Y-m-d 00:00:00');
        lastDay = datetime.create(lastDay).format('Y-m-d 23:59:59');
        var state = 4;
        if (!request.session.root) {
            fields = "order_list.no, order_list.user_no, order_list.menu_no, order_list.size, order_list.hotcold, order_list.count, order_list.price, order_list.state, order_list.date,menu_info.name,menu_info.info,menu_info.img,menu_info.enable";
            sql = "SELECT " + fields + " FROM order_list INNER JOIN user_info ON order_list.user_no=user_info.no INNER JOIN menu_info ON order_list.menu_no=menu_info.no WHERE user_no=? AND date>=? AND date<=? AND state=? ORDER BY no DESC;";
            params = [request.session.no, firstDay, lastDay, state];
        } else {
            fields = "order_list.no, order_list.user_no, order_list.menu_no, order_list.size, order_list.hotcold, order_list.count, order_list.price, order_list.state, order_list.date,user_info.email,user_info.nickname,user_info.profileimg,user_info.phone,user_info.part,menu_info.name,menu_info.info,menu_info.img,menu_info.enable";
            sql = "SELECT " + fields + " FROM order_list INNER JOIN user_info ON order_list.user_no=user_info.no INNER JOIN menu_info ON order_list.menu_no=menu_info.no WHERE date>=? AND date<=? AND state=? ORDER BY no DESC;";
            params = [firstDay, lastDay, state];
        }
        connection.query(sql, params, function (error, results, fields) {
            var json = { result: false, message: error };
            if (error) {
                json["message"] = "잘못된 접근 방식입니다.";
                mLog.addlog(request.session.no, "order select month err", 0);
                response.json(json);
            } else {
                json = { result: true, message: "성공", data: new Array() };
                if (results.length == 0) {
                    json['message'] = "주문내역이 존재하지 않습니다.";
                    mLog.addlog(request.session.no, "order select month none exist", 1);
                } else {
                    json['data'] = results;
                    mLog.addlog(request.session.no, "order select month success", 1);
                }
                response.json(json);
            }
        });
    },

    select: function (request, response) {
        var json = { result: false, message: '잘못된 접근 방식입니다.' };
        if (!request.session.auth)
            return response.json(json);

        var state = 4;
        var fields;
        var sql;
        var params;
        var dt = datetime.create();
        var today = dt.format('Y-m-d 00:00:00');
        var today2 = dt.format('Y-m-d 23:59:59');
        if (!request.session.root) {
            fields = "order_list.no, order_list.user_no, order_list.menu_no, order_list.size, order_list.hotcold, order_list.count, order_list.price, order_list.state, order_list.date,menu_info.name,menu_info.info,menu_info.img,menu_info.enable";
            sql = "SELECT " + fields + " FROM order_list INNER JOIN user_info ON order_list.user_no=user_info.no INNER JOIN menu_info ON order_list.menu_no=menu_info.no WHERE user_no=? AND ((date>=? AND date<=?) OR state!=4) ORDER BY no DESC;";
            params = [request.session.no, today, today2];
        } else {
            fields = "order_list.no, order_list.user_no, order_list.menu_no, order_list.size, order_list.hotcold, order_list.count, order_list.price, order_list.state, order_list.date,user_info.email,user_info.nickname,user_info.profileimg,user_info.phone,user_info.part,menu_info.name,menu_info.info,menu_info.img,menu_info.enable";
            sql = "SELECT " + fields + " FROM order_list INNER JOIN user_info ON order_list.user_no=user_info.no INNER JOIN menu_info ON order_list.menu_no=menu_info.no WHERE state!=4 ORDER BY no DESC;";
            params = [today, today2];
        }
        connection.query(sql, params, function (error, results, fields) {
            var json = { result: false, message: error };
            if (error) {
                json["message"] = "잘못된 접근 방식입니다.";
                mLog.addlog(request.session.no, "order select err", 0);
                response.json(json);
            } else {
                json = { result: true, message: "성공", data: new Array() };
                if (results.length == 0) {
                    json['message'] = "주문내역이 존재하지 않습니다.";
                    mLog.addlog(request.session.no, "order select none exist", 1);
                } else {
                    json['data'] = results;
                    mLog.addlog(request.session.no, "order select success", 1);
                }
                response.json(json);
            }
        });
    },

    insert: function (request, response) {
        var json = { result: false, message: '잘못된 접근 방식입니다.' };
        if (!request.session.auth)
            return response.json(json);
        var user_no = request.body.user_no;
        if (!request.session.no || request.session.no != user_no)
            return response.json(json);

        var menu_no = request.body.menu_no;
        var size = request.body.size;
        var hotcold = request.body.hotcold;
        var count = request.body.count;
        var price = request.body.price;
        var state = 0;
        var dt = datetime.create();
        var date = dt.format('Y-m-d H:M:S');

        async.waterfall([
            function (callback) {
                var sql = "SELECT * FROM menu_info WHERE no=?";
                var params = [menu_no];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(request.session.no, "order insert err", 0);
                        return callback(1, json);
                    } else {
                        if (results.length == 0) {
                            json["message"] = "존재하지 않는 메뉴입니다.";
                            mLog.addlog(request.session.no, "order insert none exist", 1);
                            return callback(1, json);
                        } else {
                            if (results[0].enable == 0) {
                                json["message"] = "판매 종료된 메뉴입니다.";
                                mLog.addlog(request.session.no, "order insert done disable", 1);
                                return callback(1, json);
                            } else {
                                callback(null);
                            }
                        }
                    }
                });
            },

            function (callback) {
                var sql = "INSERT INTO order_list VALUES(null, ?, ?, ?, ?, ?, ?, ?, ?)";
                var params = [user_no, menu_no, size, hotcold, count, price, state, date];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(request.session.no, "order insert err", 0);
                        return callback(1, null);
                    } else {
                        json = { result: true, message: "성공", no: results.insertId };
                        mLog.addlog(request.session.no, "order insert success", 1);
                        callback(null, json);
                    }
                });
            }
        ], function (error, result) {
            var sql = "SELECT * FROM user_info WHERE root=1 AND token IS NOT NULL";
            connection.query(sql, function (error, results, fields) {
                for (var i = 0; i < results.length; i++) {
                    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                        to: results[i].token,
                        collapse_key: 'your_collapse_key',

                        notification: {
                            title: '새로운 주문!',
                            body: '방금전 새로운 주문이 들어왔습니다!'
                        },
                        data: {  //you can send only notification or only data(or include both)
                            my_key: 'my value',
                            my_another_key: 'my another value'
                        }
                    };

                    fcm.send(message, function (err, response) {
                    
                    });
                }

            });
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
        var state = request.body.state;
        var user_no;
        async.waterfall([
            function (callback) {
                var sql = "SELECT * FROM order_list WHERE no=?";
                var params = [no];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(request.session.no, "order update err", 0);
                        return callback(1, json);
                    } else {
                        if (results.length == 0) {
                            json["message"] = "존재하지 않는 주문내역입니다.";
                            mLog.addlog(request.session.no, "order update none exist order no", 0);
                            return callback(1, json);
                        } else {
                            if (results[0].state == state) {
                                json["message"] = "이미 적용된 사항입니다.";
                                mLog.addlog(request.session.no, "order update already state", 1);
                                return callback(1, json);
                            }
                            user_no = results[0].user_no;
                            callback(null);
                        }
                    }
                });
            },
            function (callback) {
                var sql = "UPDATE order_list SET state=? WHERE no=?";
                var params = [state, no];
                connection.query(sql, params, function (error, results, fields) {
                    var json = { result: false, message: error };
                    if (error) {
                        json["message"] = "잘못된 접근 방식입니다.";
                        mLog.addlog(request.session.no, "order update err", 0);
                        return callback(1, json);
                    } else {
                        mLog.addlog(request.session.no, "order update success", 1);
                        json = { result: true, message: "성공" };
                        callback(null, json);
                    }
                });
            }
        ], function (error, result) {
            if (state == 3) {
                var sql = "SELECT * FROM user_info WHERE no=? AND token IS NOT NULL";
                var params = [user_no];
                connection.query(sql, params, function (error, results, fields) {
                    if (!error || results.length!=0 ||results.token ) {
                        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                            to: results[0].token,
                            collapse_key: 'your_collapse_key',

                            notification: {
                                title: '준비완료',
                                body: '주문한 음료가 준비되었습니다!'
                            },
                            data: {  //you can send only notification or only data(or include both)
                                my_key: 'my value',
                                my_another_key: 'my another value'
                            }
                        };
                        fcm.send(message, function (err, response) {
                        
                        });
                    }

                });
            }
            response.json(result);
        });
    }
}