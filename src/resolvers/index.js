const {
    ProvidedRequiredArgumentsOnDirectivesRule,
} = require("graphql/validation/rules/ProvidedRequiredArgumentsRule");

const resolvers = {
    Mutation: {
        addEntity: async (_, thisEntity, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    conn.query(
                        "INSERT INTO entities (id, type, entity) VALUES (UNHEX(?),?,?)",
                        [
                            thisEntity.id,
                            thisEntity.type,
                            `{"${thisEntity.entity}": ${thisEntity.entity}}`,
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
            console.log("Added Entity: ", JSON.stringify(res, null, 2));
            return thisEntity;
        },
        // will be restored while working with products
        // updateProduct: async (_, thisProduct, { db }) => {
        //     const res = await new Promise((resolve, reject) => {
        //         db.getConnection(function (err, conn) {
        //             if (err) {
        //                 reject(err);
        //                 return;
        //             }
        //             conn.query(
        //                 "UPDATE entities SET type =?, entity =? WHERE id = UNHEX(?)",
        //                 [
        //                     thisProduct.title,
        //                     `{"${thisProduct.entity}": ${thisProduct.entity}}`,
        //                     thisProduct.id,
        //                 ],
        //                 (err, res) => {
        //                     conn.release();
        //                     if (err) {
        //                         reject(err);
        //                         return;
        //                     }

        //                     resolve(res);
        //                 }
        //             );
        //         });
        //     });
        //     console.log("Updated product: ", JSON.stringify(res, null, 2));
        //     return res;
        // },
        restoreEntity: async (_, thisEntity, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    conn.query(
                        "UPDATE entities SET deleted = ? WHERE id = UNHEX(?)",
                        [0, thisEntity.id],
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
            console.log("Restored Entity: ", JSON.stringify(res, null, 2));
            return thisEntity;
        },
        removeEntity: async (_, thisEntity, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    conn.query(
                        "UPDATE entities SET deleted = ? WHERE id = UNHEX(?)",
                        [1, thisEntity.id],
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
            console.log("Removed Entity: ", JSON.stringify(res, null, 2));
            return thisEntity;
        },

        addTriple: async (_, thisTriple, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    conn.query(
                        "INSERT INTO triples (subject, predicate, object, priority) VALUES (UNHEX(?), ?, UNHEX(?), ?)",
                        [
                            thisTriple.subject,
                            thisTriple.predicate,
                            thisTriple.object,
                            thisTriple.priority,
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
            console.log("Added Triple: ", JSON.stringify(res, null, 2));
            return thisTriple;
        },
        updateTriple: async (_, thisTriple, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    conn.query(
                        "UPDATE triples SET priority = ? WHERE subject = UNHEX(?)",
                        [thisTriple.priority, thisTriple.subject],
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
            console.log("Updated Triple: ", JSON.stringify(res, null, 2));
            return thisTriple;
        },
        removeTriple: async (_, thisTriple, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    conn.query(
                        "UPDATE triples SET deleted = ? WHERE subject = UNHEX(?)",
                        [thisTriple.deleted, thisTriple.subject],
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
            console.log("Removed Triple: ", JSON.stringify(res, null, 2));
            return thisTriple;
        },
    },
    Query: {
        searchEntity: async (_, thisEntity, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    conn.query(
                        "SELECT * FROM entities WHERE id = UNHEX(?)",
                        [thisEntity.id],
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
            console.log("Search Entity: ", JSON.stringify(res, null, 2));
            return thisEntity;
        },

        allEntities: async (_, o, { db }) => {
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

            console.log("Entities: ", JSON.stringify(res, null, 2));

            return res;
        },
        allTriples: async (_, o, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    conn.query("SELECT * from triples", (err, res) => {
                        conn.release();
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
                });
            });
            console.log("Triples: ", JSON.stringify(res, null, 2));
            return res;
        },
    },
};

module.exports = resolvers;
