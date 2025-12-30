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
    const { repoUrl, projectName, vercelToken } = req.body;

    if (!repoUrl || !projectName || !vercelToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: repoUrl, projectName, vercelToken'
      });
    }

    const vercelApi = axios.create({
      baseURL: 'https://api.vercel.com',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Extract GitHub repo info
    const repoMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!repoMatch) {
      throw new Error('Invalid GitHub repository URL');
    }
    
    const [, owner, repo] = repoMatch;
    const repoName = repo.replace('.git', '');

    // Step 1: Create project
    console.log(`Creating Vercel project: ${projectName}`);
    
    const projectData = {
      name: projectName,
      gitRepository: {
        type: 'github',
        repo: `${owner}/${repoName}`
      },
      buildCommand: null, // Static site, no build needed
      devCommand: null,
      installCommand: null,
      outputDirectory: null,
      publicSource: null,
      rootDirectory: null,
      serverlessFunctionRegion: 'iad1',
      framework: null
    };

    let projectResponse;
    try {
      projectResponse = await vercelApi.post('/v9/projects', projectData);
    } catch (error) {
      if (error.response?.status === 409) {
        // Project name already exists, try with a random suffix
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        projectData.name = `${projectName}-${randomSuffix}`;
        projectResponse = await vercelApi.post('/v9/projects', projectData);
      } else {
        throw error;
      }
    }

    const project = projectResponse.data;
    console.log(`✅ Project created: ${project.name}`);

    // Step 2: Link GitHub repository
    console.log('Linking GitHub repository...');
    
    await vercelApi.post(`/v9/projects/${project.id}/link`, {
      type: 'github',
      repo: `${owner}/${repoName}`,
      gitBranch: 'main'
    });

    // Step 3: Trigger deployment
    console.log('Triggering deployment...');
    
    const deploymentResponse = await vercelApi.post('/v13/deployments', {
      name: project.name,
      project: project.id,
      gitSource: {
        type: 'github',
        repo: `${owner}/${repoName}`,
        ref: 'main'
      },
      target: 'production'
    });

    const deployment = deploymentResponse.data;
    
    // Wait for deployment URL to be ready
    let deploymentUrl = deployment.url;
    if (!deploymentUrl.startsWith('http')) {
      deploymentUrl = `https://${deploymentUrl}`;
    }

    const siteUrl = `https://${project.name}.vercel.app`;
    
    res.json({
      success: true,
      message: 'Project deployed to Vercel successfully',
      siteUrl,
      deploymentUrl,
      adminUrl: `https://vercel.com/${owner}/${project.name}`,
      projectId: project.id,
      projectName: project.name,
      deploymentId: deployment.uid
    });

  } catch (error) {
    console.error('Vercel API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to deploy to Vercel',
      error: error.response?.data
    });
  }
}