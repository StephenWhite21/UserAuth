const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { generateTokens } = require('../services/generateTokens');

const registerUser = async (req, res) => {
    try {
        // Gather request
        const { email, password } = req.body;
        
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
            id: result.insertId
        }

        // 5) Generate short and long term JWT tokens - stores tokens in db
        const { accessToken, refreshToken } = await generateTokens(user);

        console.log("Tokens generated", accessToken, refreshToken);

        // 6) Set cookies (httpOnly, secure in production)
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
            sameSite: 'lax', // or 'strict', or 'none' if cross-site
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });

        // 7) Return success or JWT
        return res.status(200).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { registerUser };