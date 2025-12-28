const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const portfolioRoutes = require('./routes/portfolio');
const githubRoutes = require('./routes/github');
const netlifyRoutes = require('./routes/netlify');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/netlify', netlifyRoutes);

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});