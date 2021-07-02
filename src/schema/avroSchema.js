const avro = require("avro-js");

const Merchandise = avro.parse({
    status: "string",
    identifiers: [
        { id: "string" },
        { barcode: "string" },
        { article: "string" },
    ],
    naming: "string",
    fundamentalUnits: [
        {
            attributes: {
                codeKey: "string",
                fullNaming: "string",
                WorldAbbreviation: "string",
                ShortNaming: "string",
            },
            conversions: {
                unit: "string",
                coefficient: "string",
                additionalInformations: {
                    valueTags: {
                        naming: "string",
                        value: "string",
                    },
                },
            },
        },
    ],
    idProductCounterparty: "string",
});
