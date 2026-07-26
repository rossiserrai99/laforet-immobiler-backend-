const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  type: {
    type: String,
    default: 'Contact',
    set: function(val) {
      if (!val) return 'Contact';
      const v = val.toLowerCase();
      if (v === 'contact') return 'Contact';
      if (v === 'estimation') return 'Estimation';
      if (v.includes('property') || v.includes('inquiry') || v.includes('bien')) return 'Property Inquiry';
      return val;
    }
  },
  propertyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property'
  },
  message: {
    type: String
  },
  status: {
    type: String,
    default: 'New',
    set: function(val) {
      if (!val) return 'New';
      const v = val.toLowerCase();
      if (v === 'nouveau' || v === 'new') return 'New';
      if (v === 'contacté' || v === 'contacted') return 'Contacted';
      if (v === 'résolu' || v === 'resolved') return 'Resolved';
      if (v === 'archived' || v === 'archivé') return 'Archived';
      return val;
    }
  }
}, {
  timestamps: true
});

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
module.exports = Lead;
