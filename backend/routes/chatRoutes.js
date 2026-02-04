const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  askQuestion,
  getMessages,
  addPapersToSession
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const { validate, chatValidationRules } = require('../utils/validators');

// All routes require authentication
router.use(protect);

// Session routes
router.route('/sessions')
  .get(getSessions)
  .post(validate(chatValidationRules.create), createSession);

router.route('/sessions/:id')
  .get(getSession)
  .put(updateSession)
  .delete(deleteSession);

// Message routes
router.get('/sessions/:id/messages', getMessages);
router.post('/sessions/:id/ask', validate(chatValidationRules.ask), askQuestion);
router.post('/sessions/:id/papers', addPapersToSession);

module.exports = router;