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

      if (history.length === 0) return null;

      let totalInvested = 0;
      let shares = 0;
      const results = [];

      // Find monthly data points (approximate)
      let currentMonth = new Date(start);

      while (currentMonth <= end) {
        const currentDateStr = currentMonth.toLocaleDateString('en-US');

        // Find closest date in history
        let closestData = null;
        let minDiff = Infinity;

        for (const dayData of history) {
          const historyDate = new Date(dayData.date);
          const diff = Math.abs(historyDate.getTime() - currentMonth.getTime());

          if (diff < minDiff) {
            minDiff = diff;
            closestData = dayData;
          }
        }

        if (closestData && closestData.price > 0) {
          totalInvested += dcaAmount;
          shares += dcaAmount / closestData.price;

          results.push({
            date: closestData.date,
            invested: parseFloat(totalInvested.toFixed(2)),
            value: parseFloat((shares * closestData.price).toFixed(2)),
            price: closestData.price,
            shares: parseFloat(shares.toFixed(4)),
          });
        }

        currentMonth.setMonth(currentMonth.getMonth() + 1);
      }

      if (results.length === 0) {
        return null;
      }

      const final = results[results.length - 1];
      const finalValue = final.value;
      const gain = finalValue - final.invested;
      const performance = final.invested > 0 ? (gain / final.invested) * 100 : 0;

      // Calculate annualized return
      const years = results.length / 12;
      const annualized = years > 0 ? Math.pow(finalValue / final.invested, 1 / years) - 1 : 0;

      // Find best and worst months
      let bestMonth = -Infinity;
      let worstMonth = Infinity;
      let bestMonthDate = '';
      let worstMonthDate = '';

      for (let i = 1; i < results.length; i++) {
        const prevValue = results[i - 1].value;
        const monthGain = prevValue > 0 ? (results[i].value - prevValue) / prevValue : 0;

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
        invested: parseFloat(final.invested.toFixed(2)),
        value: parseFloat(finalValue.toFixed(2)),
        gain: parseFloat(gain.toFixed(2)),
        performance: parseFloat(performance.toFixed(2)),
        annualized: parseFloat((annualized * 100).toFixed(2)),
        shares: parseFloat(final.shares.toFixed(4)),
        results,
        bestMonth: parseFloat((bestMonth * 100).toFixed(2)),
        bestMonthDate,
        worstMonth: parseFloat((worstMonth * 100).toFixed(2)),
        worstMonthDate,
        duration: results.length, // months
      };
    } catch (e) {
      console.error('DCA calculation error:', e);
      return null;
    }
  }, [etfData, selectedETF, dcaAmount, dcaStart, dcaEnd]);
};
