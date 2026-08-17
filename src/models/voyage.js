const mongoose = require('mongoose');

const voyageSchema = new mongoose.Schema({
  vessel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vessel', required: true },
  voyage_number: { type: String, required: true, unique: true },
  destination: { type: String, required: true },
  status: { type: String, enum: ['PLANNED', 'SAILING', 'COMPLETED'], default: 'PLANNED' },
  hop_history: { type: [String], default: [] }
}, {
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;

      const effective = [];
      const seen = new Set();
      if (ret.hop_history) {
        ret.hop_history.forEach(hop => {
          if (!seen.has(hop)) {
            effective.push(hop);
            seen.add(hop);
          }
        });
      }
      ret.effective_route = effective;
      delete ret.hop_history;

      delete ret._id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Voyage', voyageSchema);
