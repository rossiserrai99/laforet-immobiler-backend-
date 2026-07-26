const express = require('express');
const propertyController = require('../controllers/property.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

// Route that matches /api/properties/:slug or /api/properties/:id can collide. 
// We should structure it so ID operations are explicit or handle both.
// Let's use /slug/:slug for public slug fetches to avoid collision with /:id.

router.route('/')
  .get(propertyController.getAllProperties)
  .post(
    authMiddleware.protect, 
    upload.array('images', 10), 
    propertyController.createProperty
  );

router.get('/slug/:slug', propertyController.getProperty);

router.route('/:id')
  .patch(
    authMiddleware.protect, 
    upload.array('images', 10), 
    propertyController.updateProperty
  )
  .delete(
    authMiddleware.protect, 
    propertyController.deleteProperty
  );

module.exports = router;
