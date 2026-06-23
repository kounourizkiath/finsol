export const PipelineStatusBar = ({ isLive = false, avgLatency = 0, lastUpdate = new Date() }) => {
  const timeAgo = () => {
    const diff = Date.now() - lastUpdate.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(26, 31, 58, 0.95)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid #3a4458',
      padding: '12px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '12px',
      color: '#a8b2c7',
      zIndex: 40,
      height: '48px'
    }}>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isLive ? (
            <>
              <span style={{
                width: '8px',
                height: '8px',
                background: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }} />
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>LIVE</span>
            </>
          ) : (
            <>
              <span style={{
                width: '8px',
                height: '8px',
                background: '#f59e0b',
                borderRadius: '50%'
              }} />
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>DEMO</span>
            </>
          )}
        </div>

        <div>Pipeline ETL | Source: Yahoo Finance</div>

        {isLive && (
          <div>
            Latency: <span style={{ color: '#00d4aa', fontWeight: 'bold' }}>{avgLatency}ms</span>
          </div>
        )}

        <div>
          Updated: <span style={{ color: '#00d4aa' }}>{timeAgo()}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', fontSize: '11px' }}>
        <div>5 ETFs</div>
        <div>24 months</div>
        <div>120 data points</div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};
