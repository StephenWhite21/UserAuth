const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { generateTokens } = require('../services/generateTokens');

const loginUser = async (req, res) => {
    try {
        // Gather request
        const { email, password } = req.body;
        
        // 1) Find user by email
        const [rows] = await pool.query('select * from users where email = ?', [email]);
        if (rows.length === 0) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = rows[0];

        // 2) Compare hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 3) Generate short and long term JWT tokens - stores tokens in db
        const { accessToken, refreshToken } = await generateTokens(user);

        // 4) Set cookies (httpOnly, secure in production)
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

        res.cookie('user_id', user.id, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            signed: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        })

        const returnUser = [user.id, user.email];

        // 5) Respond
        res.status(200).json({ message: 'Login success!', user: returnUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { loginUser };