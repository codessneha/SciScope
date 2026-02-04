const express = require('express');
const router = express.Router();
const {
  generateGraph,
  getGraph,
  getUserGraphs,
  updateGraph,
  deleteGraph
} = require('../controllers/graphController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getUserGraphs);

router.post('/generate', generateGraph);

router.route('/:id')
  .get(getGraph)
  .put(updateGraph)
  .delete(deleteGraph);

module.exports = router;