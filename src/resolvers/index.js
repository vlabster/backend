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
    Mutation: {
        addProduct: async (_, o, { db }, { id, title }) => {
            const newProduct = { id, title };
            console.log(newProduct);
            products.push(newProduct);
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const c = conn.query(
                        "SELECT COUNT (*) AS count FROM entities",
                        function (error, results) {
                            console.log(results[0].count + " rows");

                            const q = conn.query(
                                "INSERT INTO entities (id, type, entity, created, updated) VALUES(?,?,?,?,?)",
                                [
                                    213,
                                    "hello",
                                    `{"${results[0].count + 1}": ${
                                        results[0].count + 1
                                    }}`,
                                    "2010-10-23 10:37:22",
                                    "2012-10-23 10:37:22",
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
                            console.log(q.sql);
                        }
                    );
                });
            });

            return products;
        },
    },
};

module.exports = resolvers;
