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
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const newProduct = { id, title };
                    products.push(newProduct);
                    conn.query(
                        "INSERT INTO entities VALUES ?",
                        {
                            id: 213,
                            type: "hello",
                            entity: '{"3": 3}',
                            created: "2010-10-23 10:37:22",
                            updated: "2012-10-23 10:37:22",
                            deleted: 0,
                        },
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

            return products;
        },
    },
};

module.exports = resolvers;
