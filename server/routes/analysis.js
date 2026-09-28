const express = require('express');
const router = express.Router();

const Analysis = require('../models/Analysis');
const requirementsAgent = require('../agents/requirementsAgent');
const sdlcAgent = require('../agents/sdlcAgent');

function friendlyAgentError(err) {
  if (err.message && err.message.includes('GEMINI_API_KEY')) {
    return 'The server is missing a valid GEMINI_API_KEY. Add one to server/.env and restart the server.';
  }
  if (err.status === 401 || err.status === 403) {
    return 'Gemini rejected the API key. Double-check GEMINI_API_KEY in server/.env.';
  }
  if (err.status === 429) {
    return 'Rate limit reached while talking to Gemini. Wait a moment and try again.';
  }
  return null;
}

/**
 * STEP 1 of the pipeline - Agent 1 (Requirements Analyst).
 * POST /api/analysis/requirements
 * body: { scenario: string }
 * Runs independently of the database: this agent only ever reads the scenario text.
 */
router.post('/requirements', async (req, res) => {
  const { scenario } = req.body || {};

  if (!scenario || typeof scenario !== 'string' || !scenario.trim()) {
    return res.status(400).json({ error: 'Please describe a scenario, functionality, or module to analyse.' });
  }
  if (scenario.trim().length < 15) {
    return res.status(400).json({ error: 'Please add a little more detail so the agent has something to work with.' });
  }

  try {
    const requirements = await requirementsAgent.analyze(scenario.trim());
    res.json({ requirements });
  } catch (err) {
    console.error('Requirements Analyst agent failed:', err.message);
    res.status(500).json({ error: friendlyAgentError(err) || 'The Requirements Analyst agent could not complete this scenario. Please try again.' });
  }
});

/**
 * STEP 2 of the pipeline - Agent 2 (SDLC Advisor).
 * POST /api/analysis/sdlc
 * body: { scenario: string, requirements: object }  <- requirements is Agent 1's output
 * On success, this is also the point where the full analysis is persisted to MongoDB,
 * since only now do we have both agents' output to save as one record.
 */
router.post('/sdlc', async (req, res) => {
  const { scenario, requirements } = req.body || {};

  if (!scenario || typeof scenario !== 'string' || !scenario.trim()) {
    return res.status(400).json({ error: 'Missing the original scenario text.' });
  }
  if (!requirements || typeof requirements !== 'object') {
    return res.status(400).json({ error: 'Missing requirements from the Requirements Analyst agent.' });
  }

  try {
    const sdlc = await sdlcAgent.recommend(scenario.trim(), requirements);
    const saved = await Analysis.create({ scenario: scenario.trim(), requirements, sdlc });
    res.status(201).json(saved);
  } catch (err) {
    console.error('SDLC Advisor agent failed:', err.message);
    res.status(500).json({ error: friendlyAgentError(err) || 'The SDLC Advisor agent could not complete this analysis. Please try again.' });
  }
});

/**
 * GET /api/analysis - history, newest first.
 */
router.get('/', async (req, res) => {
  try {
    const items = await Analysis.find().sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (err) {
    console.error('Failed to load history:', err.message);
    res.status(500).json({ error: 'Could not load history from the database.' });
  }
});

/**
 * DELETE /api/analysis/:id - remove one saved analysis.
 */
router.delete('/:id', async (req, res) => {
  try {
    await Analysis.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error('Failed to delete analysis:', err.message);
    res.status(500).json({ error: 'Could not delete this entry.' });
  }
});

module.exports = router;
