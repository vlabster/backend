const { uuid2id } = require("../helpers/convertUuid");
const { prepareQueryWhereInIDs } = require("../helpers/prepareQuery");

async function getOffers(_, data, { logger, db }) {
    const ids = data.uuIds
        .map((uuid) => uuid2id(uuid))
        .filter((id) => id !== "");

    if (!ids.length) {
        return [];
    }

    try {
        const getIDsWithX = prepareQueryWhereInIDs(ids);
        const foundEntities = await db.getEntities(getIDsWithX);
        return foundEntities.map((ent) => JSON.parse(ent.entity));
    } catch (error) {
        logger.error("failed to get offers", error);
    }
}

async function getOffersOfProduct(_, data, { logger, db }) {
    const subject = uuid2id(data.subject);
    if (subject === "") {
        return new Error("uuid is invalid");
    }

    try {
        const edges = await db.getEdge({
            predicate: "predicate.offer",
            subject,
        });

        return edges.map(({ object }) => object);
    } catch (error) {
        logger.error("failed to get offers for product", error);
    }
}

async function addOffer(_, { input }, { logger, db }) {
    const id = uuid2id(input.id);
    if (id === "") {
        return new Error("uuid is invalid");
    }

    try {
        const r = await db.createEntity({
            entity: JSON.stringify(input),
            id: id,
            type: "ru.webrx.offer",
        });

        return true;
    } catch (error) {
        logger.error("failed to add offer", error);
    }
}

async function updateOffer(_, data, { logger, db }) {
    const id = uuid2id(data.id);
    if (id === "") {
        return new Error("uuid is invalid");
    }

    try {
        const r = await db.updateEntity({
            entity: JSON.stringify(data.input),
            id: id,
        });

        return true;
    } catch (error) {
        logger.error("failed to update offer", error);
    }
}

async function removeOffer(_, data, { logger, db }) {
    const id = uuid2id(data.id);
    if (id === "") {
        return new Error("uuid is invalid");
    }
    try {
        const r = await db.removeEntity(id);

        return true;
    } catch (error) {
        logger.error("failed to remove offer", error);
    }
}

async function moveProductToOffer(_, { input }, { logger, db }) {
    const subject = uuid2id(input.subject);
    const object = uuid2id(input.object);

    // if (subject === "" || object === "") {
    //     return new Error("uuid is invalid");
    // }

    try {
        const rTriple = await db.createTriple({
            object: object,
            predicate: "predicate.offer",
            priority: input.priority,
            subject: subject,
        });

        return true;
    } catch (error) {
        logger.error("failed to move to offer", error);
    }
}

async function removeProductFromOffer(_, { input }, { logger, db }) {
    const subject = uuid2id(input.subject);
    const object = uuid2id(input.object);
    if (subject === "") {
        return new Error("uuid is invalid");
    }

    try {
        const r = await db.removeTriple({
            object,
            predicate: "predicate.offer",
            subject,
        });

        return true;
    } catch (error) {
        logger.error("failed to remove from offer", error);
    }
}


module.exports = {
    addOffer,
    getOffers,
    getOffersOfProduct,
    moveProductToOffer,
    removeOffer,
    removeProductFromOffer,
    updateOffer,
};
