/* eslint-disable no-magic-numbers */

//58e0a7d7-eebc-11d8-9669-0800200c9a66 => 11d8eebc58e0a7d796690800200c9a66
function uuid2id(v) {
    if (typeof v !== "string" || v.length !== 36) {
        return "";
    }

    const first = v.slice(0, 8);
    const second = v.slice(9, 13);
    const third = v.slice(14, 18);
    const fourth = v.slice(19, 23);
    const other = v.slice(24);

    return third + second + first + fourth + other;
}

// 11d8eebc58e0a7d796690800200c9a66 => 58e0a7d7-eebc-11d8-9669-0800200c9a66
function id2uuid(v) {
    if (typeof v !== "string" || v.length !== 32) {
        return "";
    }

    const first = v.slice(0, 4);
    const second = v.slice(4, 8);
    const third = v.slice(8, 16);
    const fourth = v.slice(16, 20);
    const other = v.slice(20);

    return third + "-" + second + "-" + first + "-" + fourth + "-" + other;
}

module.exports = { id2uuid, uuid2id };
