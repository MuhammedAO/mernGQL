// const express = require("express")
// const { graphqlHTTP } = require("express-graphql")
// const { graphql, buildSchema } = require("graphql")
// const crypto = require("crypto")

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

class User {
  constructor(user) {
    Object.assign(this, user)
  }
  messages() {
    return db.messages.filter((message) => message.userId === this.id)
  }
}

const schema = buildSchema(`
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
`)

const rootValue = {
  users: () => db.users.map(user => new User(user)),
  user: ({ id }) => db.users.find((user) => user.id === id),
  messages: () => db.messages,
  addUser: ({ email, name }) => {
    const user = {
      id: crypto.randomBytes(10).toString("hex"),
      email,
      name,
    }
    db.users.push(user)
    return user
  },
}

const app = express()

//instantiate a graphql server ontop of the existing express app
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
)

app.listen(3000, () => console.log("Listening on 3000"))
