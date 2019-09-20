import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './graphql/UserResolver';
import { createConnection } from 'typeorm';

const port = process.env.PORT || 5000;
(async () => {
	const app = express();
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [ UserResolver ],
		}),
	});

	await createConnection();

	apolloServer.applyMiddleware({ app });
	app.listen(port, () => console.log(`Serving running on port ${port}`));
})();
// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
