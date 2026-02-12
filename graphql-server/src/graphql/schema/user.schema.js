const { buildSchema } = require("graphql");

const userSchema = buildSchema(`
    type User {
        id: ID!,
        name: String!,
        username: String!,
        email: String!
    }

    input UserInput {
        name: String!,
        username: String!,
        email: String!
    }

    type Query {
        users: [User!]
    }

    type Mutation {
        createUser(input: UserInput): User
    }

    schema {
        query: Query,
        mutation: Mutation
    }
`);

module.exports = userSchema