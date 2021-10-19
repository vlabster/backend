const { errIDsIsEmpty, prepareQueryWhereInIDs } = require("./prepareQuery");

describe.each([
    {
        expected: "UNHEX('43623F2F97B972A4A9DBA528DE29AB72'), UNHEX('4518987C5F048A708176A7AA4D641162')",
        input: ["43623F2F97B972A4A9DBA528DE29AB72", "4518987C5F048A708176A7AA4D641162"],
        name: "optimistic test",
    },
    {
        expected: "UNHEX('45DBC0038CB7612A8C5BDAE24AA6FEA1')",
        input: ["45DBC0038CB7612A8C5BDAE24AA6FEA1"],
        name: "with one item",
    },
    {
        expected: errIDsIsEmpty,
        input: [],
        name: "with empty",
    },
])("getEntities", ({ name, input, expected }) => {
    test(name, () => {
        expect(prepareQueryWhereInIDs(input)).toEqual(expected);
    });
});
