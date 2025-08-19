const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const imageRoutes = require('./imageRoutes');

router.use('/auth', authRoutes);
router.use('/image', imageRoutes);

module.exports = router;