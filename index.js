const { ApolloServer, gql } = require("apollo-server")
const crypto = require("crypto")

const db = {
  users: [
    { id: "1", email: "m@gmail.com", name: "mhd" },
    { id: "2", email: "mo@gmail.com", name: "mo" },
  ],

  messages: [
    { id: "1", userId: "1", body: "Hello world 1", createdAt: Date.now() },
    { id: "2", userId: "2", body: "Hello world 2", createdAt: Date.now() },
    { id: "3", userId: "1", body: "Hello world 3", createdAt: Date.now() },
  ],
}

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(id: ID!): User
    messages: [Message!]!
  }

  type Mutation {
    addUser(email: String!, name: String): User
  }

  type User {
    id: ID!
    email: String!
    name: String
    avatar: String
    messages: [Message!]!
  }

  type Message {
    id: ID!
    body: String!
    createdAt: String
  }
`

const resolvers = {
  Query: {
    users: () => db.users,
    user: (parent, { id }) => db.users.find((user) => user.id === id),
    messages: () => db.messages,
  },
  Mutation: {
    addUser: (parent, { email, name }) => {
      const user = {
        id: crypto.randomBytes(10).toString("hex"),
        email,
        name,
      }
      db.users.push(user)
      return user
    },
  },
  User: {
    messages: (user) =>
      db.messages.filter((message) => message.userId === user.id),
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => console.log(`server started at ${url}`))
