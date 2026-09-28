require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const analysisRoutes = require('./routes/analysis');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
    apiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.use('/api/analysis', analysisRoutes);

// Fallback handler for unknown routes.
app.use((req, res) => {
  res.status(404).json({ error: `No route ${req.method} ${req.originalUrl}` });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`FirstDraft server running on http://localhost:${PORT}`);
    if (!process.env.GEMINI_API_KEY) {
      console.warn('Warning: GEMINI_API_KEY is not set. Add it to server/.env before running an analysis.');
    }
  });
});
