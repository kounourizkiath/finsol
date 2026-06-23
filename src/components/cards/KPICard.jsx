export const KPICard = ({ label, value, subtext, color = '#00d4aa' }) => {
  return (
    <div className="bg-[#1a1f3a] border border-[#3a4458] rounded-lg p-4 hover:border-[#00d4aa] transition">
      <div className="text-[#a8b2c7] text-xs uppercase tracking-wider font-bold mb-2">
        {label}
      </div>
      <div style={{ color }} className="text-2xl font-bold">
        {value}
      </div>
      {subtext && (
        <div className="text-[#a8b2c7] text-xs mt-1">
          {subtext}
        </div>
      )}
    </div>
  );
};
