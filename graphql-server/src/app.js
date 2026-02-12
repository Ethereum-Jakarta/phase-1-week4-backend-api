const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { userSchema, postSchema } = require("./graphql/schema/index");
const { User, Post } = require("./graphql/resolvers/index");

const app = express(),
	PORT = 5000;

app.use(
	"/users",
	graphqlHTTP({
		schema: userSchema,
		rootValue: User,
		graphiql: true,
	})
);

app.use(
	"/posts",
	graphqlHTTP({
		schema: postSchema,
		rootValue: Post,
		graphiql: true,
	})
);

module.exports = { app, PORT };
