const axios = require('axios');

const deployToNetlify = async (repoUrl, siteName, netlifyToken) => {
  try {
    // Create a new site
    const siteResponse = await axios.post('https://api.netlify.com/api/v1/sites', {
      name: siteName,
      repo: {
        provider: 'github',
        repo: repoUrl.replace('https://github.com/', ''),
        branch: 'main',
        dir: '/',
        cmd: 'echo "Static site deployment"'
      },
      build_settings: {
        provider: 'github',
        repo_branch: 'main',
        dir: '/',
        cmd: 'echo "Static site deployment"'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/json'
      }
    });

    const siteId = siteResponse.data.id;
    const siteUrl = siteResponse.data.url;

    // Configure continuous deployment
    await axios.post(`https://api.netlify.com/api/v1/sites/${siteId}/builds`, {
      clear_cache: true
    }, {
      headers: {
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      siteId: siteId,
      url: siteUrl,
      deploy_url: siteUrl,
      admin_url: `https://app.netlify.com/sites/${siteResponse.data.name}/overview`
    };
  } catch (error) {
    console.error('Netlify deployment error:', error.response?.data);
    throw error;
  }
};

const checkNetlifyToken = async (netlifyToken) => {
  try {
    const response = await axios.get('https://api.netlify.com/api/v1/user', {
      headers: {
        'Authorization': `Bearer ${netlifyToken}`
      }
    });

    return {
      valid: true,
      user: response.data
    };
  } catch (error) {
    return {
      valid: false,
      error: error.response?.data?.message || 'Invalid token'
    };
  }
};

const getSites = async (netlifyToken) => {
  try {
    const response = await axios.get('https://api.netlify.com/api/v1/sites', {
      headers: {
        'Authorization': `Bearer ${netlifyToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching sites:', error.response?.data);
    throw error;
  }
};

module.exports = {
  deployToNetlify,
  checkNetlifyToken,
  getSites
};