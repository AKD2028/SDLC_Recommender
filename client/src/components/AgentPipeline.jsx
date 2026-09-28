import RequirementsPanel from './RequirementsPanel.jsx';
import SDLCPanel from './SDLCPanel.jsx';

function LoadingLine({ label }) {
  return (
    <div className="loading-line">
      <span className="spinner" aria-hidden="true" /> {label}
    </div>
  );
}

function AgentCard({ number, name, accent, status, description, children }) {
  return (
    <div className={`agent-card agent-${accent}`}>
      <div className="agent-card-head">
        <span className="agent-badge">{number}</span>
        <div className="agent-card-titles">
          <h2>{name}</h2>
          <p className="agent-desc">{description}</p>
        </div>
        <span className={`status-dot status-${status}`} title={status} />
      </div>
      <div className="agent-card-body">{children}</div>
    </div>
  );
}

export default function AgentPipeline({ stage, requirements, sdlc, error }) {
  if (stage === 'idle') return null;

  const showAgent2Card = stage === 'agent2' || stage === 'done' || (stage === 'error' && requirements);

  return (
    <section className="pipeline">
      <AgentCard
        number={1}
        name="Requirements Analyst"
        accent="req"
        status={stage === 'agent1' ? 'working' : requirements ? 'done' : 'waiting'}
        description="Reads the scenario and drafts functional requirements, non-functional requirements and constraints."
      >
        {stage === 'agent1' && <LoadingLine label="Drafting requirements…" />}
        {requirements && <RequirementsPanel data={requirements} />}
      </AgentCard>

      {showAgent2Card && (
        <div className="handoff" aria-hidden="true">
          <span className="handoff-line" />
          <span className="handoff-label">hands off to Agent 2</span>
        </div>
      )}

      {showAgent2Card && (
        <AgentCard
          number={2}
          name="SDLC Advisor"
          accent="sdlc"
          status={stage === 'agent2' ? 'working' : sdlc ? 'done' : 'waiting'}
          description="Uses the requirements and constraints above to recommend a development process model."
        >
          {stage === 'agent2' && <LoadingLine label="Comparing SDLC models…" />}
          {sdlc && <SDLCPanel data={sdlc} />}
        </AgentCard>
      )}

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}
    </section>
  );
}
