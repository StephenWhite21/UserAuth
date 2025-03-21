require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: true 
}));

// db connection
const db = require('./config/db');

// Simple test route
app.get('/', (req, res) => {
  res.send('Hello from Express + MySQL Auth Starter!');
});

app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        res.json({ success: true, message: 'Database connected!', result: rows[0].result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Import and use auth routes (we'll create them soon)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

console.log(process.env.DB_HOST);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});