export const OnboardingModal = ({ visible, onClose, labels }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-8 max-w-md">
        <h2 className="text-2xl font-bold text-[#00d4aa] mb-2">{labels.welcome}</h2>
        <p className="text-[#a8b2c7] mb-6">{labels.subtitle}</p>

        <div className="space-y-3 mb-8">
          <div className="flex gap-3">
            <span className="text-[#00d4aa]">✦</span>
            <span className="text-[#a8b2c7]">Données live Yahoo Finance</span>
          </div>
          <div className="flex gap-3">
            <span className="text-[#00d4aa]">✦</span>
            <span className="text-[#a8b2c7]">Signaux Buy/Hold/Sell automatiques</span>
          </div>
          <div className="flex gap-3">
            <span className="text-[#00d4aa]">✦</span>
            <span className="text-[#a8b2c7]">Simulateur DCA personnalisé</span>
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
            localStorage.setItem('marketsync_onboarding_seen', '1');
          }}
          className="w-full bg-gradient-to-r from-[#00d4aa] to-[#00a878] text-[#0a0e27] font-bold py-2 rounded-lg mb-3 hover:shadow-lg transition"
        >
          {labels.startAnalysis} →
        </button>

        <label className="flex items-center gap-2 text-sm text-[#a8b2c7]">
          <input
            type="checkbox"
            onChange={(e) => e.target.checked && localStorage.setItem('marketsync_onboarding_seen', '1')}
          />
          {labels.dontShow}
        </label>
      </div>
    </div>
  );
};
