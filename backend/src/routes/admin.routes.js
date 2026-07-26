const express = require('express');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// All admin routes must be protected
router.use(authMiddleware.protect);

router.get('/stats', adminController.getDashboardStats);

module.exports = router;
