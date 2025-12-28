const axios = require('axios');

const createGithubRepo = async (username, repoName, githubToken) => {
  try {
    const response = await axios.post('https://api.github.com/user/repos', {
      name: repoName,
      description: `Portfolio website for ${username}`,
      homepage: `https://${username.toLowerCase()}.netlify.app`,
      private: false,
      has_issues: true,
      has_projects: true,
      has_wiki: false,
      auto_init: true,
      gitignore_template: 'Node',
      license_template: 'mit'
    }, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('GitHub API Error:', error.response?.data);
    throw error;
  }
};

const uploadFilesToRepo = async (username, repoName, portfolioFiles, githubToken) => {
  try {
    // Get the default branch (usually main or master)
    const repoResponse = await axios.get(`https://api.github.com/repos/${username}/${repoName}`, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const defaultBranch = repoResponse.data.default_branch;

    // Upload each file
    for (const [filename, content] of Object.entries(portfolioFiles)) {
      await uploadFileToRepo(username, repoName, filename, content, githubToken, defaultBranch);
    }

    return true;
  } catch (error) {
    console.error('File upload error:', error.response?.data);
    throw error;
  }
};

const uploadFileToRepo = async (username, repoName, filename, content, githubToken, branch = 'main') => {
  try {
    // Check if file exists
    let sha = null;
    try {
      const existingFile = await axios.get(`https://api.github.com/repos/${username}/${repoName}/contents/${filename}`, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      sha = existingFile.data.sha;
    } catch (error) {
      // File doesn't exist, which is fine for new files
    }

    // Upload or update file
    const response = await axios.put(`https://api.github.com/repos/${username}/${repoName}/contents/${filename}`, {
      message: sha ? `Update ${filename}` : `Add ${filename}`,
      content: Buffer.from(content).toString('base64'),
      branch: branch,
      ...(sha && { sha })
    }, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error uploading ${filename}:`, error.response?.data);
    throw error;
  }
};

const checkGithubToken = async (githubToken) => {
  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
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

module.exports = {
  createGithubRepo,
  uploadFilesToRepo,
  uploadFileToRepo,
  checkGithubToken
};