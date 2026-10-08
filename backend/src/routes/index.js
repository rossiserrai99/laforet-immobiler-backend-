const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const propertyRoutes = require('./property.routes');
const leadRoutes = require('./lead.routes');
const adminRoutes = require('./admin.routes');
const mediaRoutes = require('./media.routes');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/leads', leadRoutes);
router.use('/admin', adminRoutes);
router.use('/media', mediaRoutes);

module.exports = router;
