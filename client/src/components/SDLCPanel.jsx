function ScoreBar({ value, color, thin }) {
  const width = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className={thin ? 'score-bar-track thin' : 'score-bar-track'}>
      <div className="score-bar-fill" style={{ width: `${width}%`, background: color }} />
    </div>
  );
}

export default function SDLCPanel({ data }) {
  const { recommendations = [], justification = '', keyFactors = [] } = data || {};
  const [primary, ...alternatives] = recommendations;

  return (
    <div className="sdlc">
      {primary && (
        <div className="sdlc-primary-block">
          <div className="sdlc-primary">
            <span className="sdlc-model">{primary.model}</span>
            <span className="sdlc-score">{primary.matchScore}% match</span>
          </div>
          <ScoreBar value={primary.matchScore} color="var(--agent-sdlc)" />
        </div>
      )}

      {justification && <p className="justification">{justification}</p>}

      {keyFactors.length > 0 && (
        <>
          <h3>Key factors considered</h3>
          <ul className="plain-list">
            {keyFactors.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </>
      )}

      {alternatives.length > 0 && (
        <>
          <h3>Also considered</h3>
          <ul className="alt-list">
            {alternatives.map((a, i) => (
              <li key={i}>
                <div className="alt-head">
                  <span className="sdlc-model-alt">{a.model}</span>
                  <span className="sdlc-score-alt">{a.matchScore}%</span>
                </div>
                <ScoreBar value={a.matchScore} color="var(--ink-soft)" thin />
                <span className="alt-reason">{a.reasoning}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
