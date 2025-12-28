const express = require('express');
const axios = require('axios');
const { createGithubRepo, uploadFilesToRepo } = require('../services/githubService');

const router = express.Router();

// Create GitHub repository and upload files
router.post('/create-repo', async (req, res) => {
  try {
    const { username, repoName, portfolioFiles, githubToken } = req.body;
    
    if (!githubToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub token is required'
      });
    }

    // Create repository
    const repo = await createGithubRepo(username, repoName, githubToken);
    
    // Upload portfolio files to repository
    await uploadFilesToRepo(username, repoName, portfolioFiles, githubToken);
    
    res.json({
      success: true,
      message: 'Repository created and files uploaded successfully',
      repoUrl: repo.html_url,
      cloneUrl: repo.clone_url
    });
  } catch (error) {
    console.error('GitHub repository creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create GitHub repository',
      error: error.response?.data?.message || error.message
    });
  }
});

// Check if username is available
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const response = await axios.get(`https://api.github.com/users/${username}`);
    
    res.json({
      available: false,
      exists: true,
      user: response.data
    });
  } catch (error) {
    if (error.response?.status === 404) {
      res.json({
        available: true,
        exists: false
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to check username availability'
      });
    }
  }
});

module.exports = router;