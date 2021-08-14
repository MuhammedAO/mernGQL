import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    email: String,
    username: String,
    name: String,
    password: String,
  },
  {
    timestamps: true,
  }
)

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)
    } catch (error) {
      next(error)
    }
  }
})

export default mongoose.model("User", userSchema)
