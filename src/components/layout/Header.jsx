export const Header = ({ language, setLanguage, onExportPDF, lastUpdate }) => {
  return (
    <header className="sticky top-0 bg-gradient-to-r from-[#1a1f3a] to-[#242d4a] border-b border-[#3a4458] px-6 py-4 z-40 backdrop-blur">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold bg-gradient-to-r from-[#00d4aa] to-[#00a878] bg-clip-text text-transparent">
          MarketSync Pro
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-[#a8b2c7]">
            <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></span>
            LIVE | Yahoo Finance | Updated {lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#242d4a] border border-[#3a4458] text-[#f5f7fa] px-3 py-1 rounded text-sm"
          >
            <option>FR</option>
            <option>EN</option>
          </select>

          <button
            onClick={onExportPDF}
            className="bg-[#00d4aa] text-[#0a0e27] font-bold px-4 py-2 rounded text-sm hover:shadow-lg transition"
          >
            Export PDF
          </button>
        </div>
      </div>
    </header>
  );
};
