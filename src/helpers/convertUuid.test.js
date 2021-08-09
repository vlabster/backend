const { id2uuid, uuid2id } = require("./convertUuid");

describe.each([
    {
        name: "optimistic test",
        input: "58e0a7d7-eebc-11d8-9669-0800200c9a66",
        expected: "11d8eebc58e0a7d796690800200c9a66",
    },
    {
        name: "put empty string returns empty string",
        input: "",
        expected: "",
    },
    {
        name: "put number returns empty string",
        input: 1234567890,
        expected: "",
    },
    {
        name: "put array with length 36 returns empty string",
        input: new Array(36),
        expected: "",
    },
])("convert uuid to id", ({ name, input, expected }) => {
    test(name, () => {
        expect(uuid2id(input)).toEqual(expected);
    });
});

describe.each([
    {
        name: "optimistic test",
        input: "11d8eebc58e0a7d796690800200c9a66",
        expected: "58e0a7d7-eebc-11d8-9669-0800200c9a66",
    },
    {
        name: "put empty string returns empty string",
        input: "",
        expected: "",
    },
    {
        name: "put number returns empty string",
        input: 1234567890,
        expected: "",
    },
    {
        name: "put array with length 32 returns empty string",
        input: new Array(32),
        expected: "",
    },
])("convert id to uuid", ({ name, input, expected }) => {
    test(name, () => {
        expect(id2uuid(input)).toEqual(expected);
    });
});
