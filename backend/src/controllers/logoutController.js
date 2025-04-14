const jwt = require("jsonwebtoken");
const pool = require('../config/db');
const bcrypt = require('bcrypt');

const logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refresh_token;
    
        if (!refreshToken) {
            return res.status(400).json({ error: 'Missing token or user ID' });
        }

        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const [rows] = await pool.query(
            'select id, refresh_token from tokens where user_id = ? and is_valid = 1',
            [payload.userId]
        );

        for (const row of rows) {
            const match = await bcrypt.compare(refreshToken, row.refresh_token);
            if (match) {
                await pool.query(
                    'update tokens set is_valid = 0 where id = ?',
                    [row.id]
                );
                break;
            }
        }

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        return res.json({ message: 'Logged out' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { logoutUser };