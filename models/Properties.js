const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  images: {
    type: [String],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  reviews: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  bedroom: {
    type: Number,
    required: true
  },
  guest: {
    type: Number,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  faqs: [{
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  }],
  bookingPolicies: {
    type: [String],
    default: []
  },
  cancellationPolicy: {
    type: [String],
    default: []
  },
  amenities: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
