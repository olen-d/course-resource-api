// Fastify
import Fastify from 'fastify'

// Fastify plugins
import fastifyAuth from 'fastify-auth'
import fastifyCors from 'fastify-cors'
import fastifyEnv from 'fastify-env'
import fastifyMongodb from 'fastify-mongodb'
import fastifyMultipart from 'fastify-multipart'

// Routes
import { routes as aboutRoutes } from './app/routes/v1/about-routes.mjs'
import { routes as authRoutes } from './app/routes/v1/auth-routes.mjs'
import { routes as courseRoutes } from './app/routes/v1/course-routes.mjs'
import { routes as difficultyRoutes } from './app/routes/v1/difficulty-routes.mjs'
import { routes as linkRoutes } from './app/routes/v1/link-routes.mjs'
import { routes as mailRoutes } from './app/routes/v1/mail-routes.mjs'
import { routes as newsRoutes } from './app/routes/v1/news-routes.mjs'
import { routes as userRoutes } from './app/routes/v1/user-routes.mjs'
import { routes as welcomeRoutes } from './app/routes/v1/welcome-routes.mjs'

// Models
import { authenticateUseridAndPassword } from './app/models/v1/auth-models.mjs'

// Services
import { verifyToken } from './app/services/v1/jsonwebtoken-services.mjs' // Used instead of fastify-jwt because both authorization and refresh tokens need to be signed and verified

// eslint-disable-next-line new-cap
const app = Fastify({
	logger: true,
})

const schema = {
	type: 'object',
	required: ['DB_NAME', 'DB_PASSWORD', 'DB_USERNAME', 'PORT'],
	properties: {
		CONTACT_SMTP_HOST: {
			type: 'string' 
		},
    CONTACT_SMTP_PORT:  {
			type: 'string' 
		},
    CONTACT_SMTP_SECURE:  {
			type: 'string' 
		},
    CONTACT_SMTP_USER:  {
			type: 'string' 
		},
    CONTACT_SMPT_PASS:  {
			type: 'string' 
		},
		DB_NAME: {
			type: 'string',
		},
		DB_PASSWORD: {
			type: 'string',
		},
		DB_USERNAME: {
			type: 'string',
		},
		PATH_FILES_COURSES: {
			type: 'string'
		},
		PATH_FILES_IMAGES: {
			type: 'string'
		},
		PATH_FILES_ORIGINALS: {
			type: 'string'
		},
		PATH_FILES_THUMBNAILS: {
			type: 'string'
		},
		PREFIX_FILES_IMAGES: {
			type: 'string'
		},
		PREFIX_FILES_THUMBNAILS: {
			type: 'string'
		},
		PRESENTATION_HOSTNAME: {
			type: 'string'
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
		IS_SAME_ORIGIN: {
			type: 'boolean'
		},
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
	app.register(fastifyMultipart)
	await app.after()

	// Authorization
	app.decorate('verifyJWT', async (request, reply) => {
		try {
			const { headers: { authorization }, } = request
			if (authorization) {
				const authToken = authorization.replace('Bearer ', '')
				const result = await verifyToken(authToken, app.config.JWT_PUBLIC_KEY_PEM_FILE, app.config.JWT_ALGORITHM, app.config.JWT_ISSUER)
				const { aud } = result
				// TODO: Check iss against a white list of valid issuers
				if (app.config.SERVER_URL === aud) {
					request.verifiedAuthToken = { ...result }
				} else {
					throw new Error('invalid audience');
				}
			} else {
				return reply.code(401).send('Authorization token not provided.')
			}
		} catch (error) {
			return reply.code(401).send(error)
		}
	})

	app.decorate('verifyUseridAndPassword', async function (request, reply) {
		const { body: { plaintextPasswordRe }, verifiedAuthToken: { sub: userid }, } = request

		const { mongo: { db: _db, ObjectId: _ObjectId} } = this

		const info = {plaintextPassword: plaintextPasswordRe, userid}

		const data = await authenticateUseridAndPassword(_db, _ObjectId, info)
		if (!data) {
			return reply.code(403).send({ status: 403, message: 'Invalid Password'})
		}
	})

	app.register(fastifyCors, {
		// TODO: Set up API keys - valid key will issue a bearer token with user role valid for 10 seconds, the following is just quick and dirty
		origin: (origin, cb) => {
			if (app.config.IS_SAME_ORIGIN) {
				cb(null, false)
				return
			} 
			const hostname = new URL(origin).hostname
			// Get the allowed hostname
			const presentationHostname = app.config.PRESENTATION_HOSTNAME
			if(hostname === presentationHostname){
				//  Request from presentation host will pass
				cb(null, true)
				return
			}
			// Generate an error on other origins, disabling access
			cb(new Error("Not allowed"))
		}
	})

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
	app.register(aboutRoutes, { prefix: 'api/v1/about' })
	app.register(authRoutes, { prefix: 'api/v1/auth' })
	app.register(courseRoutes, { prefix: 'api/v1/courses' })
	app.register(difficultyRoutes, { prefix: 'api/v1/difficulty' })
	app.register(linkRoutes, { prefix: 'api/v1/links' })
	app.register(mailRoutes, { prefix: 'api/v1/mail'})
	app.register(newsRoutes, { prefix: 'api/v1/news' })
	app.register(userRoutes, { prefix: 'api/v1/users' })
	app.register(welcomeRoutes, { prefix: 'api/v1/welcome' })
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
