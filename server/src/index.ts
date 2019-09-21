import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './graphql/UserResolver';
import { createConnection } from 'typeorm';
import cookieparser from 'cookie-parser'
import { logger, verifyToken, generateToken } from './utils';
import { User } from './entity/User';

const port = process.env.PORT || 5000;
(async () => {
	const app = express();
	app.use(cookieparser())
	// token is only sent on refresh
	app.post('/refresh_token', async (req, res) => {

		const token = req.cookies.dolwhId
		if (!token){
			res.send({ok: false, accessToken: ''})
		}
		let payload: any = null
		try {
			payload = verifyToken(token)
		} catch (error) {
			console.log("TCL: error", error)
			res.send({ok: false, accessToken: ''})
			
		}

		const user = await User.findOne({userId: payload.userId});

		if (!user){
			res.send({ok: false, accessToken: ''})
		}

		if (user!.tokenVersion !== payload.tokenVersion){
			return res.send({ok: false, accessToken: ''})
		}

		return res.send({ok: false, accessToken: generateToken(user)})
	})

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [ UserResolver ],
		}),
		context: ({req, res})=> ({req, res})
	});

	await createConnection();

	apolloServer.applyMiddleware({ app });
	app.listen(port, () => logger.info(`Serving running on port ${port}`));
})();

