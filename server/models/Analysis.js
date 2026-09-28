const mongoose = require('mongoose');

const RequirementSchema = new mongoose.Schema(
  {
    id: String,
    statement: String,
    category: String, // only set on non-functional requirements
    priority: String,
  },
  { _id: false }
);

const ConstraintSchema = new mongoose.Schema(
  {
    id: String,
    category: String,
    statement: String,
  },
  { _id: false }
);

const SDLCRecommendationSchema = new mongoose.Schema(
  {
    model: String,
    matchScore: Number,
    reasoning: String,
  },
  { _id: false }
);

const AnalysisSchema = new mongoose.Schema({
  scenario: { type: String, required: true },

  // Output of Agent 1 (Requirements Analyst)
  requirements: {
    summary: String,
    functionalRequirements: [RequirementSchema],
    nonFunctionalRequirements: [RequirementSchema],
    constraints: [ConstraintSchema],
    assumptions: [String],
  },

  // Output of Agent 2 (SDLC Advisor)
  sdlc: {
    recommendations: [SDLCRecommendationSchema],
    justification: String,
    keyFactors: [String],
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
