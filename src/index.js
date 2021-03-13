const path = require("path");
const fs = require("fs");

const mysql = require("mysql");
const express = require("express");
const cors = require("cors");

// Apollo server
const { ApolloServer, gql } = require("apollo-server-express");
const expressPlayground = require("graphql-playground-middleware-express")
    .default;

const schema = fs.readFileSync(
    path.join(__dirname, "shema", "schema.graphql"),
    "utf-8",
    (error) => {
        if (error) throw error;
    }
);

const typeDefs = gql(schema);
const resolvers = require("./resolvers");

const server = new ApolloServer({ typeDefs, resolvers, introspection: true });

const app = express();
app.use(cors());
app.use(express.json());

server.applyMiddleware({
    app,
    cors: {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        optionsSuccessStatus: 204,
    },
});

app.use("/playground", expressPlayground({ endpoint: "/graphql" }));

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME,
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("mysql db => connection");
    }
});
connection.end(function (err) {
    if (err) {
        return console.log(err.message);
    }
});

app.listen(process.env.BACKEND_PORT || 4000, () =>
    console.log(
        `🚀 Server ready at http://localhost:${
            process.env.BACKEND_PORT || 4000
        }${server.graphqlPath}`
    )
);
