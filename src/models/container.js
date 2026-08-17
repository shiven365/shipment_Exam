const mongoose = require('mongoose');

const containerSchema = new mongoose.Schema({
  container_number: {
    type: String, required: true, unique: true
  },
  voyage_id: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Voyage', required: true
  },
  destination: {
    type: String, required: true
  },
  due_date: {
    type: String, required: true
  },
  late_charge: {
    type: Number, required: true

  },
  arrived_on: {
    type: String, default: null
  }
}, {
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;

      if (ret.arrived_on && ret.arrived_on > ret.due_date) {
        ret.total_charge = ret.late_charge;
      } else {
        ret.total_charge = 0;
      }
    }
  }
});

module.exports = mongoose.model('Container', containerSchema);
