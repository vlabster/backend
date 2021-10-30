const { uuid2id } = require("../helpers/convertUuid");


async function addVendor(_, { input }, { logger, db }) {
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
}

module.exports = {
    addVendor,
};
