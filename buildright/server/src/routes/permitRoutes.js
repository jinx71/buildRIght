const express = require('express');
const { listPermits } = require('../controllers/permitController');

const router = express.Router();

// Public — but served from our backend cache, not the third party directly.
router.get('/', listPermits);

module.exports = router;
