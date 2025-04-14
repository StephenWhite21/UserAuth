const jwt = require("jsonwebtoken");
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { generateTokens } = require('../services/generateTokens');

const refreshToken = async (req, res) => {
    const oldRefreshToken = req.cookies?.refresh_token;
    // console.log(req.cookies?.refresh_token); 
    if (!oldRefreshToken) {
        return res.status(401).json({ error: "Refresh token not provided" });
    }

    try {
        // Verify the refresh token - will throw error if invalid or expired
        const payload = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
        // console.log(payload.userId);
        // Query db for valid user sessions
        const [rows] = await pool.query(
            'select * from tokens where user_id = ? and is_valid = 1 and expires_at > now()',
            [payload.userId]
        );
        // console.log(rows);
        const validTokenRow = await Promise.any(
            rows.map(async row => {
                const isMatch = await bcrypt.compare(oldRefreshToken, row.refresh_token);
                return isMatch ? row : Promise.reject();
            })
        ).catch(() => null);
        // console.log("test");
        // console.log(validTokenRow);

        if (!validTokenRow) {
            return res.status(403).json({ error: "Invalid or expired refresh token" });
        }

        // token rotation
        await pool.query(
            'update tokens set is_valid = 0 where id = ?',
            [validTokenRow.id]
        );

        const user = {
            id: payload.userId
        }
        
        // gen new tokens
        const { accessToken, refreshToken } = await generateTokens(user);

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: process.env.COOKIE_MAX_AGE
        });

        return res.status(200).json({ user: user, accessToken: accessToken });
    } catch (error) {
        console.error("Refresh token error:", error);
        return res.status(403).json({ error: "Invalid or expired refresh token" });
    }

};

module.exports = { refreshToken };