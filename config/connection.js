import pkg from 'mongoose'
const { connect, connection } = pkg

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialNetworkDB'

connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

export default connection
