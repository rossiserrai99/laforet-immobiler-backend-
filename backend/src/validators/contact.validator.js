const Joi = require('joi');

const createLeadSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  type: Joi.string().valid('Contact', 'Estimation', 'Property Inquiry').required(),
  propertyId: Joi.string().hex().length(24).optional(),
  message: Joi.string().optional()
});

module.exports = {
  createLeadSchema
};
