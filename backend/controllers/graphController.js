const KnowledgeGraph = require('../models/KnowledgeGraph');
const Paper = require('../models/Paper');
const logger = require('../utils/logger');
const mlService = require('../services/mlService');

// @desc    Generate knowledge graph for papers
// @route   POST /api/graph/generate
// @access  Private
const generateGraph = async (req, res, next) => {
  try {
    const { paperIds, sessionId } = req.body;

    // Get papers
    const papers = await Paper.find({ _id: { $in: paperIds } });

    if (papers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No papers found with provided IDs'
      });
    }

    // Call ML service to extract entities and relationships
    const graphData = await mlService.extractGraphData(papers);

    // Create or update knowledge graph
    let graph = await KnowledgeGraph.findOne({
      user: req.user.id,
      session: sessionId || null
    });

    if (graph) {
      // Update existing graph
      graph.nodes = graphData.nodes;
      graph.edges = graphData.edges;
      graph.metadata = graphData.metadata;
      graph.updatedAt = Date.now();
      await graph.save();
    } else {
      // Create new graph
      graph = await KnowledgeGraph.create({
        user: req.user.id,
        session: sessionId || null,
        nodes: graphData.nodes,
        edges: graphData.edges,
        metadata: graphData.metadata
      });
    }

    logger.info(`Knowledge graph generated for user ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: graph
    });
  } catch (error) {
    logger.error('Generate graph error:', error);
    next(error);
  }
};

// @desc    Get knowledge graph
// @route   GET /api/graph/:id
// @access  Private
const getGraph = async (req, res, next) => {
  try {
    const graph = await KnowledgeGraph.findById(req.params.id);

    if (!graph) {
      return res.status(404).json({
        success: false,
        message: 'Knowledge graph not found'
      });
    }

    // Make sure user owns this graph
    if (graph.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this graph'
      });
    }

    res.status(200).json({
      success: true,
      data: graph
    });
  } catch (error) {
    logger.error('Get graph error:', error);
    next(error);
  }
};

// @desc    Get user's graphs
// @route   GET /api/graph
// @access  Private
const getUserGraphs = async (req, res, next) => {
  try {
    const graphs = await KnowledgeGraph.find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .populate('session', 'title');

    res.status(200).json({
      success: true,
      count: graphs.length,
      data: graphs
    });
  } catch (error) {
    logger.error('Get user graphs error:', error);
    next(error);
  }
};

// @desc    Update knowledge graph
// @route   PUT /api/graph/:id
// @access  Private
const updateGraph = async (req, res, next) => {
  try {
    let graph = await KnowledgeGraph.findById(req.params.id);

    if (!graph) {
      return res.status(404).json({
        success: false,
        message: 'Knowledge graph not found'
      });
    }

    if (graph.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this graph'
      });
    }

    graph = await KnowledgeGraph.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    logger.info(`Graph updated: ${graph._id}`);

    res.status(200).json({
      success: true,
      data: graph
    });
  } catch (error) {
    logger.error('Update graph error:', error);
    next(error);
  }
};

// @desc    Delete knowledge graph
// @route   DELETE /api/graph/:id
// @access  Private
const deleteGraph = async (req, res, next) => {
  try {
    const graph = await KnowledgeGraph.findById(req.params.id);

    if (!graph) {
      return res.status(404).json({
        success: false,
        message: 'Knowledge graph not found'
      });
    }

    if (graph.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this graph'
      });
    }

    await graph.deleteOne();

    logger.info(`Graph deleted: ${graph._id}`);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error('Delete graph error:', error);
    next(error);
  }
};

module.exports = {
  generateGraph,
  getGraph,
  getUserGraphs,
  updateGraph,
  deleteGraph
};