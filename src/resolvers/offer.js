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
        logger.error("failed to get folders", error);
    }
}

async function getOffersOfProduct(_, data, { logger, db }) {
    const subject = uuid2id(data.subject);
    if (subject === "") {
        return new Error("uuid is invalid");
    }

    try {
        const folder = await db.getEdge({
            predicate: data.predicate,
            subject,
        });

        return folder.map(fldr => fldr.object);
    } catch (error) {
        logger.error("failed to get from folder", error);
    }
}

async function addOffer(_, { input }, { logger, db }) {
    logger.info("OFFER: ", input);
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
        logger.error("failed to add folder", error);
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
        logger.error("failed to update folder", error);
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
        logger.error("failed to remove folder", error);
    }
}

async function moveOfferToProduct(_, { input }, { logger, db }) {
    const subject = uuid2id(input.subject);
    const object = uuid2id(input.object);

    // if (subject === "" || object === "") {
    //     return new Error("uuid is invalid");
    // }

    try {
        const rTriple = await db.createTriple({
            object: object,
            predicate: input.predicate,
            priority: input.priority,
            subject: subject,
        });

        return true;
    } catch (error) {
        logger.error("failed to move to folder", error);
    }
}

async function removeOfferFromProduct(_, data, { logger, db }) {
    const subject = uuid2id(data.subject);
    const object = uuid2id(data.object);
    if (subject === "") {
        return new Error("uuid is invalid");
    }

    try {
        const r = await db.removeTriple({
            object,
            predicate: data.predicate,
            subject,
        });

        return true;
    } catch (error) {
        logger.error("failed to remove from folder", error);
    }
}


module.exports = {
    addOffer,
    getOffers,
    getOffersOfProduct,
    moveOfferToProduct,
    removeOffer,
    removeOfferFromProduct,
    updateOffer,
};
