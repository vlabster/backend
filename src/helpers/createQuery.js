/* eslint-disable complexity */

function prepareGueryGetEntities(arrOfId) {

    if (!arrOfId || !arrOfId.length) {
        return new Error("No id");
    }

    const withUnhex = arrOfId.map(id => {
        return "UNHEX('" + id + "')";
    }).join(", ");

    return "SELECT HEX(id) as id, type, entity FROM entities WHERE id IN (" + withUnhex + ")";
}

module.exports = { prepareGueryGetEntities };
