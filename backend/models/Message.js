const mongoose = require('mongoose');

const citationSchema = new mongoose.Schema({
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paper',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  relevance: {
    type: Number,
    min: 0,
    max: 1
  }
}, { _id: false });

const messageSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatSession',
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  citations: [citationSchema],
  relatedPapers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paper'
  }],
  processingTime: {
    type: Number // in milliseconds
  },
}, { timestamps: true });

// Index for faster querying
messageSchema.index({ session: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);