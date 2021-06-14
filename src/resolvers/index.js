const {
    ProvidedRequiredArgumentsOnDirectivesRule,
} = require("graphql/validation/rules/ProvidedRequiredArgumentsRule");

const resolvers = {
    Mutation: {
        addProduct: async (_, thisProduct, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    conn.query(
                        "INSERT INTO entities (id, type, entity) VALUES (UNHEX(?),?,?)",
                        [
                            thisProduct.id,
                            thisProduct.title,
                            `{"${thisProduct.entity}": ${thisProduct.entity}}`,
                        ],
                        (err, res) => {
                            conn.release();
                            if (err) {
                                reject(err);
                                return;
                            }

                            resolve(res);
                        }
                    );
                });
            });
            console.log("Added product: ", JSON.stringify(res, null, 2));
            return res;
        },
        updateProduct: async (_, thisProduct, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    conn.query(
                        "UPDATE entities SET type =?, entity =? WHERE id = UNHEX(?)",
                        [
                            thisProduct.title,
                            `{"${thisProduct.entity}": ${thisProduct.entity}}`,
                            thisProduct.id,
                        ],
                        (err, res) => {
                            conn.release();
                            if (err) {
                                reject(err);
                                return;
                            }

                            resolve(res);
                        }
                    );
                });
            });
            console.log("Updated product: ", JSON.stringify(res, null, 2));
            return res;
        },
        removeProduct: async (_, thisProduct, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    conn.query(
                        "DELETE FROM entities WHERE id = UNHEX(?)",
                        [thisProduct.id],
                        (err, res) => {
                            conn.release();
                            if (err) {
                                reject(err);
                                return;
                            }

                            resolve(res);
                        }
                    );
                });
            });
            console.log("Removed product: ", JSON.stringify(res, null, 2));
            return res;
        },
    },
    Query: {
        product: async (_, thisProduct, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    conn.query(
                        "SELECT * FROM entities WHERE type = ?",
                        [thisProduct.title],
                        (err, res) => {
                            conn.release();
                            if (err) {
                                reject(err);
                                return;
                            }

                            resolve(res);
                        }
                    );
                });
            });
            console.log("product: ", JSON.stringify(res, null, 2));
            return res;
        },

        entities: async (_, o, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    conn.query("SELECT * from entities", (err, res) => {
                        conn.release();

                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve(res);
                    });
                });
            });

            console.log("Products: ", JSON.stringify(res, null, 2));

            return res;
        },
    },
};

module.exports = resolvers;
