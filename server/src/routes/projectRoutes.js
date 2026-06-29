const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// Public reads
router.get('/', getProjects);
router.get('/:id', getProject);

// Admin writes
router.post('/', protect, requireRole('admin'), createProject);
router.delete('/:id', protect, requireRole('admin'), deleteProject);

module.exports = router;
