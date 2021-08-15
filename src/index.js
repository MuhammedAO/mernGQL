import express from "express"
import session from "express-session"
import dotenv from "dotenv"
import { ApolloServer } from "apollo-server-express"
import { createRequire } from "module"
const require = createRequire(import.meta.url)

import typeDefs from "./typeDefs/index.js"
import resolvers from "./resolvers/index.js"
import connectDB from "./config/db.js"

const redis = require("redis")
let RedisStore = require("connect-redis")(session)
const redisUrl = "redis://127.0.0.1:6379"
let redisClient = redis.createClient(redisUrl)
let store = new RedisStore({ client: redisClient })

const { PORT = 4000 } = process.env

dotenv.config()

connectDB()

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground:
      process.env.NODE_ENV === "production"
        ? false
        : {
            settings: {
              "request.credentials": "include",
            },
          },
    context: ({ req, res }) => ({ req, res }),
  })
  await server.start()

  const app = express()
  app.disable("x-powered-by")

  app.use(
    session({
      store,
      name: process.env.SESS_NAME,
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 2,
        sameSite: true,
        secure: process.env.NODE_ENV === "production",
      },
    })
  )

  server.applyMiddleware({ app })

  await new Promise((resolve) => app.listen({ port: PORT }, resolve))
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
  return { server, app }
}

startApolloServer()
