//const { id2uuid, uuid2id } = require('./helpers/convertUuid');

const orm = (pool, logger) => {
    const getAllEntities = async (data) => {
        const r = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    logger.error("failed getting connection", err);
                    reject(err);

                    return;
                }

                conn.query(
                    "SELECT id, type, entity, created, updated, deleted from entities",
                    (err, res) => releaseConn(conn, err, res, resolve, reject)
                );
            });
        });

        return r;
    };

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

    const removeEntity = async (data) =>
        await new Promise((resolve, reject) =>
            pool.getConnection((err, conn) => {
                if (err) {
                    logger.error("failed getting connection", err);
                    reject(err);

                    return;
                }

                conn.query(
                    "UPDATE entities SET deleted = 1, updated = NOW() WHERE id = UNHEX(?)",
                    [data.id],
                    (err, res) => releaseConn(conn, err, res, resolve, reject)
                );
            })
        );

    const getAllProducts = async (data) => {
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

    return { getAllEntities, getEntity, createEntity, updateEntity, removeEntity, getAllProducts, addSuggest };
};

module.exports = { orm };
