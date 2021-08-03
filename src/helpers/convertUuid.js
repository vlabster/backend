/* eslint-disable no-magic-numbers */

//58e0a7d7-eebc-11d8-9669-0800200c9a66 => 11d8-eebc-58e0a7d7-96690800200c9a66

function id2uuid(uuid) {
    const first = uuid.slice(0, 9);

    const second = uuid.slice(9, 14);

    const third = uuid.slice(14, 19);

    const fourth = uuid.slice(19, 23);

    const other = uuid.slice(24);

    return third + second + first + fourth + other;
}

// 11d8-eebc-58e0a7d7-96690800200c9a66 => 58e0a7d7-eebc-11d8-9669-0800200c9a66

function uuid2id(uuid) {
    const first = uuid.slice(0, 5);

    const second = uuid.slice(5, 10);

    const third = uuid.slice(10, 19);

    const fourth = uuid.slice(19, 23);

    const other = uuid.slice(23);

    return third + second + first + fourth + "-" + other;
}

module.exports = { id2uuid, uuid2id };