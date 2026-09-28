const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (networkErr) {
    throw new Error(`Could not reach the API at ${API_BASE}. Is the server running?`);
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body && body.error) message = body.error;
    } catch (_) {
      // response wasn't JSON; keep the generic message
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

/** Agent 1 - Requirements Analyst: turns a scenario into functional/non-functional requirements. */
export function runRequirementsAgent(scenario) {
  return request('/analysis/requirements', {
    method: 'POST',
    body: JSON.stringify({ scenario }),
  });
}

/** Agent 2 - SDLC Advisor: takes the scenario + Agent 1's requirements, recommends an SDLC model, and saves the record. */
export function runSDLCAgent(scenario, requirements) {
  return request('/analysis/sdlc', {
    method: 'POST',
    body: JSON.stringify({ scenario, requirements }),
  });
}

export function fetchHistory() {
  return request('/analysis');
}

export function deleteAnalysis(id) {
  return request(`/analysis/${id}`, { method: 'DELETE' });
}
