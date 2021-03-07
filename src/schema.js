const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type Product {
        id: ID
        title: String
        price: Int 
    }

    type Medications {
        medications: [Product]
    }

    type Query {
        getAllMedications: [Product]
        
    }
`);

module.exports = schema;
