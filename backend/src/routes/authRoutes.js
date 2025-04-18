const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const loginController = require('../controllers/loginController');
const logoutController = require('../controllers/logoutController');
const refreshController = require('../controllers/refreshController');
const userController = require('../controllers/userController');
const { authenticateAccessToken } = require('../middleware/authMiddleware');

router.post('/register', registrationController.registerUser);
router.post('/login', loginController.loginUser);
router.post('/logout', logoutController.logoutUser);
router.post('/refresh', refreshController.refreshToken);
router.get('/me', userController.getUser);
router.get('/protected', authenticateAccessToken, (req, res) => {
    return res.json({ message: `Hello user ${req.user.userId}, you are authenticated!` });
  });

module.exports = router;
