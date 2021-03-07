const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");

// Массив с продуктами
const medications = require("../db/medications");

// Схема GraphQL
const schema = require("./schema");

// Фун-ии для работы с GraphQL
const root = {
    getAllMedications: () => {
        return medications;
    },
};

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/graphql",
    graphqlHTTP({
        graphiql: true,
        schema,
        rootValue: root,
    })
);

const mysql = require("mysql");
const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME,
});

const fakeData = [
    {
        title: "Fake data from backend",
    },
];

app.post("/col", function (req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(fakeData) + "\n");
});

// app.listen(process.env.BACKEND_PORT);   Я прост не работал с mySql и process.env и т.д. Если че, то переделаю всё как надо

const PORT = 5501;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
