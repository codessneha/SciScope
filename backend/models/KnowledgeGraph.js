const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['paper', 'author', 'concept', 'method', 'keyword'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  }
}, { _id: false });

const edgeSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true
  },
  target: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['cites', 'authored_by', 'uses_method', 'related_to', 'has_keyword'],
    required: true
  },
  weight: {
    type: Number,
    default: 1
  }
}, { _id: false });

const knowledgeGraphSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatSession'
  },
  nodes: [nodeSchema],
  edges: [edgeSchema],
  metadata: {
    paperCount: { type: Number, default: 0 },
    authorCount: { type: Number, default: 0 },
    conceptCount: { type: Number, default: 0 }
  },
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeGraph', knowledgeGraphSchema);