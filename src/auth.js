import { AuthenticationError } from "apollo-server-express"
import { User } from "./models/index.js"

export const attemptSignIn = async (email, password) => {
  const message = "Invalid credentials. Please try again"
  const user = await User.findOne({ email })

  if (!user) {
    throw new AuthenticationError(message)
  }

  if (!user.matchPassword(password)) {
    throw new AuthenticationError(message)
  }

  return user
}
const signedIn = (req) => req.session.userId

export const checkSignedIn = (req) => {
  if (!signedIn(req)) {
    throw new AuthenticationError("You must be Signed in")
  }
}

export const checkSignedOut = (req) => {
  if (signedIn(req)) {
    throw new AuthenticationError("You are already Signed in")
  }
}

export const signOut = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) reject(err)

      res.clearCookie(process.env.SESS_NAME)

      resolve(true)
    })
  })
