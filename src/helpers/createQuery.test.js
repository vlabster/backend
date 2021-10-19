const { prepareGueryGetEntities } = require("./createQuery");

describe.each([
    {
        expected: "SELECT HEX(id) as id, type, entity FROM entities WHERE id IN (UNHEX('43623F2F97B972A4A9DBA528DE29AB72'), UNHEX('4518987C5F048A708176A7AA4D641162'))",
        input: ["43623F2F97B972A4A9DBA528DE29AB72", "4518987C5F048A708176A7AA4D641162"],
        name: "optimistic test",
    },
    {
        expected: "SELECT HEX(id) as id, type, entity FROM entities WHERE id IN (UNHEX('45DBC0038CB7612A8C5BDAE24AA6FEA1'))",
        input: ["45DBC0038CB7612A8C5BDAE24AA6FEA1"],
        name: "with one item",
    },
    {
        expected: Error("No id"),
        input: [],
        name: "with empty",
    },
])("getEntities", ({ name, input, expected }) => {
    test(name, () => {
        expect(prepareGueryGetEntities(input)).toEqual(expected);
    });
});
