const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { loginSchema } = require('../validators/auth.validator');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');

const router = express.Router();

router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware.protect, authController.getMe);
router.put('/update-credentials', authMiddleware.protect, authController.updateCredentials);

module.exports = router;
