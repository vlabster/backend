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
