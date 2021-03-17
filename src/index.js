const path = require("path");
const fs = require("fs");
const http = require("http");
const { createTerminus } = require("@godaddy/terminus");
const expressPlayground = require("graphql-playground-middleware-express")
    .default;
const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const resolvers = require("./resolvers");
const mysql = require("mysql");

const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME,
});

const ping = async () => {
    const res = await new Promise((resolve, reject) => {
        db.getConnection(function (err, conn) {
            if (err) {
                reject(err);
                return;
            }

            conn.ping((err) => {
                conn.release();

                if (err) {
                    reject(false);

                    return;
                }
                console.log("Server responded to ping");
                resolve(true);
            });
        });
    });

    return res;
};

const freeze = (time) => {
    const stop = new Date().getTime() + time;
    while (new Date().getTime() < stop);
};

// not working
// for (let i = 10; i > 1; i--) {
//     ping().catch((err) => {
//         // console.log(err);
//         // process.exit(1);
//     });
//     freeze(1000);
//     console.log("ping to mysql ", i);
// }

const schema = fs.readFileSync(
    path.join(__dirname, "schema", "schema.graphql"),
    "utf-8",
    (error) => {
        if (error) throw error;
    }
);

const typeDefs = gql(schema);
const app = express();
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    context: { db },
});

apolloServer.applyMiddleware({
    app,
    cors: {
        origin: "*",
        methods: "GET,POST",
        optionsSuccessStatus: 204,
    },
});
app.use("/playground", expressPlayground({ endpoint: "/graphql" }));

function onSignal() {
    console.log("server is starting cleanup");
    return Promise.all([apolloServer.stop(), pool.end()]);
}

function onShutdown() {
    console.log("server is stopped");
}

const server = http.createServer(app);

createTerminus(server, {
    timeout: 10000,
    onSignal,
    onShutdown,
});

server.listen(process.env.BACKEND_PORT, () =>
    console.log(
        `🚀 Server ready at http://localhost:${process.env.BACKEND_PORT}`
    )
);
