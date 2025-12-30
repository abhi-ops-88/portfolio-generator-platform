const axios = require('axios');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

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
}