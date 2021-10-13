/* eslint-disable complexity */
/* eslint-disable sort-keys */
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
            const r = await db.createEntity(data);
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
            const id = uuid2id(input.id);
            if (id === "") {
                return;
            }

            try {
                const rEntity = await db.createEntity({
                    id: id,
                    type: "ru.webrx.product",
                    entity: JSON.stringify({
                        id: id,
                        title: input.title,
                        description: input.description,
                    }),
                });
                const rSuggest = await db.addSuggest({
                    id: id,
                    source: input.title,
                    type: "ru.webrx.product"
                });

                return true;
            } catch (error) {
                console.log("ERROR: ", error);
                return;
            }
        },
        addFolder: async (_, { input }, { logger, db }) => {
            const id = uuid2id(input.id);
            if (id === "") {
                return;
            }

            try {
                const r = await db.createEntity({
                    id: id,
                    type: "ru.webrx.folder",
                    entity: JSON.stringify(input),
                });

                return true;
            } catch (error) {
                console.log("ERROR: ", error);
                return;
            }
        },
        addVendor: async (_, { input }, { logger, db }) => {
            const id = uuid2id(input.id);
            if (id === "") {
                return;
            }
            try {
                const r = await db.createEntity({
                    id: id,
                    type: "ru.webrx.vendor",
                    entity: JSON.stringify(input),
                });

                return true;
            } catch (error) {
                console.log("ERROR: ", error);
                return;
            }
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
        // product(parent, args, context, info) {
        //     return products.filter(
        //         (product) =>
        //             args.title.length > 2 &&
        //             product.title
        //                 .toLowerCase()
        //                 .indexOf(args.title.toLowerCase()) > -1
        //     );
        // },
        searchProduct: async (_, data, { db }) => {
            const foundSuggests = await db.getSuggests(data);

            // const suggestIds = foundSuggests.map((entity) => entity.id);
            // -> ["43623F2F97B972A4A9DBA528DE29AB72", "4518987C5F048A708176A7AA4D641162"];
            // const foundEntitiesById = await db.getEntitiesByArrOfId(arrId);
            // -> []

            const foundEntities = await Promise.all(
                foundSuggests.map(async (entity) => {
                    const rEnt = await db.getEntity(entity);
                    return JSON.parse(rEnt.entity);
                })
            );

            return foundEntities;
        },
    },
};

module.exports = resolvers;
