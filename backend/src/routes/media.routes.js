const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { getAuthenticationParameters } = require('../config/imagekit');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @route GET /api/media/auth
 * @desc Get authentication parameters for client-side ImageKit upload
 * @access Private (Admin only)
 */
router.get('/auth', authMiddleware.protect, (req, res) => {
  const authParams = getAuthenticationParameters();
  sendSuccess(res, 200, authParams, 'ImageKit authentication parameters generated.');
});

module.exports = router;
