import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary container">
          <div className="error-card glass">
            <div className="error-header">
              <AlertTriangle className="error-icon" size={48} />
              <h1>System Integrity Interrupted</h1>
            </div>
            <p className="error-message">
              VoterWise encountered an unexpected state while processing authoritative civic data.
            </p>
            {this.state.error && (
              <pre className="error-details">
                {this.state.error.message}
              </pre>
            )}
            <button onClick={this.handleReset} className="btn-primary">
              <RefreshCcw size={18} /> Re-initialize System
            </button>
          </div>
          
          <style>{`
            .error-boundary {
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .error-card {
              padding: 3rem;
              border-radius: 24px;
              max-width: 500px;
              text-align: center;
              border: 1px solid rgba(239, 68, 68, 0.2);
            }
            .error-header {
              margin-bottom: 1.5rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 1rem;
            }
            .error-icon {
              color: var(--error);
            }
            .error-message {
              color: var(--text-secondary);
              margin-bottom: 2rem;
            }
            .error-details {
              background: rgba(0, 0, 0, 0.3);
              padding: 1rem;
              border-radius: 8px;
              font-size: 0.8rem;
              color: var(--error);
              text-align: left;
              margin-bottom: 2rem;
              overflow-x: auto;
              font-family: monospace;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
