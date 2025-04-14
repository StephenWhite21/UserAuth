const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { generateTokens } = require('../services/generateTokens');

const registerUser = async (req, res) => {
    try {
        // Gather request
        const { email, password } = req.body;
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];

        // 1) Check if user exists
        const [rows] = await pool.query('select * from users where email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ error: 'User already exists'});
        }
        
        // 2) Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // 3) Insert into DB
        const [result] = await pool.query('insert into users (email, password) values (?, ?)', [email, hashedPassword]);

        // 4) Build user object
        const user = {
            id: result.insertId,
            email: email,
            ipAddress: ipAddress,
            userAgent: userAgent
        }

        // 5) Generate short and long term JWT tokens - stores tokens in db
        const { accessToken, refreshToken } = await generateTokens(user);

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: process.env.COOKIE_MAX_AGE
        });

        // 7) Return success or JWT
        return res.status(200).json({ message: 'User registered successfully!', user: user, accessToken: accessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { registerUser };