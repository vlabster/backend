/* eslint-disable sort-keys */
const {
    ProvidedRequiredArgumentsOnDirectivesRule,
} = require("graphql/validation/rules/ProvidedRequiredArgumentsRule");
const {
    addFolder, updateFolder, removeFolder, getFolders,
    getFromFolder, moveToFolder, removeFromFolder
} = require("./folder");

const {
    addOffer, updateOffer, removeOffer,
    moveProductToOffer, removeProductFromOffer,
    getOffers, getOffersOfProduct, getOffersOfProductById
} = require("./offer");

const {
    getProducts, searchProduct, addProduct,
    updateProduct, removeProduct
} = require("./product");

const { addVendor } = require("./vendor");

const resolvers = {
    Mutation: {
        addProduct: addProduct,
        updateProduct: updateProduct,
        removeProduct: removeProduct,

        addOffer: addOffer,
        updateOffer: updateOffer,
        removeOffer: removeOffer,

        moveProductToOffer: moveProductToOffer,
        removeProductFromOffer: removeProductFromOffer,

        addFolder: addFolder,
        updateFolder: updateFolder,
        removeFolder: removeFolder,

        moveToFolder: moveToFolder,
        removeFromFolder: removeFromFolder,

        addVendor: addVendor,
    },
    Query: {
        getAllSuggests: async (_, o, { logger, db }) => {
            try {
                const res = await db.getAllSuggests();

                return res;
            } catch (error) {
                logger.error("failed to get all suggests", error);
            }

        },
        getProducts: getProducts,
        searchProduct: searchProduct,

        getOffers: getOffers,
        getOffersOfProduct: getOffersOfProduct,

        getOffersOfProductById: getOffersOfProductById,

        getFolders: getFolders,
        getFromFolder: getFromFolder,
    },
};

module.exports = resolvers;
