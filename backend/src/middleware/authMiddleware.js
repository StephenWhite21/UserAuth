const jwt = require('jsonwebtoken');

function authenticateAccessToken(req, res, next) {
  console.log("auth checking user....");
  try {
    const token = req.cookies?.access_token; 
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      // Attach user info to req
      req.user = { userId: decoded.userId };
      next();
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { authenticateAccessToken };
