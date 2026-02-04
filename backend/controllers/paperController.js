const Paper = require('../models/Paper');
const logger = require('../utils/logger');
const { PAGINATION } = require('../config/constants');
const arxivService = require('../services/arxivService');
const semanticScholarService = require('../services/semanticScholarService');
const mlService = require('../services/mlService');

// @desc    Search papers from external APIs
// @route   GET /api/papers/search
// @access  Private
const searchPapers = async (req, res, next) => {
  try {
    const { query, source = 'arxiv', limit = 10 } = req.query;

    let papers = [];

    // Search from appropriate source
    if (source === 'arxiv') {
      papers = await arxivService.searchPapers(query, limit);
    } else if (source === 'semantic_scholar') {
      papers = await semanticScholarService.searchPapers(query, limit);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid source. Use "arxiv" or "semantic_scholar"'
      });
    }

    logger.info(`Searched ${source} for: ${query}, found ${papers.length} papers`);

    res.status(200).json({
      success: true,
      count: papers.length,
      data: papers
    });
  } catch (error) {
    logger.error('Search papers error:', error);
    next(error);
  }
};

// @desc    Add paper to database
// @route   POST /api/papers
// @access  Private
const addPaper = async (req, res, next) => {
  try {
    const paperData = {
      ...req.body,
      addedBy: req.user.id
    };

    // Check if paper already exists
    let paper;
    if (paperData.arxivId) {
      paper = await Paper.findOne({ arxivId: paperData.arxivId });
    } else if (paperData.semanticScholarId) {
      paper = await Paper.findOne({ semanticScholarId: paperData.semanticScholarId });
    }

    if (paper) {
      return res.status(200).json({
        success: true,
        message: 'Paper already exists',
        data: paper
      });
    }

    // Create new paper
    paper = await Paper.create(paperData);

    // Generate embeddings asynchronously
    mlService.generateEmbedding(paper._id, paper.abstract)
      .then(embeddingId => {
        paper.embeddingId = embeddingId;
        paper.save();
      })
      .catch(err => logger.error('Embedding generation error:', err));

    logger.info(`Paper added: ${paper.title}`);

    res.status(201).json({
      success: true,
      data: paper
    });
  } catch (error) {
    logger.error('Add paper error:', error);
    next(error);
  }
};

// @desc    Get all papers with pagination
// @route   GET /api/papers
// @access  Private
const getPapers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT;
    const startIndex = (page - 1) * limit;

    const total = await Paper.countDocuments();
    const papers = await Paper.find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('addedBy', 'name email');

    // Pagination result
    const pagination = {};

    if (startIndex + limit < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: papers.length,
      total,
      pagination,
      data: papers
    });
  } catch (error) {
    logger.error('Get papers error:', error);
    next(error);
  }
};

// @desc    Get single paper
// @route   GET /api/papers/:id
// @access  Private
const getPaper = async (req, res, next) => {
  try {
    const paper = await Paper.findById(req.params.id)
      .populate('addedBy', 'name email');

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    res.status(200).json({
      success: true,
      data: paper
    });
  } catch (error) {
    logger.error('Get paper error:', error);
    next(error);
  }
};

// @desc    Update paper
// @route   PUT /api/papers/:id
// @access  Private
const updatePaper = async (req, res, next) => {
  try {
    let paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Make sure user is paper owner or admin
    if (paper.addedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this paper'
      });
    }

    paper = await Paper.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    logger.info(`Paper updated: ${paper.title}`);

    res.status(200).json({
      success: true,
      data: paper
    });
  } catch (error) {
    logger.error('Update paper error:', error);
    next(error);
  }
};

// @desc    Delete paper
// @route   DELETE /api/papers/:id
// @access  Private
const deletePaper = async (req, res, next) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Make sure user is paper owner or admin
    if (paper.addedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this paper'
      });
    }

    await paper.deleteOne();

    logger.info(`Paper deleted: ${paper.title}`);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error('Delete paper error:', error);
    next(error);
  }
};

// @desc    Semantic search papers using ML service
// @route   POST /api/papers/semantic-search
// @access  Private
const semanticSearch = async (req, res, next) => {
  try {
    const { query, limit = 10 } = req.body;

    // Call ML service for semantic search
    const results = await mlService.semanticSearch(query, limit);

    logger.info(`Semantic search for: ${query}, found ${results.length} papers`);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    logger.error('Semantic search error:', error);
    next(error);
  }
};

// @desc    Fetch paper by arXiv ID
// @route   GET /api/papers/arxiv/:arxivId
// @access  Private
const getPaperByArxivId = async (req, res, next) => {
  try {
    const { arxivId } = req.params;

    // Check database first
    let paper = await Paper.findOne({ arxivId });

    // If not found, fetch from arXiv
    if (!paper) {
      const arxivPaper = await arxivService.getPaperById(arxivId);
      
      if (!arxivPaper) {
        return res.status(404).json({
          success: false,
          message: 'Paper not found on arXiv'
        });
      }

      // Add to database
      paper = await Paper.create({
        ...arxivPaper,
        addedBy: req.user.id
      });

      // Generate embeddings asynchronously
      mlService.generateEmbedding(paper._id, paper.abstract)
        .then(embeddingId => {
          paper.embeddingId = embeddingId;
          paper.save();
        })
        .catch(err => logger.error('Embedding generation error:', err));
    }

    res.status(200).json({
      success: true,
      data: paper
    });
  } catch (error) {
    logger.error('Get paper by arXiv ID error:', error);
    next(error);
  }
};

module.exports = {
  searchPapers,
  addPaper,
  getPapers,
  getPaper,
  updatePaper,
  deletePaper,
  semanticSearch,
  getPaperByArxivId
};