const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { generatePortfolioFiles } = require('../services/portfolioGenerator');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Generate portfolio
router.post('/generate', upload.fields([
  { name: 'backgroundImage', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 },
  { name: 'projectImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const portfolioData = JSON.parse(req.body.portfolioData);
    const files = req.files;
    
    const portfolioFiles = await generatePortfolioFiles(portfolioData, files);
    
    res.json({
      success: true,
      message: 'Portfolio generated successfully',
      files: portfolioFiles
    });
  } catch (error) {
    console.error('Portfolio generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate portfolio',
      error: error.message
    });
  }
});

module.exports = router;