// Fastify
import Fastify from 'fastify';
import fastifyEnv from 'fastify-env';
import fastifyMongodb from 'fastify-mongodb'

import { routes as courseRoutes } from './app/routes/v1/course-routes.mjs'
import { routes as userRoutes } from './app/routes/v1/user-routes.mjs';

// eslint-disable-next-line new-cap
const app = Fastify({
	logger: true,
});

const schema = {
	type: 'object',
	required: ['DB_NAME', 'DB_PASSWORD', 'DB_USERNAME', 'PORT'],
	properties: {
		DB_NAME: {
			type: 'string',
		},
		DB_PASSWORD: {
			type: 'string',
		},
		DB_USERNAME: {
			type: 'string',
		},
		PORT: {
			type: 'string',
			default: 3300,
		},
	},
};
// 		CLIENT_ID: {
// 			type: 'string',
// 		},
// 		COOKIE_SECRET: {
// 			type: 'string',
// 		},

// 		JWT_ALGORITHM: {
// 			type: 'string',
// 		},
// 		JWT_AUDIENCE: {
// 			type: 'string',
// 		},
// 		JWT_ISSUER: {
// 			type: 'string',
// 		},
// 		JWT_PRIVATE_KEY_PEM_FILE: {
// 			type: 'string',
// 		},
// 		JWT_PUBLIC_KEY_PEM_FILE: {
// 			type: 'string',
// 		},

// 		RT_AUDIENCE: {
// 			type: 'string',
// 		},
// 		RT_PRIVATE_KEY_PEM_FILE: {
// 			type: 'string',
// 		},
// 		RT_PUBLIC_KEY_PEM_FILE: {
// 			type: 'string',
// 		},


const options = {
	confKey: 'config',
	schema,
	dotenv: true,
	data: process.env,
};

const initialize = async () => {
	app.register(fastifyEnv, options);
	await app.after();

// 	// !TODO: Fix this before deploy to enable cors on production server
// 	app.register(require('fastify-cors'), {
// 		origin: '*',
// 	});

	// Database
	// Connection URL
	const dbName = encodeURIComponent(app.config.DB_NAME);
	const username = encodeURIComponent(app.config.DB_USERNAME);
	const password = encodeURIComponent(app.config.DB_PASSWORD);

	const url = `mongodb://${username}:${password}@localhost:27017/${dbName}`;

	app.register(fastifyMongodb, {
		forceClose: true,
		url,
		useUnifiedTopology: true,
	});

// 	// Register the routes

// 	app.register(require('./app/routes/v1/authRoutes'), {prefix: 'api/v1/auth'});
// 	app.register(require('./app/routes/v1/quizRoutes'), {prefix: 'api/v1/quizzes'});
// 	app.register(require('./app/routes/v1/userRoutes'), {prefix: 'api/v1/users'});
	app.register(courseRoutes, { prefix: 'api/v1/courses' })
	app.register(userRoutes, {prefix: 'api/v1/users' });
};

initialize();

// Fire up the server
(async () => {
	try {
		await app.ready();
		await app.listen(process.env.PORT);
	} catch (error) {
		app.log.error(error);
		process.exit(1);
	}
})();
