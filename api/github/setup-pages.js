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
    const { username, repoName, githubToken } = req.body;

    if (!username || !repoName || !githubToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: username, repoName, githubToken'
      });
    }

    const githubApi = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Generator'
      }
    });

    // Enable GitHub Pages
    console.log(`Setting up GitHub Pages for ${username}/${repoName}`);
    
    try {
      await githubApi.post(`/repos/${username}/${repoName}/pages`, {
        source: {
          branch: 'main',
          path: '/'
        }
      });
    } catch (error) {
      if (error.response?.status === 409) {
        // Pages already enabled
        console.log('GitHub Pages already enabled');
      } else {
        throw error;
      }
    }

    // Wait a moment for Pages to be set up
    await new Promise(resolve => setTimeout(resolve, 2000));

    const siteUrl = `https://${username}.github.io/${repoName}`;
    
    res.json({
      success: true,
      message: 'GitHub Pages enabled successfully',
      siteUrl,
      adminUrl: `https://github.com/${username}/${repoName}/settings/pages`
    });

  } catch (error) {
    console.error('GitHub Pages Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to setup GitHub Pages',
      error: error.response?.data
    });
  }
}