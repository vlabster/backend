const {
    ProvidedRequiredArgumentsOnDirectivesRule,
} = require("graphql/validation/rules/ProvidedRequiredArgumentsRule");
const { id2uuid, uuid2id } = require("../helpers/convertUuid");

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

const resolvers = {
    Mutation: {
        addEntity: async (_, data, { logger, db }) => {
            const r = db.createEntity(data);
            //logger.info(r);

            return true;
        },
        restoreEntity: async (_, thisEntity, { db }) => {
            const res = await new Promise((resolve, reject) => {
                db.getConnection(function (err, conn) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    conn.query(
                        "UPDATE entities SET deleted = ? WHERE id = UNHEX(?)",
                        [0, uuid2id(thisEntity.id)],
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
                        [1, uuid2id(thisEntity.id)],
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
        addTriple: async (_, data, { db }) => {
            const res = await db.createTriple({
                subject: uuid2id(data.subject),
                predicate: data.predicate,
                object: uuid2id(data.object),
                priority: data.priority
            });

            return res;
        },
        updateTriple: async (_, data, { db }) => {
            const res = await db.updateTriple(data);

            return res;
        },
        removeTriple: async (_, data, { db }) => {
            const res = await db.removeTriple(data);

            return res;
        },
        addProduct: async (_, { input }, { logger, db }) => {
            const rEntity = db.createEntity({
                id: uuid2id(input.id),
                type: "ru.webrx.product",
                entity: JSON.stringify({ title: input.title, description: input.description }),
            });
            const rSuggest = db.addSuggest({
                id: uuid2id(input.id),
                source: input.title,
                type: "ru.webrx.product"
            });

            //logger.info(r);

            return true;
        },
    },
    Query: {
        searchEntity: async (_, data, { logger, db }) => {
            const res = await db.getEntity(data);
            return {
                id: res.id,
                type: res.type,
                entity: res.entity,
                created: "a",
                updated: "a",
                deleted: 0,
            };
        },
        allEntities: async (_, o, { db }) => {
            const res = await db.getAllEntities();

            return res;
        },
        allTriples: async (_, o, { db }) => {
            const res = await db.getAllTriples();

            return res;
        },
        allProducts: async (_, o, { db }) => {
            const res = await db.getAllProducts();

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
