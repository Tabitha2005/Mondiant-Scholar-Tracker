const mongoose = require('mongoose');

const scanEventSchema = new mongoose.Schema({
  source: { type: String, default: 'flowcode' },
  referrer: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ScanEvent', scanEventSchema);
