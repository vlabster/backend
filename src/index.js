const winston = require("winston");
const path = require("path"); //.join
const { join } = path;

// const fs = require("fs");
const fsPromises = require("fs/promises");
const http = require("http");
const { createTerminus } = require("@godaddy/terminus");
const expressPlayground =
    require("graphql-playground-middleware-express").default;
const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const mysql = require("mysql");

const resolvers = require("./resolvers");
const db = require("./db");

const logger = winston.createLogger({
    level: "debug",
    format: winston.format.simple(),
    defaultMeta: { service: "backend" },
    transports: [new winston.transports.Console()],
});

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DBNAME,
    charset: "UTF8MB4_GENERAL_CI",
});

const ping = async () => {
    const res = await new Promise((resolve, reject) => {
        pool.getConnection(function (err, conn) {
            if (err) {
                logger.error("failed getting connection", err);
                reject(err);

                return;
            }

            conn.ping((err) => {
                conn.release();

                if (err) {
                    logger.error("failed to pind database", err);
                    reject(err);

                    return;
                }

                logger.info("mysql responded to ping");

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
    logger.info("server is stopping");

    return Promise.all([apolloServer.stop(), pool.end()]);
};
const testAttempt = (v) => {
    if (v === true) {
        return v;
    }

    throw v;
};

const onShutdown = () => {
    logger.info("server is stopped");
};

const runApp = (server) => () =>
    server.listen(process.env.BACKEND_PORT, () =>
        logger.info(
            `server ready at http://localhost:${process.env.BACKEND_PORT}`
        )
    );

const errorHandler = (err) => {
    logger.error("failed to connect to mysql", err.code);

    process.exit(1);
};

const initServer = async () => {
    const app = express();

    const apolloServer = await initApollo(`${__dirname}/schema`, {
        app,
        resolvers,
        introspection: true,
        context: { db: db.orm(pool, logger), logger: logger },
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

    logger.info("server has started");

    const MAX_ATTEMPTS = 100;
    const ATTEMPT_INTERVAL = 1000;
    const rejectDelay = (r) => {
        logger.info("trying to connect to mysql...");
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
