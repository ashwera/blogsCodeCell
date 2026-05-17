const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  blog_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
  type: { type: String, enum: ['view', 'read'] },
  time_spent: Number,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
