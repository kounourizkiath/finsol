import { DCAChart } from '../charts/DCAChart';
import { formatCurrency, formatPercent, formatNumber } from '../../utils/formatters';
import { ETFS } from '../../constants/etfConfig';

export const StepDecision = ({ etfData, selectedETF, setSelectedETF, dcaAmount, setDcaAmount, dcaStart, setDcaStart, dcaEnd, setDcaEnd, dca, onExportPDF, onNext, onPrevious, labels }) => {
  if (!dca) {
    return (
      <div className="text-center py-12">
        <p className="text-[#a8b2c7]">No DCA data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-[#f5f7fa]">{labels.simulator}</h3>

          <div className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-6 space-y-4">
            <div>
              <label className="text-[#a8b2c7] text-sm font-bold block mb-2">ETF</label>
              <select
                value={selectedETF}
                onChange={(e) => setSelectedETF(e.target.value)}
                className="w-full bg-[#242d4a] border border-[#3a4458] text-[#f5f7fa] px-3 py-2 rounded"
              >
                {ETFS.map(etf => (
                  <option key={etf}>{etf}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[#a8b2c7] text-sm font-bold block mb-2">
                Monthly: {formatCurrency(dcaAmount)}
              </label>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={dcaAmount}
                onChange={(e) => setDcaAmount(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#a8b2c7] text-sm font-bold block mb-2">Start</label>
                <input
                  type="date"
                  value={dcaStart}
                  onChange={(e) => setDcaStart(e.target.value)}
                  className="w-full bg-[#242d4a] border border-[#3a4458] text-[#f5f7fa] px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="text-[#a8b2c7] text-sm font-bold block mb-2">End</label>
                <input
                  type="date"
                  value={dcaEnd}
                  onChange={(e) => setDcaEnd(e.target.value)}
                  className="w-full bg-[#242d4a] border border-[#3a4458] text-[#f5f7fa] px-3 py-2 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#3a4458]">
              <div>
                <div className="text-[#a8b2c7] text-xs uppercase">Invested</div>
                <div className="text-2xl font-bold text-[#f5f7fa]">
                  {formatCurrency(dca.invested)}
                </div>
              </div>
              <div>
                <div className="text-[#a8b2c7] text-xs uppercase">Final Value</div>
                <div className="text-2xl font-bold text-[#00d4aa]">
                  {formatCurrency(dca.value)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[#a8b2c7] text-xs uppercase">Performance</div>
                <div
                  className={`text-2xl font-bold ${
                    dca.performance >= 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
                  }`}
                >
                  {formatPercent(dca.performance)}
                </div>
              </div>
              <div>
                <div className="text-[#a8b2c7] text-xs uppercase">Annualized</div>
                <div className="text-2xl font-bold text-[#f5f7fa]">
                  {formatPercent(dca.annualized)}
                </div>
              </div>
            </div>
          </div>

          <DCAChart data={dca} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#f5f7fa]">{labels.optimal}</h3>
          <div className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-4">
            {ETFS.slice(0, 3).map((etf, i) => (
              <div key={etf} className="flex justify-between items-center mb-4">
                <span className="text-[#a8b2c7]">{etf}</span>
                <div className="bg-[#242d4a] rounded-full h-2 flex-grow mx-3 w-20">
                  <div
                    className="bg-[#00d4aa] h-full rounded-full"
                    style={{ width: `${30 + i * 5}%` }}
                  ></div>
                </div>
                <span className="text-[#f5f7fa] font-bold w-12 text-right">
                  {30 + i * 5}%
                </span>
              </div>
            ))}
            <button className="w-full mt-6 bg-[#00d4aa] text-[#0a0e27] font-bold py-2 rounded hover:shadow-lg transition">
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="border border-[#3a4458] text-[#f5f7fa] font-bold px-6 py-3 rounded-lg hover:border-[#00d4aa] transition"
        >
          ← {labels.previous}
        </button>
        <button
          onClick={onExportPDF}
          className="bg-gradient-to-r from-[#00d4aa] to-[#00a878] text-[#0a0e27] font-bold px-6 py-3 rounded-lg hover:shadow-lg transition"
        >
          {labels.exportPdf}
        </button>
      </div>
    </div>
  );
};
