const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Import connect-mongo
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI; // Use environment variable

// Middleware
app.use(bodyParser.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: uri }) // Use MongoStore
}));

// Connect to MongoDB
async function connectToMongoDB() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process with an error code
  }
}

connectToMongoDB().then(client => {
  // Define routes and other app logic here

  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
