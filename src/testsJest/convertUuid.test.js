const { id2uuid, uuid2id } = require("../helpers/convertUuid");

describe("convert id2uuid2id", () => {
    
    const id = "58e0a7d7-eebc-11d8-9669-0800200c9a66";
    const uuid = "11d8eebc58e0a7d796690800200c9a66";
    it("convert id to uuid", () => {
        expect(id2uuid(id)).toBe(uuid);
    });
    it("convert uuid to id", () => {
        expect(uuid2id(uuid)).toBe(id);
    });
    it("convert id2uuid2id", () => {
        const actual = id2uuid(id);

        expect(uuid2id(actual)).toBe(id)
    })

    it("convert empty to uuid", () => {
        expect(() => id2uuid("")).toThrowError("NOT_STRING_OR_LENGTH");
    });
    it("convert empty to id", () => {
        expect(() => uuid2id("")).toThrowError("NOT_STRING_OR_LENGTH");
    });
    it("convert obj to uuid", () => {
        expect(() => id2uuid({"id": "1234-5678-qwer"})).toThrowError("NOT_STRING_OR_LENGTH");
    });
    it("convert obj to uuid", () => {
        expect(() => uuid2id({"id": "1234-5678-qwer"})).toThrowError("NOT_STRING_OR_LENGTH");
    });
})


/* describe("Encode html2json", () => {
    it("encode title with text", () => {
        const html2json = [
            {
                node: "title",
                value: {
                    text: "Main page",
                },
            },
        ];

        const actual = encode(html2json);

        const { container } = render(actual[0]);
        expect(container.innerHTML).toEqual(`<title>Main page</title>`);
    });

    it("encode node with one attribute", () => {
        const html2json = [
            {
                node: "div",
                attrs: [
                    {
                        name: "attr1",
                        value: "val1",
                    },
                ],
            },
        ];

        const actual = encode(html2json);

        const { container } = render(actual[0]);
        expect(container.innerHTML).toEqual(`<div attr1=\"val1\"></div>`);
    });
}); */
