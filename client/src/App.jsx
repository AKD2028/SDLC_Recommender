import { useState, useEffect, useCallback } from 'react';
import TopBar from './components/TopBar.jsx';
import ScenarioForm from './components/ScenarioForm.jsx';
import AgentPipeline from './components/AgentPipeline.jsx';
import HistoryView from './components/HistoryView.jsx';
import { runRequirementsAgent, runSDLCAgent, fetchHistory, deleteAnalysis } from './api.js';

export default function App() {
  const [view, setView] = useState('analyze'); // 'analyze' | 'history'
  const [scenario, setScenario] = useState('');

  // stage drives the pipeline UI: idle -> agent1 -> agent2 -> done (or error at any point)
  const [stage, setStage] = useState('idle');
  const [requirements, setRequirements] = useState(null);
  const [sdlc, setSdlc] = useState(null);
  const [error, setError] = useState('');

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const data = await fetchHistory();
      setHistory(data);
    } catch (err) {
      setHistoryError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'history') loadHistory();
  }, [view, loadHistory]);

  async function handleAnalyze(text) {
    setError('');
    setRequirements(null);
    setSdlc(null);
    setStage('agent1');

    try {
      // Agent 1: Requirements Analyst reads the scenario on its own.
      const step1 = await runRequirementsAgent(text);
      setRequirements(step1.requirements);
      setStage('agent2');

      // Agent 2: SDLC Advisor receives Agent 1's output as its input.
      const step2 = await runSDLCAgent(text, step1.requirements);
      setSdlc(step2.sdlc);
      setStage('done');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      setStage('error');
    }
  }

  function handleOpenHistoryItem(item) {
    setScenario(item.scenario);
    setRequirements(item.requirements);
    setSdlc(item.sdlc);
    setStage('done');
    setError('');
    setView('analyze');
  }

  async function handleDeleteHistoryItem(id) {
    const previous = history;
    setHistory((h) => h.filter((i) => i._id !== id));
    try {
      await deleteAnalysis(id);
    } catch (err) {
      setHistory(previous); // put it back if the delete failed
      setHistoryError(err.message);
    }
  }

  return (
    <div className="shell">
      <TopBar view={view} onChangeView={setView} />
      <main className="main">
        {view === 'analyze' ? (
          <>
            <ScenarioForm
              value={scenario}
              onChange={setScenario}
              onSubmit={handleAnalyze}
              busy={stage === 'agent1' || stage === 'agent2'}
            />
            <AgentPipeline stage={stage} requirements={requirements} sdlc={sdlc} error={error} />
          </>
        ) : (
          <HistoryView
            items={history}
            loading={historyLoading}
            error={historyError}
            onSelect={handleOpenHistoryItem}
            onDelete={handleDeleteHistoryItem}
          />
        )}
      </main>
      <footer className="footer">FirstDraft — a two-agent requirements &amp; SDLC assistant, built on the MERN stack.</footer>
    </div>
  );
}
