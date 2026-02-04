const express = require('express');
const router = express.Router();
const {
  searchPapers,
  addPaper,
  getPapers,
  getPaper,
  updatePaper,
  deletePaper,
  semanticSearch,
  getPaperByArxivId
} = require('../controllers/paperController');
const { protect } = require('../middleware/authMiddleware');
const { validate, paperValidationRules } = require('../utils/validators');

// All routes require authentication
router.use(protect);

// Search routes
router.get('/search', validate(paperValidationRules.search), searchPapers);
router.post('/semantic-search', semanticSearch);
router.get('/arxiv/:arxivId', getPaperByArxivId);

// CRUD routes
router.route('/')
  .get(getPapers)
  .post(addPaper);

router.route('/:id')
  .get(getPaper)
  .put(updatePaper)
  .delete(deletePaper);

module.exports = router;