/* Shows a loading message or an error with a retry button. */
export default function LoadState({ loading, error, onRetry, label = "data" }) {
  if (loading) {
    return (
      <div className="load-state">
        <span className="spinner" />
        <strong>Loading {label}…</strong>
        <small>If the ML server was asleep, this can take up to a minute.</small>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prototype-warning load-error">
        <span>⚠️</span>
        <div>
          <strong>{error}</strong>
          <p>The server may still be waking up. Please try again.</p>
          {onRetry && (
            <button type="button" onClick={onRetry}>
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
