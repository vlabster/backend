/* eslint-disable sort-keys */
const {
    ProvidedRequiredArgumentsOnDirectivesRule,
} = require("graphql/validation/rules/ProvidedRequiredArgumentsRule");
const { id2uuid, uuid2id } = require("../helpers/convertUuid");
const { prepareQueryWhereInIDs } = require("../helpers/prepareQuery");


const resolvers = {
    Mutation: {
        addProduct: async (_, { input }, { logger, db }) => {
            const id = uuid2id(input.id);
            if (id === "") {
                return new Error("uuid is invalid");
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
                logger.error("failed to add product", error);
                return;
            }
        },
        updateProduct: async (_, data, { logger, db }) => {
            const id = uuid2id(data.id);
            if (id === "") {
                return new Error("uuid is invalid");
            }

            try {
                const r = await db.updateEntity({
                    id: id,
                    entity: JSON.stringify(data.input),
                });

                return true;
            } catch (error) {
                logger.error("failed to update product", error);
                return;
            }
        },
        removeProduct: async (_, data, { logger, db }) => {
            const id = uuid2id(data.id);
            if (id === "") {
                return new Error("uuid is invalid");
            }

            try {
                const r = await db.removeEntity(id);

                return true;
            } catch (error) {
                logger.error("failed to remove product", error);
                return;
            }
        },

        moveToFolder: async (_, { input }, { logger, db }) => {
            const subject = uuid2id(input.subject);
            const object = uuid2id(input.object);

            // if (subject === "" || object === "") {
            //     return new Error("uuid is invalid");
            // }

            try {
                const rTriple = await db.createTriple({
                    subject: subject,
                    predicate: input.predicate,
                    object: object,
                    priority: input.priority
                });

                return true;
            } catch (error) {
                logger.error("failed to move to folder", error);
                return;
            }
        },
        removeFromFolder: async (_, data, { logger, db }) => {
            const subject = uuid2id(data.subject);
            const object = uuid2id(data.object);
            if (subject === "") {
                return new Error("uuid is invalid");
            }

            try {
                const r = await db.removeTriple(subject, object);

                return true;
            } catch (error) {
                logger.error("failed to remove from folder", error);
                return;
            }
        },

        addFolder: async (_, { input }, { logger, db }) => {
            const id = uuid2id(input.id);
            if (id === "") {
                return new Error("uuid is invalid");
            }

            try {
                const r = await db.createEntity({
                    id: id,
                    type: "ru.webrx.folder",
                    entity: JSON.stringify(input),
                });

                return true;
            } catch (error) {
                logger.error("failed to add folder", error);
                return;
            }
        },
        updateFolder: async (_, data, { logger, db }) => {
            const id = uuid2id(data.id);
            if (id === "") {
                return new Error("uuid is invalid");
            }

            try {
                const r = await db.updateEntity({
                    id: id,
                    entity: JSON.stringify(data.input),
                });

                return true;
            } catch (error) {
                logger.error("failed to update folder", error);
                return;
            }
        },
        removeFolder: async (_, data, { logger, db }) => {
            const id = uuid2id(data.id);
            if (id === "") {
                return new Error("uuid is invalid");
            }
            try {
                const r = await db.removeEntity(id);

                return true;
            } catch (error) {
                logger.error("failed to remove folder", error);
                return;
            }
        },

        addVendor: async (_, { input }, { logger, db }) => {
            const id = uuid2id(input.id);
            if (id === "") {
                return new Error("uuid is invalid");
            }
            try {
                const r = await db.createEntity({
                    id: id,
                    type: "ru.webrx.vendor",
                    entity: JSON.stringify(input),
                });

                return true;
            } catch (error) {
                logger.error("failed to add vendor", error);
                return;
            }
        },
    },
    Query: {
        getAllSuggests: async (_, o, { logger, db }) => {
            try {
                const res = await db.getAllSuggests();

                return res;
            } catch (error) {
                logger.error("failed to get all suggests", error);
                return;
            }

        },
        getProducts: async (_, data, { logger, db }) => {
            const ids = data.uuIds
                .map((uuid) => uuid2id(uuid))
                .filter((id) => id !== "");

            if (!ids.length) {
                return [];
            }

            try {
                const getIDsWithX = prepareQueryWhereInIDs(ids);
                const foundEntities = await db.getEntities(getIDsWithX);

                const result = foundEntities.map((ent) => JSON.parse(ent.entity));
                return result;
            } catch (error) {
                logger.error("failed to get products", error);
                return;
            }
        },
        // eslint-disable-next-line complexity
        searchProduct: async (_, data, { logger, db }) => {
            if (data.title.length < 3) {
                return [];
            }

            try {
                const foundSuggests = await db.getSuggests(data);

                if (!foundSuggests.length) {
                    return [];
                }

                const suggestIds = foundSuggests.map((entity) => entity.id);
                const getIDsWithX = prepareQueryWhereInIDs(suggestIds);
                const foundEntities = await db.getEntities(getIDsWithX);

                const result = foundEntities.map((ent) => JSON.parse(ent.entity));
                return result;
            } catch (error) {
                logger.error("failed to search product", error);
                return;
            }
        },
        getFolders: async (_, data, { logger, db }) => {
            const ids = data.uuIds
                .map((uuid) => uuid2id(uuid))
                .filter((id) => id !== "");

            if (!ids.length) {
                return [];
            }

            try {
                const getIDsWithX = prepareQueryWhereInIDs(ids);
                const foundEntities = await db.getEntities(getIDsWithX);

                const result = foundEntities.map((ent) => JSON.parse(ent.entity));
                return result;
            } catch (error) {
                logger.error("failed to get folders", error);
                return;
            }
        },
        getFromFolder: async (_, data, { logger, db }) => {
            const subject = uuid2id(data.subject);
            if (subject === "") {
                return new Error("uuid is invalid");
            }

            try {
                const folder = await db.getEdge({subject, predicate: data.predicate});

                return folder.map(fldr => fldr.object);
            } catch (error) {
                logger.error("failed to get from folder", error);
                return;
            }
        },
    },
};

module.exports = resolvers;
