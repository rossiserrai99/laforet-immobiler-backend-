const Joi = require('joi');

const createPropertySchema = Joi.object({
  title: Joi.string().required(),
  reference: Joi.string().required(),
  category: Joi.string().valid('Villa', 'Appartement', 'Studio', 'Duplex', 'Triplex', 'Terrain', 'Local Commercial', 'Bureau', 'Immeuble').required(),
  type: Joi.string().valid('Vente', 'Location').required(),
  status: Joi.string().valid('Disponible', 'Vendu', 'Loué', 'Réservé', 'Brouillon'),
  price: Joi.number().required(),
  priceHidden: Joi.boolean(),
  area: Joi.number().required(),
  rooms: Joi.number().optional(),
  bedrooms: Joi.number().optional(),
  bathrooms: Joi.number().optional(),
  description: Joi.string().required(),
  location: Joi.object({
    wilaya: Joi.string().required(),
    commune: Joi.string().required(),
    address: Joi.string().optional(),
    coordinates: Joi.object({
      lat: Joi.number().optional(),
      lng: Joi.number().optional()
    }).optional()
  }).required(),
  features: Joi.array().items(Joi.string()),
  isFeatured: Joi.boolean()
});

const updatePropertySchema = createPropertySchema.fork(
  Object.keys(createPropertySchema.describe().keys),
  (schema) => schema.optional()
);

module.exports = {
  createPropertySchema,
  updatePropertySchema
};
