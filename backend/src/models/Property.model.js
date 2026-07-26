const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Villa', 'Appartement', 'Studio', 'Duplex', 'Triplex', 'Terrain', 'Local Commercial', 'Bureau', 'Immeuble']
  },
  type: {
    type: String,
    required: true,
    enum: ['Vente', 'Location']
  },
  status: {
    type: String,
    required: true,
    enum: ['Disponible', 'Vendu', 'Loué', 'Réservé', 'Brouillon'],
    default: 'Brouillon'
  },
  price: {
    type: Number,
    required: true
  },
  priceHidden: {
    type: Boolean,
    default: false
  },
  area: {
    type: Number, // in square meters
    required: true
  },
  rooms: {
    type: Number
  },
  bedrooms: {
    type: Number
  },
  bathrooms: {
    type: Number
  },
  description: {
    type: String,
    required: true
  },
  location: {
    wilaya: { type: String, required: true },
    commune: { type: String, required: true },
    address: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  features: [{
    type: String
  }],
  media: {
    images: [{
      url: { type: String, required: true },
      publicId: { type: String, required: true }
    }],
    coverImage: {
      url: { type: String },
      publicId: { type: String }
    },
    virtualTourUrl: { type: String },
    videoUrl: { type: String }
  },
  agent: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  homePageSection: {
    type: String,
    enum: ['None', 'Exception', 'Apartment'],
    default: 'None'
  }
}, {
  timestamps: true
});

// Indexes for common queries
propertySchema.index({ type: 1, status: 1 });
propertySchema.index({ category: 1 });
propertySchema.index({ 'location.wilaya': 1 });
propertySchema.index({ price: 1 });

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
module.exports = Property;
