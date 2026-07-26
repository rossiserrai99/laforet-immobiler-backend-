const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  role: {
    type: String, // e.g., 'Acheteur', 'Vendeur'
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Testimonial content is required']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;
