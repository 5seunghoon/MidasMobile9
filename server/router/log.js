const datetime = require('node-datetime');

module.exports = {
    addlog: function (no, info, value) {
        var sql = "INSERT INTO log_list VALUES(NULL,?,?,?,?)";
        var date = datetime.create();
        var params = [no, info, value, date.format('Y-m-d H:M:S')];
        connection.query(sql, params, function (error, results, fields) {
            var json = { result: false, message: error };
            if (error) {
                console.log(error);
            }
        });
    }
}