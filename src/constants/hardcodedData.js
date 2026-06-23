/**
 * Hardcoded realistic ETF data as fallback when API fails
 * Each ETF has differentiated values based on real market behavior
 */

export const HARDCODED_ETF_DATA = {
  URTH: {
    symbol: 'URTH',
    price: 118.4,
    change: 0.8,
    rsi: 58,
    trend: 'Haussière',
    momentum: 3.1,
    conviction: 64,
    history: generatePriceHistory(118.4, 0.008, 252),
  },
  SPY: {
    symbol: 'SPY',
    price: 542.3,
    change: 1.2,
    rsi: 61,
    trend: 'Haussière',
    momentum: 4.8,
    conviction: 71,
    history: generatePriceHistory(542.3, 0.012, 252),
  },
  QQQ: {
    symbol: 'QQQ',
    price: 478.9,
    change: 1.9,
    rsi: 68,
    trend: 'Haussière',
    momentum: 7.2,
    conviction: 78,
    history: generatePriceHistory(478.9, 0.019, 252),
  },
  GLD: {
    symbol: 'GLD',
    price: 231.7,
    change: -0.3,
    rsi: 44,
    trend: 'Baissière',
    momentum: -1.4,
    conviction: 51,
    history: generatePriceHistory(231.7, -0.003, 252),
  },
  '^FCHI': {
    symbol: '^FCHI',
    price: 7842.0,
    change: 0.4,
    rsi: 52,
    trend: 'Neutre',
    momentum: 1.8,
    conviction: 58,
    history: generatePriceHistory(7842.0, 0.004, 252),
  },
};

/**
 * Generate realistic price history for an ETF
 * Uses random walk to simulate price movement
 */
function generatePriceHistory(startPrice, dailyChange, days) {
  const history = [];
  let price = startPrice;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    const dateStr = date.toLocaleDateString('en-US');

    // Random walk with drift
    const randomChange = (Math.random() - 0.5) * 0.02;
    const drift = dailyChange / 252; // Annualized to daily
    price = price * (1 + drift + randomChange);

    history.push({
      date: dateStr,
      price: parseFloat(price.toFixed(2)),
    });
  }

  return history;
}
