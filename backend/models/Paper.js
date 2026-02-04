const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  authors: [{
    type: String,
    trim: true
  }],
  abstract: {
    type: String,
    required: true
  },
  arxivId: {
    type: String,
    unique: true,
    sparse: true // Allows null values
  },
  semanticScholarId: {
    type: String,
    unique: true,
    sparse: true
  },
  url: {
    type: String,
    required: true
  },
  pdfUrl: {
    type: String
  },
  publishedDate: {
    type: Date
  },
  categories: [{
    type: String
  }],
  citationCount: {
    type: Number,
    default: 0
  },
  source: {
    type: String,
    enum: ['arxiv', 'semantic_scholar'],
    required: true
  },
  // For vector search
  embeddingId: {
    type: String // Reference to embedding in ML service
  },
  // Metadata
  keywords: [{
    type: String
  }],
  methods: [{
    type: String
  }],
  // User who added this paper
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
}, { timestamps: true });

// Indexes for better search performance
paperSchema.index({ title: 'text', abstract: 'text' });
paperSchema.index({ arxivId: 1 });
paperSchema.index({ source: 1 });
paperSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Paper', paperSchema);