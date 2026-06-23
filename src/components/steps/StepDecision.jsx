import { DCAChart } from '../charts/DCAChart';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { ETFS } from '../../constants/etfConfig';
import { useLanguage } from '../../context/LanguageContext';

// Optimal allocation weights (from Markowitz)
const OPTIMAL_ALLOCATION = {
  URTH: 28,
  SPY: 22,
  QQQ: 18,
  GLD: 20,
  '^FCHI': 12,
};

export const StepDecision = ({ etfData, selectedETF, setSelectedETF, dcaAmount, setDcaAmount, dcaStart, setDcaStart, dcaEnd, setDcaEnd, dca, onExportPDF, onNext, onPrevious }) => {
  const { t } = useLanguage();
  if (!dca) {
    return (
      <div className="text-center py-12 text-[#a8b2c7]">
        <p>Chargement de la simulation DCA...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: DCA Simulator (60%) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-[#f5f7fa]">{t.dcaTitle}</h3>
          <p className="text-[#a8b2c7] text-sm">{t.dcaSubtitle}</p>

          {/* Controls */}
          <div className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-6 space-y-4">
            <div>
              <label className="text-[#a8b2c7] text-sm font-bold block mb-2">ETF</label>
              <select
                value={selectedETF}
                onChange={(e) => setSelectedETF(e.target.value)}
                className="w-full bg-[#242d4a] border border-[#3a4458] text-[#f5f7fa] px-3 py-2 rounded"
              >
                {ETFS.map(etf => <option key={etf}>{etf}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[#a8b2c7] text-sm font-bold block mb-2">
                Montant mensuel: <span className="text-[#00d4aa]">{formatCurrency(dcaAmount)}</span>
              </label>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={dcaAmount}
                onChange={(e) => setDcaAmount(parseInt(e.target.value))}
                className="w-full accent-[#00d4aa]"
              />
              <div className="text-xs text-[#a8b2c7] mt-1">€50 à €1,000</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#a8b2c7] text-sm font-bold block mb-2">Début</label>
                <input
                  type="date"
                  value={dcaStart}
                  onChange={(e) => setDcaStart(e.target.value)}
                  className="w-full bg-[#242d4a] border border-[#3a4458] text-[#f5f7fa] px-3 py-2 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-[#a8b2c7] text-sm font-bold block mb-2">Fin</label>
                <input
                  type="date"
                  value={dcaEnd}
                  onChange={(e) => setDcaEnd(e.target.value)}
                  className="w-full bg-[#242d4a] border border-[#3a4458] text-[#f5f7fa] px-3 py-2 rounded text-sm"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#3a4458]">
              <div>
                <div className="text-[#a8b2c7] text-xs uppercase tracking-wider font-bold mb-1">Investi</div>
                <div className="text-2xl font-bold font-mono text-[#f5f7fa]">
                  {formatCurrency(dca.invested)}
                </div>
              </div>
              <div>
                <div className="text-[#a8b2c7] text-xs uppercase tracking-wider font-bold mb-1">Valeur finale</div>
                <div className="text-2xl font-bold font-mono text-[#00d4aa]">
                  {formatCurrency(dca.value)}
                </div>
              </div>
              <div>
                <div className="text-[#a8b2c7] text-xs uppercase tracking-wider font-bold mb-1">Gain</div>
                <div
                  className={`text-xl font-bold font-mono ${
                    dca.gain >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
                  }`}
                >
                  {dca.gain >= 0 ? '+' : ''}{formatCurrency(dca.gain)}
                </div>
              </div>
              <div>
                <div className="text-[#a8b2c7] text-xs uppercase tracking-wider font-bold mb-1">Performance</div>
                <div
                  className={`text-xl font-bold font-mono ${
                    dca.performance >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
                  }`}
                >
                  {dca.performance >= 0 ? '+' : ''}{dca.performance.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#3a4458]">
              <div className="text-sm text-[#a8b2c7]">
                <strong>Rendement annualisé:</strong>{' '}
                <span className="text-[#00d4aa] font-bold">{dca.annualized.toFixed(2)}% / an</span>
              </div>
              {dca.bestMonthDate && (
                <div className="text-xs text-[#a8b2c7] mt-2">
                  Meilleur mois: <span className="text-[#10b981]">+{dca.bestMonth.toFixed(1)}%</span> ({dca.bestMonthDate})
                </div>
              )}
            </div>
          </div>

          {/* DCA Chart */}
          <DCAChart data={dca} />
        </div>

        {/* RIGHT: Portfolio Optimizer (40%) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#f5f7fa]">{t.optimTitle}</h3>
          <p className="text-[#a8b2c7] text-sm">{t.optimSubtitle}</p>

          {/* Allocation Table */}
          <div className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-4 space-y-3">
            {ETFS.map((etf) => {
              const weight = OPTIMAL_ALLOCATION[etf] || 0;
              return (
                <div key={etf}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#f5f7fa] font-bold text-sm">{etf}</span>
                    <span className="text-[#00d4aa] font-bold text-sm">{weight}%</span>
                  </div>
                  <div className="bg-[#242d4a] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#00d4aa] to-[#00a878] h-full rounded-full"
                      style={{ width: `${weight}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            <button className="w-full mt-6 bg-[#00d4aa] text-[#0a0e27] font-bold py-2 rounded hover:shadow-lg transition">
              {t.applyAllocation}
            </button>
          </div>

          {/* Insight */}
          <div className="text-[#a8b2c7] text-xs p-4 bg-[#242d4a] rounded-lg border border-[#3a4458] leading-relaxed">
            <strong>Comment c'est calculé ?</strong>
            <p className="mt-2">
              Cette allocation maximise le ratio de Sharpe en tenant compte des corrélations.
              GLD surpondéré car il réduit la volatilité globale (corrélation &lt;0.15 avec actions).
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-[#a8b2c7] text-xs p-3 bg-[#242d4a] rounded-lg border border-[#3a4458]">
        {t.disclaimer}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="border border-[#3a4458] text-[#f5f7fa] font-bold px-6 py-3 rounded-lg hover:border-[#00d4aa] transition"
        >
          {t.prev}
        </button>
        <button
          onClick={onExportPDF}
          className="bg-gradient-to-r from-[#00d4aa] to-[#00a878] text-[#0a0e27] font-bold px-6 py-3 rounded-lg hover:shadow-lg transition"
        >
          {t.exportPdf}
        </button>
      </div>
    </div>
  );
};
