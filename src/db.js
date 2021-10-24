
const orm = (pool, logger) => {
    const getEntity = async (data) => {
        const r = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    logger.error("failed getting connection", err);
                    reject(err);

                    return;
                }

                conn.query(
                    "SELECT HEX(id) as id, type, entity FROM entities WHERE id = UNHEX(?) and deleted = 0",
                    [data.id],
                    (err, res) => releaseConn(conn, err, res, resolve, reject)
                );
            });
        });

        return r[0];
    };

    const getEntities = async (IDsWithX) => {
        const r = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    logger.error("failed getting connection", err);
                    reject(err);

                    return;
                }

                conn.query(
                    `SELECT HEX(id) as id, type, entity FROM entities WHERE id IN (${IDsWithX}) AND deleted = 0`,
                    (err, res) => releaseConn(conn, err, res, resolve, reject)
                );
            });
        });

        return r;
    };

    const createEntity = async (data) =>
        await new Promise((resolve, reject) =>
            pool.getConnection((err, conn) => {
                if (err) {
                    logger.error("failed getting connection", err);
                    reject(err);

                    return;
                }

                conn.query(
                    "INSERT entities (id, type, entity) VALUES (UNHEX(?),?,?)",
                    [data.id, data.type, data.entity],
                    (err, res) => releaseConn(conn, err, res, resolve, reject)
                );
            })
        );

    const updateEntity = async (data) =>
        await new Promise((resolve, reject) =>
            pool.getConnection((err, conn) => {
                if (err) {
                    logger.error("failed getting connection", err);
                    reject(err);

                    return;
                }

                conn.query(
                    "UPDATE entities SET entity = ?, updated = NOW() WHERE id = UNHEX(?)",
                    [data.entity, data.id],
                    (err, res) => releaseConn(conn, err, res, resolve, reject)
                );
            })
        );

    const removeEntity = async (id) =>
        await new Promise((resolve, reject) =>
            pool.getConnection((err, conn) => {
                if (err) {
                    logger.error("failed getting connection", err);
                    reject(err);

                    return;
                }

                conn.query(
                    "UPDATE entities SET deleted = 1, updated = NOW() WHERE id = UNHEX(?)",
                    [id],
                    (err, res) => releaseConn(conn, err, res, resolve, reject)
                );
            })
        );

    const getTriple = async (data) => {
        const r = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    logger.error("failed getting connection", err);
                    reject(err);

                    return;
                }

                conn.query(
                    "SELECT HEX(subject) as subject, predicate, object, priority FROM triples WHERE subject = UNHEX(?) and deleted = 0",
                    [data.subject],
                    (err, res) => releaseConn(conn, err, res, resolve, reject)
                );
            });
        });

        return r[0];
    };

    const createTriple = async (data) =>
        await new Promise((resolve, reject) =>
            pool.getConnection((err, conn) => {
                if (err) {
                    logger.error("failed getting connection", err);
                    reject(err);

                    return;
                }

                conn.query(
                    "INSERT INTO triples (subject, predicate, object, priority) VALUES (UNHEX(?), ?, UNHEX(?), ?)",
                    [
                        data.subject,
                        data.predicate,
                        data.object,
                        data.priority,
                    ],
                    (err, res) => releaseConn(conn, err, res, resolve, reject)
                );
            })
        );

    const updateTriple = async (data) =>
        await new Promise((resolve, reject) =>
            pool.getConnection((err, conn) => {
                if (err) {
                    logger.error("failed getting connection", err);
                    reject(err);

                    return;
                }

                conn.query(
                    "UPDATE triples SET priority = ? WHERE subject = UNHEX(?)",
                    [data.priority, data.subject],
                    (err, res) => releaseConn(conn, err, res, resolve, reject)
                );
            })
        );

    const removeTriple = async (data) =>
        await new Promise((resolve, reject) =>
            pool.getConnection((err, conn) => {
                if (err) {
                    logger.error("failed getting connection", err);
                    reject(err);

                    return;
                }

                conn.query(
                    "UPDATE triples SET deleted = 1 WHERE subject = UNHEX(?)",
                    [data.subject],
                    (err, res) => releaseConn(conn, err, res, resolve, reject)
                );
            })
        );

    const getSuggests = async (data) => {
        const r = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    logger.error("failed getting connection", err);
                    reject(err);

                    return;
                }

                conn.query(
                    "SELECT HEX(id) as id, source, type FROM suggestion_products " +
                    "WHERE source LIKE '%" + data.title + "%' ",
                    (err, res) => releaseConn(conn, err, res, resolve, reject)
                );
            });
        });

        return r;
    };

    const getAllProducts = async () => {
        const r = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    logger.error("failed getting connection", err);
                    reject(err);

                    return;
                }

                conn.query(
                    "SELECT id, source, type from suggestion_products",
                    (err, res) => releaseConn(conn, err, res, resolve, reject)
                );
            });
        });

        return r;
    };

    const addSuggest = async (data) =>
        await new Promise((resolve, reject) =>
            pool.getConnection((err, conn) => {
                if (err) {
                    logger.error("failed getting connection", err);
                    reject(err);

                    return;
                }

                conn.query(
                    "INSERT INTO suggestion_products (id, source, type) VALUES (UNHEX(?),?,?)",
                    [
                        data.id,
                        data.source,
                        data.type,
                    ],
                    (err, res) => releaseConn(conn, err, res, resolve, reject)
                );
            })
        );

    const releaseConn = (conn, err, res, resolve, reject) => {
        conn.release();
        if (err) {
            // TODO logger
            console.log(this, "failed to execute query", err.sqlMessage);
            reject(err);

            return;
        }

        resolve(res);
    };

    return {
        getEntity,
        getEntities,
        createEntity,
        updateEntity,
        removeEntity,

        getTriple,
        createTriple,
        updateTriple,
        removeTriple,

        getAllProducts,

        getSuggests,
        addSuggest,
    };
};

module.exports = { orm };
