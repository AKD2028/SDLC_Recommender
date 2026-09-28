export default function RequirementsPanel({ data }) {
  const {
    summary = '',
    functionalRequirements = [],
    nonFunctionalRequirements = [],
    constraints = [],
    assumptions = [],
  } = data || {};

  return (
    <div className="requirements">
      {summary && <p className="summary">{summary}</p>}

      {functionalRequirements.length > 0 && (
        <>
          <h3>Functional requirements</h3>
          <ul className="req-list">
            {functionalRequirements.map((r) => (
              <li key={r.id}>
                <span className="req-id">{r.id}</span>
                <span className="req-statement">{r.statement}</span>
                <span className={`pill pill-${(r.priority || '').toLowerCase()}`}>{r.priority}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {nonFunctionalRequirements.length > 0 && (
        <>
          <h3>Non-functional requirements</h3>
          <ul className="req-list">
            {nonFunctionalRequirements.map((r) => (
              <li key={r.id}>
                <span className="req-id">{r.id}</span>
                <span className="req-category">{r.category}</span>
                <span className="req-statement">{r.statement}</span>
                <span className={`pill pill-${(r.priority || '').toLowerCase()}`}>{r.priority}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {constraints.length > 0 && (
        <>
          <h3>Constraints</h3>
          <ul className="req-list">
            {constraints.map((c) => (
              <li key={c.id}>
                <span className="req-id">{c.id}</span>
                <span className="req-category">{c.category}</span>
                <span className="req-statement">{c.statement}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {assumptions.length > 0 && (
        <>
          <h3>Assumptions</h3>
          <ul className="plain-list">
            {assumptions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
