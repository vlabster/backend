/* eslint-disable complexity */
/* eslint-disable no-magic-numbers */

//58e0a7d7-eebc-11d8-9669-0800200c9a66 => 11d8eebc58e0a7d796690800200c9a66
function uuid2id(v) {
    if (typeof v !== "string" || v.length !== 36) {
        return "";
    }

    const time_low = v.slice(0, 8);
    const time_mid = v.slice(9, 13);
    const time_hi = v.slice(14, 18);
    const clock_seq_hi = v.slice(19, 23);
    const node = v.slice(24);

    return time_hi + time_mid + time_low + clock_seq_hi + node;
}

// 11d8eebc58e0a7d796690800200c9a66 => 58e0a7d7-eebc-11d8-9669-0800200c9a66
function id2uuid(v) {
    if (typeof v !== "string" || v.length !== 32) {
        return "";
    }

    const time_low = v.slice(0, 4);
    const time_mid = v.slice(4, 8);
    const time_hi = v.slice(8, 16);
    const clock_seq_hi = v.slice(16, 20);
    const node = v.slice(20);

    return time_hi + "-" + time_mid + "-" + time_low + "-" + clock_seq_hi + "-" + node;
}

module.exports = { id2uuid, uuid2id };
