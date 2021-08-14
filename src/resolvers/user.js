import mongoose from "mongoose"
import { UserInputError } from "apollo-server-express"
import { User } from "../models/index.js"

export default {
  /*Apollo handles promises rejection and resolution on its own */
  Query: {
    users: (parent, args, context, info) => {
      //Todo: Auth, Projection, Pagination, Sanitization
      return User.find({})
    },
    user: (parent, { id }, context, info) => {
      //Todo: Auth, Projection, Pagination, Sanitization
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not a valid userId`)
      }
      return User.findById(id)
    },
  },

  Mutation: {
    signUp: (parent, args, context, info) => {
      //Todo: !Auth, Validation

      return User.create(args)
    },
  },
}
