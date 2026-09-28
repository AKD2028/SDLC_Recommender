const { GoogleGenAI } = require('@google/genai');

const MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';

let client = null;
function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY is not set. Add it to server/.env (see server/.env.example).'
    );
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}

/**
 * Minimal base class for a single-purpose LLM agent.
 * Each concrete agent (RequirementsAgent, SDLCAgent) gets its own
 * name, role and system prompt, and calls `thinkJSON` to get a
 * structured answer back from Gemini.
 */
class Agent {
  constructor(name, role, systemPrompt) {
    this.name = name;
    this.role = role;
    this.systemPrompt = systemPrompt;
  }

  /** Calls Gemini with this agent's system prompt and returns the raw text reply. */
  async think(userPrompt) {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: userPrompt,
      config: {
        systemInstruction: this.systemPrompt,
        // Ask Gemini to only ever return JSON - removes most of the need
        // for defensive parsing on our side.
        responseMimeType: 'application/json',
      },
    });

    return response.text || '';
  }

  /** Same as think(), but parses the reply as JSON (agents are prompted to reply in JSON only). */
  async thinkJSON(userPrompt) {
    const raw = await this.think(userPrompt);
    return this.parseJSON(raw);
  }

  parseJSON(raw) {
    let text = raw.trim();
    // Defensive: strip a markdown fence if the model ever adds one anyway.
    text = text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();

    try {
      return JSON.parse(text);
    } catch (firstError) {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch (secondError) {
          // fall through to the error below
        }
      }
      throw new Error(
        `${this.name} agent did not return valid JSON. Raw reply started with: ${text.slice(0, 200)}`
      );
    }
  }
}

module.exports = Agent;
