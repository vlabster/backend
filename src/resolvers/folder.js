const { uuid2id } = require("../helpers/convertUuid");
const { prepareQueryWhereInIDs } = require("../helpers/prepareQuery");

async function getFolders(_, data, { logger, db }) {
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

async function getFromFolder(_, data, { logger, db }) {
    const subject = uuid2id(data.subject);
    if (subject === "") {
        return new Error("uuid is invalid");
    }

    try {
        const edges = await db.getEdge({
            predicate: "predicate.folder",
            subject,
        });

        return edges.map(({ object }) => object);
    } catch (error) {
        logger.error("failed to get from folder", error);
    }
}

async function addFolder(_, { input }, { logger, db }) {
    const id = uuid2id(input.id);
    if (id === "") {
        return new Error("uuid is invalid");
    }

    try {
        const r = await db.createEntity({
            entity: JSON.stringify(input),
            id: id,
            type: "ru.webrx.folder",
        });

        return true;
    } catch (error) {
        logger.error("failed to add folder", error);
    }
}

async function updateFolder(_, data, { logger, db }) {
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

async function removeFolder(_, data, { logger, db }) {
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

async function moveToFolder(_, { input }, { logger, db }) {
    const subject = uuid2id(input.subject);
    const object = uuid2id(input.object);

    // if (subject === "" || object === "") {
    //     return new Error("uuid is invalid");
    // }

    try {
        const rTriple = await db.createTriple({
            object: object,
            predicate: "predicate.folder",
            priority: input.priority,
            subject: subject,
        });

        return true;
    } catch (error) {
        logger.error("failed to move to folder", error);
    }
}

async function removeFromFolder(_, { input }, { logger, db }) {
    const subject = uuid2id(input.subject);
    const object = uuid2id(input.object);
    if (subject === "") {
        return new Error("uuid is invalid");
    }

    try {
        const r = await db.removeTriple({
            object,
            predicate: "predicate.folder",
            subject,
        });

        return true;
    } catch (error) {
        logger.error("failed to remove from folder", error);
    }
}


module.exports = {
    addFolder,
    getFolders,
    getFromFolder,
    moveToFolder,
    removeFolder,
    removeFromFolder,
    updateFolder,
};
