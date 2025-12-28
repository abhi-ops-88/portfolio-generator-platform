const express = require('express');
const { deployToNetlify } = require('../services/netlifyService');

const router = express.Router();

// Deploy to Netlify
router.post('/deploy', async (req, res) => {
  try {
    const { repoUrl, siteName, netlifyToken } = req.body;
    
    if (!netlifyToken) {
      return res.status(400).json({
        success: false,
        message: 'Netlify token is required'
      });
    }

    const deployment = await deployToNetlify(repoUrl, siteName, netlifyToken);
    
    res.json({
      success: true,
      message: 'Site deployed successfully to Netlify',
      siteUrl: deployment.url,
      deployUrl: deployment.deploy_url,
      adminUrl: deployment.admin_url
    });
  } catch (error) {
    console.error('Netlify deployment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deploy to Netlify',
      error: error.response?.data?.message || error.message
    });
  }
});

module.exports = router;