/* eslint-disable complexity */

const errIDsIsEmpty = new Error("failed to prepare the query, the ID array is empty");

function prepareQueryWhereInIDs(IDs) {

    if (!Array.isArray(IDs) || IDs.length === 0) {
        return errIDsIsEmpty;
    }

    return IDs.map(id => `UNHEX('${id}')`).join(", ");
}

module.exports = { errIDsIsEmpty, prepareQueryWhereInIDs };
