import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#0a0e27',
          color: '#f5f7fa',
          padding: '40px',
          fontFamily: 'monospace',
          minHeight: '100vh',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}>
          <h1 style={{ color: '#ff6b6b', marginBottom: '20px' }}>
            🚨 Runtime Error
          </h1>
          <div style={{ color: '#00d4aa', marginBottom: '20px' }}>
            <strong>Error Message:</strong>
          </div>
          <pre style={{
            background: '#1a1f3a',
            padding: '15px',
            borderRadius: '8px',
            overflow: 'auto',
            color: '#ff6b6b',
            marginBottom: '20px'
          }}>
            {this.state.error?.toString()}
          </pre>
          <div style={{ color: '#00d4aa', marginBottom: '20px' }}>
            <strong>Stack Trace:</strong>
          </div>
          <pre style={{
            background: '#1a1f3a',
            padding: '15px',
            borderRadius: '8px',
            overflow: 'auto',
            color: '#a8b2c7',
            maxHeight: '400px'
          }}>
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#00d4aa',
              color: '#0a0e27',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '20px'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
