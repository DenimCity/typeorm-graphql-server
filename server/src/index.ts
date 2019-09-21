import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './graphql/UserResolver';
import { createConnection } from 'typeorm';
import { logger } from './utils';

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
	app.listen(port, () => logger.info(`Serving running on port ${port}`));
})();

