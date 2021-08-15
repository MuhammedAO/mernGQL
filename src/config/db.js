import mongoose from "mongoose"
import { mongoURI } from "./keys.js"

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.mongoURI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`database connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
