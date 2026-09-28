export default function TopBar({ view, onChangeView }) {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-mark" aria-hidden="true" />
        FirstDraft
      </div>
      <nav className="topbar-nav">
        <button
          type="button"
          className={view === 'analyze' ? 'tab tab-active' : 'tab'}
          onClick={() => onChangeView('analyze')}
        >
          New analysis
        </button>
        <button
          type="button"
          className={view === 'history' ? 'tab tab-active' : 'tab'}
          onClick={() => onChangeView('history')}
        >
          History
        </button>
      </nav>
    </header>
  );
}
