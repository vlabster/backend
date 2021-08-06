/* eslint-disable no-magic-numbers */

//58e0a7d7-eebc-11d8-9669-0800200c9a66 => 11d8eebc58e0a7d796690800200c9a66

function id2uuid(uuid) {
    if (typeof uuid === "string" && uuid.length === 36) {
        const first = uuid.slice(0, 8);
        const second = uuid.slice(9, 13);
        const third = uuid.slice(14, 18);
        const fourth = uuid.slice(19, 23);
        const other = uuid.slice(24);

        return third + second + first + fourth + other;
    } else {
        return "";
    }
}

// 11d8eebc58e0a7d796690800200c9a66 => 58e0a7d7-eebc-11d8-9669-0800200c9a66

function uuid2id(uuid) {
    if (typeof uuid === "string" && uuid.length === 32) {
        const first = uuid.slice(0, 4);
        const second = uuid.slice(4, 8);
        const third = uuid.slice(8, 16);
        const fourth = uuid.slice(16, 20);
        const other = uuid.slice(20);

        return third + "-" + second + "-" + first + "-" + fourth + "-" + other;
    } else {
        return "";
    }
}

module.exports = { id2uuid, uuid2id };
