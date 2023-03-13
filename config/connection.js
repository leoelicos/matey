import pkg from 'mongoose'
const { connect, connection } = pkg
// On Heroku, Node uses the environment mongoDB URI
// Locally, Node uses the explicit mongoDB URI
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialNetworkDB'

// Wrap mongoose around connection to MongoDB
connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// export connection
export default connection
