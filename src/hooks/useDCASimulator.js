import { useMemo } from 'react';

/**
 * Hook: Calculate DCA (Dollar Cost Averaging) simulation
 */
export const useDCASimulator = (etfData, selectedETF, dcaAmount, dcaStart, dcaEnd) => {
  return useMemo(() => {
    if (!etfData[selectedETF] || !etfData[selectedETF].history) {
      return null;
    }

    try {
      const start = new Date(dcaStart);
      const end = new Date(dcaEnd);
      const history = etfData[selectedETF].history;

      let totalInvested = 0;
      let shares = 0;
      const results = [];

      // Simulate monthly DCA
      for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
        const dateStr = d.toLocaleDateString('en-US');
        const dayData = history.find(h => h.date === dateStr);

        if (dayData && dayData.price > 0) {
          totalInvested += dcaAmount;
          shares += dcaAmount / dayData.price;

          results.push({
            date: dateStr,
            invested: totalInvested,
            value: shares * dayData.price,
            price: dayData.price,
            shares: shares,
          });
        }
      }

      if (results.length === 0) {
        return null;
      }

      const final = results[results.length - 1];
      const finalValue = final.value;
      const gain = finalValue - final.invested;
      const performance = (gain / final.invested) * 100;

      // Calculate annualized return
      const years = results.length / 12;
      const annualized = years > 0 ? Math.pow(finalValue / final.invested, 1 / years) - 1 : 0;

      // Find best and worst months
      let bestMonth = 0;
      let worstMonth = 0;
      let bestMonthDate = '';
      let worstMonthDate = '';

      for (let i = 1; i < results.length; i++) {
        const monthGain = (results[i].value - results[i - 1].value) / results[i - 1].value;
        if (monthGain > bestMonth) {
          bestMonth = monthGain;
          bestMonthDate = results[i].date;
        }
        if (monthGain < worstMonth) {
          worstMonth = monthGain;
          worstMonthDate = results[i].date;
        }
      }

      return {
        invested: final.invested,
        value: finalValue,
        gain,
        performance,
        annualized: annualized * 100,
        shares: final.shares,
        results,
        bestMonth: bestMonth * 100,
        bestMonthDate,
        worstMonth: worstMonth * 100,
        worstMonthDate,
        duration: results.length, // months
      };
    } catch (e) {
      console.error('DCA calculation error:', e);
      return null;
    }
  }, [etfData, selectedETF, dcaAmount, dcaStart, dcaEnd]);
};
