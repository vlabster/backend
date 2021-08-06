const { id2uuid, uuid2id } = require("./convertUuid");

describe("convert id2uuid uuid2id", () => {
    describe.each([
        {
            input: "58e0a7d7-eebc-11d8-9669-0800200c9a66",
            expected: "11d8eebc58e0a7d796690800200c9a66",
        },
        { input: "", expected: "" },
        { input: 1234567890, expected: "" },
    ])("convert id to uuid", ({ input, expected }) => {
        it(`convert ${input} to uuid`, () => {
            expect(id2uuid(input)).toEqual(expected);
        });
    });
    describe.each([
        {
            input: "11d8eebc58e0a7d796690800200c9a66",
            expected: "58e0a7d7-eebc-11d8-9669-0800200c9a66",
        },
        { input: "", expected: "" },
        { input: 1234567890, expected: "" },
    ])("convert uuid to id", ({ input, expected }) => {
        it(`convert ${input} to id`, () => {
            expect(uuid2id(input)).toEqual(expected);
        });
    });

    const id = "58e0a7d7-eebc-11d8-9669-0800200c9a66";
    //const uuid = "11d8eebc58e0a7d796690800200c9a66";
    describe("convert id2uuid2id", () => {
        it("converting id2uuid2id", () => {
            const actual = id2uuid(id);

            expect(uuid2id(actual)).toEqual(id);
        });
    });
});
