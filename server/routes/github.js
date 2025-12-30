const express = require('express');
const axios = require('axios');
const router = express.Router();

// Create GitHub repository and upload files
router.post('/create-repo', async (req, res) => {
  try {
    const { username, repoName, portfolioFiles, githubToken } = req.body;

    if (!username || !repoName || !portfolioFiles || !githubToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: username, repoName, portfolioFiles, githubToken'
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

    // Step 1: Create repository
    console.log(`Creating repository: ${username}/${repoName}`);
    
    try {
      await githubApi.post('/user/repos', {
        name: repoName,
        description: 'Professional portfolio website generated with Portfolio Generator',
        private: false,
        auto_init: true,
        homepage: `https://${username}.github.io/${repoName}`
      });
    } catch (error) {
      if (error.response?.status === 422) {
        // Repository already exists, continue with file upload
        console.log('Repository already exists, continuing...');
      } else {
        throw error;
      }
    }

    // Step 2: Upload files to repository
    console.log('Uploading portfolio files...');
    
    const uploadPromises = Object.entries(portfolioFiles).map(async ([filename, content]) => {
      try {
        // Check if file already exists
        let sha = null;
        try {
          const existingFile = await githubApi.get(`/repos/${username}/${repoName}/contents/${filename}`);
          sha = existingFile.data.sha;
        } catch (error) {
          // File doesn't exist, which is fine
        }

        // Upload or update file
        const fileContent = Buffer.from(content).toString('base64');
        
        const uploadData = {
          message: sha ? `Update ${filename}` : `Add ${filename}`,
          content: fileContent,
          branch: 'main'
        };

        if (sha) {
          uploadData.sha = sha;
        }

        await githubApi.put(`/repos/${username}/${repoName}/contents/${filename}`, uploadData);
        console.log(`✅ Uploaded: ${filename}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${filename}:`, error.response?.data || error.message);
        throw error;
      }
    });

    await Promise.all(uploadPromises);

    const repoUrl = `https://github.com/${username}/${repoName}`;
    const cloneUrl = `https://github.com/${username}/${repoName}.git`;
    const siteUrl = `https://${username}.github.io/${repoName}`;

    res.json({
      success: true,
      message: 'Repository created and files uploaded successfully',
      repoUrl,
      cloneUrl,
      siteUrl,
      filesUploaded: Object.keys(portfolioFiles).length
    });

  } catch (error) {
    console.error('GitHub repository creation error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create repository'
    });
  }
});

// Update files in existing repository
router.post('/update-files', async (req, res) => {
  try {
    const { username, repoName, portfolioFiles, githubToken } = req.body;

    if (!username || !repoName || !portfolioFiles || !githubToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: username, repoName, portfolioFiles, githubToken'
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

    console.log(`Updating files in repository: ${username}/${repoName}`);
    
    const uploadPromises = Object.entries(portfolioFiles).map(async ([filename, content]) => {
      try {
        // Get existing file SHA if it exists
        let sha = null;
        try {
          const existingFile = await githubApi.get(`/repos/${username}/${repoName}/contents/${filename}`);
          sha = existingFile.data.sha;
        } catch (error) {
          // File doesn't exist, will create new
        }

        const fileContent = Buffer.from(content).toString('base64');
        
        const uploadData = {
          message: `Update ${filename} - ${new Date().toISOString()}`,
          content: fileContent,
          branch: 'main'
        };

        if (sha) {
          uploadData.sha = sha;
        }

        await githubApi.put(`/repos/${username}/${repoName}/contents/${filename}`, uploadData);
        console.log(`✅ Updated: ${filename}`);
      } catch (error) {
        console.error(`❌ Failed to update ${filename}:`, error.response?.data || error.message);
        throw error;
      }
    });

    await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: 'Repository files updated successfully',
      filesUpdated: Object.keys(portfolioFiles).length
    });

  } catch (error) {
    console.error('GitHub file update error:', error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update repository files'
    });
  }
});
        const fileData = {
          message: `Add ${filename}`,
          content: Buffer.from(content).toString('base64'),
          ...(sha && { sha })
        };

        await githubApi.put(`/repos/${username}/${repoName}/contents/${filename}`, fileData);
        console.log(`✅ Uploaded: ${filename}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${filename}:`, error.response?.data || error.message);
        throw new Error(`Failed to upload ${filename}: ${error.response?.data?.message || error.message}`);
      }
    });

    await Promise.all(uploadPromises);

    const repoUrl = `https://github.com/${username}/${repoName}`;
    
    res.json({
      success: true,
      message: 'Repository created and files uploaded successfully',
      repoUrl,
      cloneUrl: `https://github.com/${username}/${repoName}.git`,
      username,
      repoName
    });

  } catch (error) {
    console.error('GitHub API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create GitHub repository',
      error: error.response?.data
    });
  }
});

// Setup GitHub Pages
router.post('/setup-pages', async (req, res) => {
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
});

module.exports = router;