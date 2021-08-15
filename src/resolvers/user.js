import mongoose from "mongoose"
import { UserInputError } from "apollo-server-express"
import { User } from "../models/index.js"
import { schema, schema1 } from "../schemas/user.js"
// import { signUp, signIn } from "../schemas/user.js"
import * as Auth from "../auth.js"

export default {
  /*Apollo handles promises rejection and resolution on its own */
  Query: {
    me: (parent, args, { req }, info) => {
      //Todo: Projection

      Auth.checkSignedIn(req)

      return User.findById(req.session.userId)
    },
    users: (parent, args, { req }, info) => {
      //Todo: Auth, Projection, Pagination, Sanitization

      Auth.checkSignedIn(req)

      return User.find({})
    },
    user: (parent, { id }, { req }, info) => {
      //Todo: Auth, Projection, Pagination, Sanitization

      Auth.checkSignedIn(req)
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not a valid userId`)
      }
      return User.findById(id)
    },
  },

  Mutation: {
    signUp: async (parent, args, { req }, info) => {
      //Todo: !Auth, Validation
      Auth.checkSignedOut(req)
      await schema.validateAsync(args, { abortEarly: false })

      const user = await User.create(args)

      req.session.userId = user.id

      return user
    },

    signIn: async (parent, args, { req }, info) => {
      const { userId } = req.session
      if (userId) {
        return User.findById(userId)
      }
      await schema1.validateAsync(args, { abortEarly: false })

      const { email, password } = args

      const user = await Auth.attemptSignIn(email, password)
      req.session.userId = user.id
      return user
    },

    signOut: (parent, args, { req, res }, info) => {
      Auth.checkSignedIn(req)

      return Auth.signOut(req, res)
    },
  },
}
