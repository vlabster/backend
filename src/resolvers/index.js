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
                console.log("ERROR: ", error);
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
                console.log("ERROR: ", error);
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
                console.log("ERROR: ", error);
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
                console.log("ERROR: ", error);
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
                console.log("ERROR: ", error);
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
                console.log("ERROR: ", error);
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
                console.log("ERROR: ", error);
                return;
            }
        },
    },
    Query: {
        allProducts: async (_, o, { db }) => {
            const res = await db.getAllProducts();

            return res;
        },
        getProducts: async (_, data, { db }) => {
            const ids = data.uuIds
                .map((uuid) => uuid2id(uuid))
                .filter((id) => id !== "");

            if (!ids.length) {
                return [];
            }

            const getIDsWithX = prepareQueryWhereInIDs(ids);
            const foundEntities = await db.getEntities(getIDsWithX);

            const result = foundEntities.map((ent) => JSON.parse(ent.entity));

            return result;
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

            const result = foundEntities.map((ent) => JSON.parse(ent.entity));

            return result;
        },
        getFolders: async (_, data, { db }) => {
            const ids = data.uuIds
                .map((uuid) => uuid2id(uuid))
                .filter((id) => id !== "");

            if (!ids.length) {
                return [];
            }

            const getIDsWithX = prepareQueryWhereInIDs(ids);
            const foundEntities = await db.getEntities(getIDsWithX);

            const result = foundEntities.map((ent) => JSON.parse(ent.entity));

            return result;
        },
    },
};

module.exports = resolvers;
