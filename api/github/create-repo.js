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
}