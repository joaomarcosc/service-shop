import * as dotenv from "dotenv";
import express from "express"
import mongoose from "mongoose"
import routes from "./routes/auth"

dotenv.config()

const app = express()

// Middlewares 
app.use(express.json())

// DB Credentials 
const DB_USER = process.env.DB_USER
const DB_PWD = process.env.DB_PWD

// DB URI
const uri = `mongodb+srv://${DB_USER}:${DB_PWD}@cluster0.tn4whue.mongodb.net/?retryWrites=true&w=majority`

// Port
const port = process.env.PORT || 3000

// Routes
app.use("/api", routes)

// DB Connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Conectado")
  app.listen(process.env.port || port, () => {
    console.log(`Server was running on port ${port}`)
  })
}).catch(err => console.log(err))


