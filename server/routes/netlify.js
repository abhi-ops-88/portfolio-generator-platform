const express = require('express');
const axios = require('axios');
const router = express.Router();

// Deploy to Netlify
router.post('/deploy', async (req, res) => {
  try {
    const { repoUrl, siteName, netlifyToken } = req.body;

    if (!repoUrl || !siteName || !netlifyToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: repoUrl, siteName, netlifyToken'
      });
    }

    const netlifyApi = axios.create({
      baseURL: 'https://api.netlify.com/api/v1',
      headers: {
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Step 1: Create site
    console.log(`Creating Netlify site: ${siteName}`);
    
    const siteData = {
      name: siteName,
      repo: {
        provider: 'github',
        repo: repoUrl.replace('https://github.com/', ''),
        branch: 'main',
        dir: '/',
        cmd: 'echo "Static site - no build required"'
      },
      build_settings: {
        cmd: 'echo "Static site - no build required"',
        dir: '/',
        env: {}
      }
    };

    let siteResponse;
    try {
      siteResponse = await netlifyApi.post('/sites', siteData);
    } catch (error) {
      if (error.response?.status === 422 && error.response?.data?.message?.includes('name has already been taken')) {
        // Site name already exists, try with a random suffix
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        siteData.name = `${siteName}-${randomSuffix}`;
        siteResponse = await netlifyApi.post('/sites', siteData);
      } else {
        throw error;
      }
    }

    const site = siteResponse.data;
    console.log(`✅ Site created: ${site.name}`);

    // Step 2: Connect to GitHub repository
    console.log('Connecting to GitHub repository...');
    
    await netlifyApi.patch(`/sites/${site.id}`, {
      repo: {
        provider: 'github',
        repo: repoUrl.replace('https://github.com/', ''),
        branch: 'main',
        dir: '/'
      }
    });

    // Step 3: Trigger initial deploy
    console.log('Triggering initial deployment...');
    
    await netlifyApi.post(`/sites/${site.id}/builds`);

    const siteUrl = `https://${site.name}.netlify.app`;
    
    res.json({
      success: true,
      message: 'Site deployed to Netlify successfully',
      siteUrl,
      adminUrl: `https://app.netlify.com/sites/${site.name}`,
      siteId: site.id,
      siteName: site.name
    });

  } catch (error) {
    console.error('Netlify API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to deploy to Netlify',
      error: error.response?.data
    });
  }
});

// Get deployment status
router.get('/status/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params;
    const { netlifyToken } = req.query;

    if (!netlifyToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing netlifyToken in query parameters'
      });
    }

    const netlifyApi = axios.create({
      baseURL: 'https://api.netlify.com/api/v1',
      headers: {
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/json'
      }
    });

    const [siteResponse, deploysResponse] = await Promise.all([
      netlifyApi.get(`/sites/${siteId}`),
      netlifyApi.get(`/sites/${siteId}/deploys?per_page=1`)
    ]);

    const site = siteResponse.data;
    const latestDeploy = deploysResponse.data[0];

    res.json({
      success: true,
      site: {
        id: site.id,
        name: site.name,
        url: site.url,
        adminUrl: site.admin_url,
        state: site.state
      },
      deploy: latestDeploy ? {
        id: latestDeploy.id,
        state: latestDeploy.state,
        createdAt: latestDeploy.created_at,
        deployUrl: latestDeploy.deploy_url
      } : null
    });

  } catch (error) {
    console.error('Netlify Status Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to get Netlify status',
      error: error.response?.data
    });
  }
});

module.exports = router;