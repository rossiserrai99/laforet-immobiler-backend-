const express = require('express');
const leadController = require('../controllers/lead.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Public route to submit an inquiry
router.post('/', leadController.createLead);

// Protected routes for admin
router.use(authMiddleware.protect);

router.route('/')
  .get(leadController.getAllLeads);

router.route('/:id/status')
  .patch(leadController.updateLeadStatus);

router.route('/:id')
  .delete(leadController.deleteLead);

module.exports = router;
