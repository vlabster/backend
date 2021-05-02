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

const products = [
    {
        id: 1,
        shortName: "АЦЦ",
        fullName: "Ацетилсалициловая кислота"
    },
    {
        id: 2,
        shortName: "АЦЦ2",
        fullName: "Ацетилсалициловая кислота2"
    }
];

const resolvers = {
    Query: {
        books: async (_, o, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function(err, conn) {
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
                db.getConnection(function(err, conn) {
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


        // Эти резолверы сделал чтоб проверить как работает

        addProduct: (input) => {
            products.push(input);
            return products;
        },


        getAllProduct: () =>{
            return products;
        },




        // Этот скопировал из entities (пока не понял как с базой общаться)

        products: async (_, o, { db })=>{
            const res = await new Promise((resolve,reject)=>{
                db.getConnection(function(err,conn){
                    if(err) {
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


    },
};

module.exports = resolvers;
