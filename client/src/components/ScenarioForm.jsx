const EXAMPLES = [
  'An online library system where members can search the catalogue, reserve books, and pay overdue fines.',
  'A ride-hailing app module that matches drivers to riders and calculates fares in real time.',
  'A hospital appointment scheduler that lets patients book, reschedule, and receive reminders.',
];

export default function ScenarioForm({ value, onChange, onSubmit, busy }) {
  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim() || busy) return;
    onSubmit(value.trim());
  }

  return (
    <section className="panel form-panel">
      <h1>Describe what you&rsquo;re building</h1>
      <p className="lede">
        Give a scenario, a feature, or a module in plain language. The Requirements Analyst agent drafts the
        requirements and constraints, then the SDLC Advisor agent recommends how to build it.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. An online library system where members can search the catalogue, reserve books, and pay overdue fines."
          rows={5}
          disabled={busy}
        />
        <div className="form-row">
          <div className="examples">
            Try:
            {EXAMPLES.map((ex, i) => (
              <button
                type="button"
                key={i}
                className="example-chip"
                onClick={() => onChange(ex)}
                disabled={busy}
              >
                Example {i + 1}
              </button>
            ))}
          </div>
          <button type="submit" className="btn-primary" disabled={busy || !value.trim()}>
            {busy ? 'Agents working…' : 'Run the agents'}
          </button>
        </div>
      </form>
    </section>
  );
}
