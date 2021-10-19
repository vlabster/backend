/* eslint-disable complexity */

function prepareQueryWhereInIDs(IDs) {

    if (!Array.isArray(IDs) || IDs.length === 0) {
        return new Error("failed to prepare the query, the ID array is empty");
    }

    return IDs.map(id => `UNHEX('${id}')`).join(", ");
}

module.exports = { prepareQueryWhereInIDs };
