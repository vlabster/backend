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
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hi andre! I'm server.\n");
});

app.listen(process.env.BACKEND_PORT);
