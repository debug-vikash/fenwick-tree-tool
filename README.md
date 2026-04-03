# Fenwick Tree Project Setup Guide

Welcome! This guide outlines the beginner-friendly, clean full-stack project setup for the **Fenwick Tree Update Handler** project. Your project has been set up with Node.js, Express, and MongoDB.

## 1. Project Folder Structure

A well-organized project structure makes development much cleaner. We have divided the codebase into a `client/` and a `server/`.

```text
fenwick-tree-project/
├── client/                 # Future frontend code (React/Vanilla JS)
├── server/                 # All backend logic goes here
│   ├── config/             # Database and environment configurations
│   ├── controllers/        # Functions that handle request logic and responses
│   ├── core/               # Where your Fenwick Tree specific algorithms reside 
│   ├── models/             # Mongoose database schemas (e.g., User)
│   ├── routes/             # API endpoints mapping to controllers
│   ├── server.js           # Main entry point of the Node.js application
├── .env                    # Secret environment variables (PORT, MONGO_URI)
└── package.json            # Project manifest mapping dependencies & run scripts
```

- **`config/`**: Separates your database connection so the main file isn't cluttered.
- **`models/`**: Keeps all the structure of what data enters the DB.
- **`controllers/`**: Isolates logic from the routes, making it easy to test.
- **`routes/`**: Acts purely as a traffic controller pointing URLs to `controllers`.
- **`core/`**: Custom algorithms specific to this application's goal.

---

## 2. Dependencies & Initialization

The project relies on a few fundamental NPM packages to run smoothly:

- **`express`**: To create the web server.
- **`mongoose`**: For connecting and interacting with MongoDB.
- **`cors`**: Allows the future `client/` frontend to fetch data from the server smoothly.
- **`dotenv`**: For securely loading environment variables like database URIs.

*(These have already been added to your `package.json` for you.)*

---

## 3. Server Setup (`server.js`)

This main file brings all routes and configurations together. It enables JSON parsing for API requests and launches the server.

```javascript
// server/server.js
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json()); // Enable JSON body parsing
app.use(cors());         // Allow client applications to hit API

// Connect to MongoDB
connectDB();

// Test Route to Verify Backend Functionality
app.get('/test', (req, res) => {
    res.status(200).send('API Working');
});

// Authentication Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 4. Database Setup & Verification

Below is the database connection file. It handles attempting the connection and throws an error cleanly if MongoDB is not running locally.

```javascript
// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`DB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); 
    }
};

module.exports = connectDB;
```

---

## 5. User Model & Basic Authentication (No Advanced Hashing)

To demonstrate DB interaction, here is the simplified User schema and authentication flow.

### User Schema (`server/models/User.js`)
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

### Registration and Login Logic (`server/controllers/authController.js`)
```javascript
const User = require('../models/User');

// Register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password });
        res.status(201).json({ message: 'User registered successfully', user: { id: user.id, name, email }});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && user.password === password) {
            res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email }});
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser };
```

### Routing (`server/routes/auth.js`)
```javascript
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
```

## Running the Setup

1. Make sure your local MongoDB instance is running.
2. The exact application is now deployed heavily into your workspace.
3. Simply execute **`npm start`** via your terminal to run the process.
4. You'll see `DB Connected Successfully` and can hit `http://127.0.0.1:5050/test` to verify.
