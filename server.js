const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MongoClient } = require('mongodb');
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

// Define routes
async function main() {
  const client = await connectToMongoDB();
  const db = client.db('yourDatabaseName'); // Replace with your database name

  // Sample endpoint to check server status
  app.get('/', (req, res) => {
    res.send('Server is running');
  });

  // User login endpoint
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await db.collection('users').findOne({ username, password });
    if (user) {
      req.session.userId = user._id;
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid credentials');
    }
  });

  // Fetch agent list endpoint
  app.get('/agents', async (req, res) => {
    const agents = await db.collection('agents').find({}).toArray();
    res.json(agents);
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

main().catch(console.error);
