import React, { useState } from 'react';
import './App.css'; // Assuming standard Vite styling or you can add Tailwind

function App() {
  const [query, setQuery] = useState('');
  const [pipeline, setPipeline] = useState('rag_fusion');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, pipeline }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>RAG Pipeline Evaluator</h1>
      <p>Test different RAG strategies against the pre-crawled financial and general knowledge web index.</p>

      <form onSubmit={handleQuery} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        
        <div>
          <label htmlFor="pipeline-select"><strong>Select Strategy:</strong></label>
          <select 
            id="pipeline-select"
            value={pipeline} 
            onChange={(e) => setPipeline(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="rag_fusion">RAG Fusion</option>
            <option value="hyde">HyDE</option>
            <option value="crag">CRAG (Corrective RAG)</option>
            <option value="graph_rag">Graph RAG</option>
          </select>
        </div>

        <div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Which athlete has won more Grand Slams, Federer or Nadal?"
            rows={3}
            style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Running Pipeline...' : 'Generate Answer'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="results-container" style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
          
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h2 style={{ marginTop: 0 }}>Generated Answer</h2>
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{result.answer}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Pipeline Metric</span>
              <span style={{ backgroundColor: '#28a745', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9em' }}>
                Score / Confidence: {result.score.toFixed(4)}
              </span>
            </h3>
            <p style={{ fontSize: '0.9em', color: '#555' }}>
              <em>(Note: RAG Fusion, HyDE, and Graph RAG show retrieval similarity scores. CRAG shows the LLM Judge confidence score.)</em>
            </p>
          </div>

          <div>
            <h3>Retrieved Context (Global Index)</h3>
            <pre style={{ backgroundColor: '#2d2d2d', color: '#ccc', padding: '15px', borderRadius: '5px', overflowX: 'auto', whiteSpace: 'pre-wrap', fontSize: '0.9em' }}>
              {result.context || "No context retrieved or context skipped due to low confidence."}
            </pre>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;