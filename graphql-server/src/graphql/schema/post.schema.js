const { buildSchema } = require("graphql");

const postSchema = buildSchema(`
    type Post {
        id: ID!,
        title: String!,
        content: String!,
        userId: String!
    }

    input PostInput {
        title: String!,
        content: String!,
        userId: String!
    }

    type Query {
        posts: [Post!]
    }

    type Mutation {
        createPost(input: PostInput): Post
    }

    schema {
        query: Query,
        mutation: Mutation
    }
`);

module.exports = postSchema