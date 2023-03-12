'use strict';

const { connect, connection } = require('mongoose');

// On Heroku, Node uses the environment mongoDB URI
// Locally, Node uses the explicit mongoDB URI
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialNetworkDB';

// Wrap mongoose around connection to MongoDB
connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// export connection
module.exports = connection;

 