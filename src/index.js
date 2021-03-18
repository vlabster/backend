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
                    reject(err);

                    return;
                }

                console.log("mysql responded to ping");

                resolve(true);
            });
        });
    });

    return res;
};

const schema = fs.readFileSync(
    path.join(__dirname, "schema", "schema.graphql"),
    "utf-8",
    (error) => {
        if (error) throw error;
    }
);

const typeDefs = gql(schema);
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    context: { db },
});

const app = express();
apolloServer.applyMiddleware({
    app,
    cors: {
        origin: "*",
        methods: "GET,POST",
        optionsSuccessStatus: 204,
    },
});
app.use("/playground", expressPlayground({ endpoint: "/graphql" }));

const onSignal = () => {
    console.log("server is stopping");
    return Promise.all([apolloServer.stop(), pool.end()]);
};

const onShutdown = () => {
    console.log("server is stopped");
};

const server = http.createServer(app);

createTerminus(server, {
    timeout: 10000,
    onSignal,
    onShutdown,
});

console.log("server is started");

const MAX_ATTEMPTS = 30;
const ATTEMPT_INTERVAL = 1000;
const rejectDelay = (r) => {
    console.log("trying to connect to mysql...");
    return new Promise((_, j) => setTimeout(j.bind(null, r), ATTEMPT_INTERVAL));
};

const testAttempt = (v) => {
    if (v === true) {
        return v;
    }

    throw v;
};

let repeater = Promise.reject();
for (let i = 0; i < MAX_ATTEMPTS; i++) {
    repeater = repeater.catch(ping).then(testAttempt).catch(rejectDelay);
}

const runApp = () =>
    server.listen(process.env.BACKEND_PORT, () =>
        console.log(
            `server ready at http://localhost:${process.env.BACKEND_PORT}`
        )
    );

const errorHandler = (err) => {
    console.error("failed to connect to mysql:", err.code);

    process.exit(1);
};

repeater.then(runApp).catch(errorHandler);
