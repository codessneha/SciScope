const axios = require('axios');
const logger = require('../utils/logger');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// @desc    Generate embedding for paper
const generateEmbedding = async (paperId, text) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/embeddings/generate`, {
      paperId,
      text
    });

    logger.info(`Embedding generated for paper: ${paperId}`);

    return response.data.embeddingId;
  } catch (error) {
    logger.error('Generate embedding error:', error.message);
    throw new Error('Failed to generate embedding');
  }
};

// @desc    Semantic search using embeddings
const semanticSearch = async (query, limit = 10) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/search/semantic`, {
      query,
      limit
    });

    logger.info(`Semantic search performed: ${query}`);

    return response.data.results;
  } catch (error) {
    logger.error('Semantic search error:', error.message);
    throw new Error('Failed to perform semantic search');
  }
};

// @desc    Generate answer using RAG
const generateAnswer = async (question, papers) => {
  try {
    const paperData = papers
      .filter(p => p.title && p.abstract)
      .map(p => ({
        id: p._id,
        title: p.title,
        abstract: p.abstract,
        authors: p.authors || []
      }));

    if (paperData.length === 0) {
      throw new Error('No papers with valid content (title and abstract) available for processing');
    }

    const response = await axios.post(`${ML_SERVICE_URL}/rag/generate`, {
      question,
      papers: paperData
    });

    logger.info(`RAG answer generated for question: ${question}`);

    return {
      answer: response.data.answer,
      citations: response.data.citations || []
    };
  } catch (error) {
    logger.error('Generate answer error:', error.message);
    throw new Error('Failed to generate answer');
  }
};

// @desc    Extract graph data from papers
const extractGraphData = async (papers) => {
  try {
    const paperData = papers
      .filter(p => p.title && p.abstract)
      .map(p => ({
        id: p._id,
        title: p.title,
        abstract: p.abstract,
        authors: p.authors || [],
        categories: p.categories || []
      }));

    if (paperData.length === 0) {
      throw new Error('No papers with valid content (title and abstract) available for graph extraction');
    }

    const response = await axios.post(`${ML_SERVICE_URL}/graph/extract`, {
      papers: paperData
    });

    logger.info(`Graph data extracted for ${papers.length} papers`);

    return {
      nodes: response.data.nodes,
      edges: response.data.edges,
      metadata: response.data.metadata
    };
  } catch (error) {
    logger.error('Extract graph data error:', error.message);
    throw new Error('Failed to extract graph data');
  }
};

module.exports = {
  generateEmbedding,
  semanticSearch,
  generateAnswer,
  extractGraphData
};