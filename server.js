require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const fenwickRoutes = require('./routes/fenwickRoutes');

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Basic Test Route (Verification)
app.get('/test', (req, res) => {
    res.status(200).send('API Working');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/fenwick', fenwickRoutes);

// Define Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
