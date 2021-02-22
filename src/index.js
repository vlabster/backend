var express = require("express");
var cors = require("cors");

var app = express();

app.use(cors());
app.use(express.json());

var mysql = require("mysql");
const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME,
});

app.post("/col", function (req, res) {
    function queryAsPromise(connection, sql, params) {
        return new Promise((resolve, reject) => {
            connection.query(sql, params, (err, results) => {
                if (err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
    }

    let sql1 = "SELECT * FROM `003` where name LIKE '" + req.body.name + "%'";
    let sql2 =
        "SELECT * FROM `aptechestvo` where name LIKE '" + req.body.name + "%'";
    let sql3 =
        "SELECT * FROM `dialog` where name LIKE '" + req.body.name + "%'";
    Promise.all([
        queryAsPromise(connection, sql1, [req.body.name]),
        queryAsPromise(connection, sql2, [req.body.name]),
        queryAsPromise(connection, sql3, [req.body.name]),
    ])
        .then((allResults) => {
            let results = allResults[0]
                .concat(allResults[1])
                .concat(allResults[2]);
            res.send(results);
        })
        .catch((e) => {});
});

app.listen("8000");
