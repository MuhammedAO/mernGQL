import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: (email) => User.doesntExist({ email }),
        message: ({ value }) => `Email ${value} has already been taken`, //security risk. fix later
      },
    },
    username: {
      type: String,
      validate: {
        validator: (username) => User.doesntExist({ username }),
        message: ({ value }) => `Username ${value} has already been taken`, //security risk. fix later
      },
    },
    name: String,
    password: String,
  },
  {
    timestamps: true,
  }
)

userSchema.statics.doesntExist = async function (options) {
  return (await this.where(options).countDocuments()) === 0
}

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model("User", userSchema)

export default User
