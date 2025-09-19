const express = require('express');
const authRoutes = require('./authRoutes');
const contactRoutes = require('./contactRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/contacts', contactRoutes);

module.exports = router;
