/* eslint-disable sort-keys */
const {
    ProvidedRequiredArgumentsOnDirectivesRule,
} = require("graphql/validation/rules/ProvidedRequiredArgumentsRule");
const { id2uuid, uuid2id } = require("../helpers/convertUuid");
const { prepareQueryWhereInIDs } = require("../helpers/prepareQuery");


const resolvers = {
    Mutation: {
        addEntity: async (_, data, { logger, db }) => {
            const entity = {
                id: uuid2id(data.id),
                type: data.type,
                entity: JSON.stringify(data.entity)
            };
            const r = await db.createEntity(entity);
            //logger.info(r);

            return true;
        },
        updateEntity: async (_, data, { logger, db }) => {
            const entity = {
                id: data.id,
                entity: JSON.stringify(data.entity)
            };
            const r = await db.updateEntity(entity);
            //logger.info(r);

            return true;
        },
        removeEntity: async (_, { id }, { db }) => {
            const r = await db.removeEntity(id);
            //logger.info(r);

            return true;
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
        getEntity: async (_, data, { logger, db }) => {
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
        searchProduct: async (_, data, { db }) => {
            if (data.title.length < 3) {
                return [];
            }

            const foundSuggests = await db.getSuggests(data);

            if (!foundSuggests.length) {
                return [];
            }

            const suggestIds = foundSuggests.map((entity) => entity.id);

            const getIDsWithX = prepareQueryWhereInIDs(suggestIds);
            const foundEntities = await db.getEntities(getIDsWithX);

            return foundEntities;
        },
    },
};

module.exports = resolvers;
