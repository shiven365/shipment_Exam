const mongoose = require('mongoose');

const vesselSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vessel_number: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true, min: [1, 'capacity must be a whole number greater than 0'] }
}, {
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Vessel', vesselSchema);
