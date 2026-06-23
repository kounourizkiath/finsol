import { useLanguage } from '../../context/LanguageContext';

export const StepProgress = ({ currentStep, setCurrentStep }) => {
  const { t } = useLanguage();

  const steps = [
    { num: 1, label: t.step1 },
    { num: 2, label: t.step2 },
    { num: 3, label: t.step3 },
  ];

  return (
    <div className="bg-[#1a1f3a] px-6 py-6 border-b border-[#3a4458] sticky top-16 z-30">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-4">
          {steps.map(s => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`font-bold transition duration-300 text-sm ${
                currentStep === s.num
                  ? 'text-[#00d4aa] transform scale-110'
                  : 'text-[#a8b2c7] hover:text-[#f5f7fa]'
              }`}
            >
              Étape {s.num}: {s.label}
            </button>
          ))}
        </div>
        <div className="w-full bg-[#242d4a] h-1 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#00d4aa] to-[#00a878] h-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
