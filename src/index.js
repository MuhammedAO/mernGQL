import express from "express"
import { ApolloServer } from "apollo-server-express"
import typeDefs from "./typeDefs/index.js"
import resolvers from "./resolvers/index.js"
import connectDB from "./config/db.js"

const { PORT = 4000 } = process.env

connectDB()

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    context: ({ req, res }) => ({ req, res }),
  })
  await server.start()

  const app = express()
  app.disable("x-powered-by")

  server.applyMiddleware({ app })

  await new Promise((resolve) => app.listen({ port: PORT }, resolve))
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
  return { server, app }
}

startApolloServer()
