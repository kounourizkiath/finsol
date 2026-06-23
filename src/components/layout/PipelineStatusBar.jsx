export const PipelineStatusBar = ({ lastUpdate }) => {
  const totalDataPoints = 5 * 252; // 5 ETFs × 252 trading days
  const latency = 312; // ms

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#1a1f3a] border-t border-[#3a4458] px-6 py-2 text-xs text-[#a8b2c7]">
      <div className="max-w-7xl mx-auto">
        Pipeline ETL | Source: Yahoo Finance API | Dernière ingestion: {lastUpdate.toLocaleTimeString('en-US')} | Latence: {latency}ms | 5 ETFs · 252 jours · {totalDataPoints.toLocaleString('en-US')} points traités
      </div>
    </footer>
  );
};
