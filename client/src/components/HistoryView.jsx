import { useState } from 'react';
import RequirementsPanel from './RequirementsPanel.jsx';
import SDLCPanel from './SDLCPanel.jsx';

export default function HistoryView({ items, loading, error, onSelect, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);

  if (loading) {
    return (
      <section className="panel">
        <p className="lede">Loading history…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel">
        <div className="error-banner" role="alert">{error}</div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="panel empty-state">
        <h2>No analyses yet</h2>
        <p>Run your first scenario from &ldquo;New analysis&rdquo; and it will show up here.</p>
      </section>
    );
  }

  return (
    <section className="panel history-panel">
      <h1>Past analyses</h1>
      <ul className="history-list">
        {items.map((item) => {
          const isOpen = expandedId === item._id;
          const topModel = item.sdlc?.recommendations?.[0]?.model;
          return (
            <li key={item._id} className="history-row">
              <button
                type="button"
                className="history-summary"
                onClick={() => setExpandedId(isOpen ? null : item._id)}
              >
                <span className="history-scenario">{item.scenario}</span>
                <span className="history-meta">
                  {topModel && <span className="pill pill-model">{topModel}</span>}
                  <span className="history-date">{new Date(item.createdAt).toLocaleString()}</span>
                </span>
              </button>
              <div className="history-actions">
                <button type="button" className="link-btn" onClick={() => onSelect(item)}>
                  Reopen
                </button>
                <button type="button" className="link-btn danger" onClick={() => onDelete(item._id)}>
                  Delete
                </button>
              </div>
              {isOpen && (
                <div className="history-detail">
                  <RequirementsPanel data={item.requirements} />
                  <SDLCPanel data={item.sdlc} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
