const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const getUser = async(req, res) => {
    console.log("running me");
    // 1. Extract the Authorization header
    const authHeader = req.headers?.authorization;
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access token missing or invalid' });
    }
    
    const token = authHeader.split(' ')[1];
    console.log(token);

    try {
        // 2. Verify the access token using your access token secret
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // 3. Query the DB for the user data (exclude sensitive fields such as password)
        const [rows] = await pool.query(
            'select id, email, username, is_verified, created_at from users where id = ?',
            [payload.userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 4. Send back the user data
        return res.status(200).json({ user: rows[0] });
    } catch (err) {
        console.error('Error verifying access token:', err);
        return res.status(401).json({ error: 'Invalid access token' });
    }
}

module.exports = { getUser };