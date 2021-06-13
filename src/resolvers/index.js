const {
    ProvidedRequiredArgumentsOnDirectivesRule,
} = require("graphql/validation/rules/ProvidedRequiredArgumentsRule");

const products = [
    {
        id: "1",
        title: "Капецитабин",
        price: "от 150р.",
    },
    {
        id: "2",
        title: "Пенталгин",
        price: "от 200р.",
    },
    {
        id: "3",
        title: "Пендимин",
        price: "от 450р.",
    },
    {
        id: "4",
        title: "Пендаль",
        price: "от 700р.",
    },
];

const books = [
    {
        title: "Harry Potter and the Chamber of Secrets",
        author: "J.K. Rowling",
        year: 2000,
    },
    {
        title: "Jurassic Park",
        author: "Michael Crichton",
        year: 2000,
    },
];

const resolvers = {
    Mutation: {
        addProduct: (_, thisProduct, { db }) => {
            db.getConnection(function (err, conn) {
                if (err) {
                    console.log(err);
                    return;
                }

                conn.query(
                    "INSERT INTO entities (id, type, entity) VALUES (UNHEX(?),?,?)",
                    [
                        thisProduct.id,
                        thisProduct.title,
                        `{"${thisProduct.entity}": ${thisProduct.entity}}`,
                    ],
                    (err) => {
                        conn.release();
                        if (err) {
                            console.log(err);
                            return;
                        }
                    }
                );
            });

            return products;
        },
        updateProduct: (_, thisProduct, { db }) => {
            db.getConnection(function (err, conn) {
                if (err) {
                    console.log(err);
                    return;
                }

                conn.query(
                    "UPDATE entities SET type =?, entity =? WHERE id = UNHEX(?)",
                    [
                        thisProduct.title,
                        `{"${thisProduct.entity}": ${thisProduct.entity}}`,
                        thisProduct.id,
                    ],
                    (err) => {
                        conn.release();
                        if (err) {
                            console.log(err);
                            return;
                        }
                    }
                );
            });

            return products;
        },
        removeProduct: (_, thisProduct, { db }) => {
            db.getConnection(function (err, conn) {
                if (err) {
                    console.log(err);
                    return;
                }
                conn.query(
                    "DELETE FROM entities WHERE id = UNHEX(?)",
                    [thisProduct.id],
                    (err) => {
                        conn.release();
                        if (err) {
                            console.log(err);
                            return;
                        }
                    }
                );
            });
            return products;
        },
    },
    Query: {
        books: async (_, o, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    conn.query("SELECT 1 as id", (err, res) => {
                        conn.release();

                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve(res);
                    });
                });
            });

            console.log("+++", JSON.stringify(res, null, 2));

            return books;
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

            console.log("enty: ", JSON.stringify(res, null, 2));

            return res;
        },
        product(parent, args, context, info) {
            return products.filter(
                (product) =>
                    args.title.length > 2 &&
                    product.title
                        .toLowerCase()
                        .indexOf(args.title.toLowerCase()) > -1
            );
        },
    },
};

module.exports = resolvers;
