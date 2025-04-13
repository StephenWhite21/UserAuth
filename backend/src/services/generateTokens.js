const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function generateTokens(user) {
    const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    const saltRounds = 10;
    const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds);

    const expiresAt = new Date();
    // For example, if 7 days, 7 * 24 hours * 60 min * 60 sec * 1000 ms
    expiresAt.setTime(expiresAt.getTime() + (7 * 24 * 60 * 60 * 1000));

    // console.log(user);

    await pool.query(
        'insert into tokens (user_id, refresh_token, expires_at) VALUES (?, ?, ?)',
        [user.id, hashedRefreshToken, expiresAt]
    );

    return { accessToken, refreshToken }; 
}

module.exports = { generateTokens }