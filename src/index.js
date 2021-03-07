const path = require("path");
const fs = require("fs");

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

const server = new ApolloServer({ typeDefs, resolvers });

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

const PORT = 4001;

app.listen(PORT, () =>
    console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )
);

// const connection = mysql.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DBNAME,
// });
