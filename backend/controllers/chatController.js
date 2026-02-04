const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');
const Paper = require('../models/Paper');
const logger = require('../utils/logger');
const mlService = require('../services/mlService');

// @desc    Create new chat session
// @route   POST /api/chat/sessions
// @access  Private
const createSession = async (req, res, next) => {
  try {
    const { title, papers } = req.body;

    const session = await ChatSession.create({
      user: req.user.id,
      title: title || 'New Research Session',
      papers: papers || []
    });

    logger.info(`Chat session created: ${session._id}`);

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    logger.error('Create session error:', error);
    next(error);
  }
};

// @desc    Get all sessions for user
// @route   GET /api/chat/sessions
// @access  Private
const getSessions = async (req, res, next) => {
  try {
    const sessions = await ChatSession.find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .populate('papers', 'title authors');

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    logger.error('Get sessions error:', error);
    next(error);
  }
};

// @desc    Get single session
// @route   GET /api/chat/sessions/:id
// @access  Private
const getSession = async (req, res, next) => {
  try {
    const session = await ChatSession.findById(req.params.id)
      .populate('papers', 'title authors abstract url');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Make sure user owns this session
    if (session.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this session'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    logger.error('Get session error:', error);
    next(error);
  }
};

// @desc    Update session
// @route   PUT /api/chat/sessions/:id
// @access  Private
const updateSession = async (req, res, next) => {
  try {
    let session = await ChatSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Make sure user owns this session
    if (session.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this session'
      });
    }

    session = await ChatSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('papers', 'title authors');

    logger.info(`Session updated: ${session._id}`);

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    logger.error('Update session error:', error);
    next(error);
  }
};

// @desc    Delete session
// @route   DELETE /api/chat/sessions/:id
// @access  Private
const deleteSession = async (req, res, next) => {
  try {
    const session = await ChatSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Make sure user owns this session
    if (session.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this session'
      });
    }

    // Delete all messages in this session
    await Message.deleteMany({ session: session._id });

    await session.deleteOne();

    logger.info(`Session deleted: ${session._id}`);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error('Delete session error:', error);
    next(error);
  }
};

// @desc    Ask question in a session
// @route   POST /api/chat/sessions/:id/ask
// @access  Private
const askQuestion = async (req, res, next) => {
  try {
    const { question, paperIds } = req.body;
    const sessionId = req.params.id;

    const startTime = Date.now();

    // Get session
    const session = await ChatSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Make sure user owns this session
    if (session.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this session'
      });
    }

    // Get papers
    const papers = await Paper.find({ _id: { $in: paperIds } });

    if (papers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No papers found with provided IDs'
      });
    }

    // Call ML service to generate answer
    const ragResponse = await mlService.generateAnswer(question, papers);

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Create message
    const message = await Message.create({
      session: sessionId,
      question,
      answer: ragResponse.answer,
      citations: ragResponse.citations,
      relatedPapers: paperIds,
      processingTime
    });

    // Update session timestamp
    session.updatedAt = Date.now();
    await session.save();

    // Populate message
    const populatedMessage = await Message.findById(message._id)
      .populate('relatedPapers', 'title authors url')
      .populate('citations.paperId', 'title authors');

    logger.info(`Question answered in session ${sessionId}: ${question}`);

    res.status(200).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    logger.error('Ask question error:', error);
    next(error);
  }
};

// @desc    Get messages in a session
// @route   GET /api/chat/sessions/:id/messages
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const sessionId = req.params.id;

    // Verify session exists and user owns it
    const session = await ChatSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this session'
      });
    }

    // Get messages
    const messages = await Message.find({ session: sessionId })
      .sort({ createdAt: 1 })
      .populate('relatedPapers', 'title authors url')
      .populate('citations.paperId', 'title authors');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    logger.error('Get messages error:', error);
    next(error);
  }
};

// @desc    Add papers to session
// @route   POST /api/chat/sessions/:id/papers
// @access  Private
const addPapersToSession = async (req, res, next) => {
  try {
    const { paperIds } = req.body;
    const sessionId = req.params.id;

    const session = await ChatSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this session'
      });
    }

    // Add papers (avoid duplicates)
    const uniquePapers = [...new Set([...session.papers, ...paperIds])];
    session.papers = uniquePapers;
    session.updatedAt = Date.now();
    await session.save();

    const updatedSession = await ChatSession.findById(sessionId)
      .populate('papers', 'title authors abstract');

    logger.info(`Papers added to session ${sessionId}`);

    res.status(200).json({
      success: true,
      data: updatedSession
    });
  } catch (error) {
    logger.error('Add papers to session error:', error);
    next(error);
  }
};

module.exports = {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  askQuestion,
  getMessages,
  addPapersToSession
};