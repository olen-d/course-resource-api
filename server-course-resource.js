// Fastify
import Fastify from 'fastify'

// Fastify plugins
import fastifyAuth from 'fastify-auth'
import fastifyEnv from 'fastify-env'
import fastifyMongodb from 'fastify-mongodb'

// Routes
import { routes as authRoutes } from './app/routes/v1/auth-routes.mjs'
import { routes as courseRoutes } from './app/routes/v1/course-routes.mjs'
import { routes as userRoutes } from './app/routes/v1/user-routes.mjs'

// Other services
import { verifyToken } from './app/services/v1/jsonwebtoken-services.mjs' // Used instead of fastify-jwt because both authorization and refresh tokens need to be signed and verified

// eslint-disable-next-line new-cap
const app = Fastify({
	logger: true,
})

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
		CLIENT_ID: {
			type: 'string',
		},
// 		COOKIE_SECRET: {
// 			type: 'string',
// 		},
		JWT_ALGORITHM: {
			type: 'string',
		},
		JWT_AUDIENCE: {
			type: 'string',
		},
		JWT_ISSUER: {
			type: 'string',
		},
		JWT_PRIVATE_KEY_PEM_FILE: {
			type: 'string',
		},
		JWT_PUBLIC_KEY_PEM_FILE: {
			type: 'string',
		},
		RT_AUDIENCE: {
			type: 'string',
		},
		RT_PRIVATE_KEY_PEM_FILE: {
			type: 'string',
		},
// 		RT_PUBLIC_KEY_PEM_FILE: {
// 			type: 'string',
// 		},
		SERVER_URL: {
			type: 'string'
		}
	}
}

const options = {
	confKey: 'config',
	schema,
	dotenv: true,
	data: process.env,
}

const initialize = async () => {
	app.register(fastifyAuth)
	app.register(fastifyEnv, options)
	await app.after()

	// Authorization
	app.decorate('verifyJWT', async (request, reply) => {
		try {
			const { headers: { authorization }, } = request
			const authToken = authorization.replace('Bearer ', '')
			const result = await verifyToken(authToken, app.config.JWT_PUBLIC_KEY_PEM_FILE, app.config.JWT_ALGORITHM, app.config.JWT_ISSUER)
			const { aud } = result
			// TODO: Check iss against a white list of valid issuers
			if (app.config.SERVER_URL === aud) {
				request.verifiedAuthToken = { ...result }
			} else {
				throw new Error('invalid audience');
			}
		} catch (error) {
			reply.code(401).send(error)
		}
	})
// 	// !TODO: Fix this before deploy to enable cors on production server
// 	app.register(require('fastify-cors'), {
// 		origin: '*',
// 	})

	// Database
	// Get the .env variables
	const dbName = encodeURIComponent(app.config.DB_NAME)
	const username = app.config.DB_USERNAME
	const password = app.config.DB_PASSWORD

	// Connection URL
	const url = `mongodb://localhost:27017/${dbName}`

	app.register(fastifyMongodb, {
		auth: {
			username,
			password
		},
		forceClose: true,
		url,
		useUnifiedTopology: true,
	})

	// Register the routes
	app.register(authRoutes, { prefix: 'api/v1/auth'})
	app.register(courseRoutes, { prefix: 'api/v1/courses' })
	app.register(userRoutes, {prefix: 'api/v1/users' })
}

initialize();

// Fire up the server
(async () => {
	try {
		await app.ready()
		await app.listen(app.config.PORT)
	} catch (error) {
		app.log.error(error)
		process.exit(1)
	}
})()
