const path = require("path");
const { join } = path;
const fs = require("fs");
const fsPromises = require("fs/promises");
const http = require("http");
const { createTerminus } = require("@godaddy/terminus");
const expressPlayground =
    require("graphql-playground-middleware-express").default;
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

const readfiles = async (dir) => {
    const files = await fsPromises.readdir(dir);
    const all = await Promise.all(
        files.map(async (v) => {
            const path = join(dir, v);
            const stat = await fsPromises.stat(path);
            if (stat.isDirectory()) {
                return await readfiles(path);
            }
            return await fsPromises.readFile(path);
        })
    );
    return all.flat();
};

const initApollo = async (dir, options) => {
    const schemaString = (await readfiles(dir))
        .map((v) => v.toString())
        .join("\n");
    const schemas = gql(schemaString);
    return new ApolloServer({
        ...options,
        typeDefs: schemas,
    });
};

const onSignal = () => {
    console.log("server is stopping");
    return Promise.all([apolloServer.stop(), pool.end()]);
};
const testAttempt = (v) => {
    if (v === true) {
        return v;
    }

    throw v;
};

const onShutdown = () => {
    console.log("server is stopped");
};

const runApp = (server) => () =>
    server.listen(process.env.BACKEND_PORT, () =>
        console.log(
            `server ready at http://localhost:${process.env.BACKEND_PORT}`
        )
    );

const errorHandler = (err) => {
    console.error("failed to connect to mysql:", err.code);

    process.exit(1);
};

const initServer = async () => {
    const app = express();
    const apolloServer = await initApollo(`${__dirname}/schema`, {
        app,
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

    const server = http.createServer(app);

    createTerminus(server, {
        timeout: 10000,
        onSignal,
        onShutdown,
    });

    console.log("server has started");

    const MAX_ATTEMPTS = 100;
    const ATTEMPT_INTERVAL = 1000;
    const rejectDelay = (r) => {
        console.log("trying to connect to mysql...");
        return new Promise((_, j) =>
            setTimeout(j.bind(null, r), ATTEMPT_INTERVAL)
        );
    };

    let repeater = Promise.reject();
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        repeater = repeater.catch(ping).then(testAttempt).catch(rejectDelay);
    }

    repeater.then(runApp(server)).catch(errorHandler);
};

initServer();
