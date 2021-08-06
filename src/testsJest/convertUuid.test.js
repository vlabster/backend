const { id2uuid, uuid2id } = require("../helpers/convertUuid");

describe("convert functions id2uuid uuid2id", () => {
    const id = "58e0a7d7-eebc-11d8-9669-0800200c9a66";
    const uuid = "11d8eebc58e0a7d796690800200c9a66";

    describe("converting id2uuid", () => {
        it("convert id to uuid", () => {
            expect(id2uuid(id)).toBe(uuid);
        });
        it("convert empty to uuid", () => {
            expect(() => id2uuid("")).toThrowError("NOT_STRING_OR_LENGTH");
        });
        it("convert obj to uuid", () => {
            expect(() => id2uuid({ id: "1234-5678-qwer" })).toThrowError(
                "NOT_STRING_OR_LENGTH"
            );
        });
    });
    
    describe("converting uuid2id", () => {
        it("convert uuid to id", () => {
            expect(uuid2id(uuid)).toBe(id);
        });
        it("convert empty to id", () => {
            expect(() => uuid2id("")).toThrowError("NOT_STRING_OR_LENGTH");
        });
        it("convert obj to id", () => {
            expect(() => uuid2id({ id: "1234-5678-qwer" })).toThrowError(
                "NOT_STRING_OR_LENGTH"
            );
        });
    });
    
    describe("convert id2uuid2id", () => {
        it("convert id2uuid2id", () => {
            const actual = id2uuid(id);
    
            expect(uuid2id(actual)).toBe(id);
        });
    });
});
