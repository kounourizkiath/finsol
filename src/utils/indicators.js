/**
 * Calculate RSI (Relative Strength Index)
 */
export const calcRSI = (prices, period = 14) => {
  if (prices.length < period) return null;

  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  const gains = changes.filter(c => c > 0).reduce((a, b) => a + b, 0) / period;
  const losses = Math.abs(changes.filter(c => c < 0).reduce((a, b) => a + b, 0)) / period;

  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - (100 / (1 + rs));
};

/**
 * Calculate Moving Average
 */
export const calcMA = (prices, period) => {
  if (prices.length < period) return null;
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
};

/**
 * Calculate Momentum (percentage change over period)
 */
export const calcMomentum = (prices, period = 20) => {
  if (prices.length < period) return null;
  const current = prices[prices.length - 1];
  const previous = prices[prices.length - period];
  return ((current - previous) / previous) * 100;
};

/**
 * Get trading signal based on technical indicators
 */
export const getSignal = (prices) => {
  if (!prices || prices.length < 50) return 'HOLD';

  const rsi = calcRSI(prices);
  const ma20 = calcMA(prices, 20);
  const ma50 = calcMA(prices, 50);
  const momentum = calcMomentum(prices);

  if (rsi === null || ma20 === null || ma50 === null) return 'HOLD';

  if (rsi < 35 && ma20 > ma50 && momentum > 0) return 'BUY';
  if (rsi > 70 && ma20 < ma50) return 'SELL';
  return 'HOLD';
};

/**
 * Get confidence score for signal (0-100)
 */
export const getConfidenceScore = (prices) => {
  if (!prices || prices.length < 50) return 0;

  const rsi = calcRSI(prices);
  const ma20 = calcMA(prices, 20);
  const ma50 = calcMA(prices, 50);

  let score = 50;

  // RSI confidence
  if (rsi < 35 || rsi > 70) score += 15;
  if (rsi < 25 || rsi > 80) score += 10;

  // Trend strength
  const trendStrength = Math.abs(ma20 - ma50) / ma50;
  if (trendStrength > 0.02) score += 15;
  if (trendStrength > 0.05) score += 10;

  return Math.min(100, score);
};

/**
 * Calculate volatility (standard deviation of returns)
 */
export const calcVolatility = (prices) => {
  if (prices.length < 2) return 0;

  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  return Math.sqrt(variance);
};

/**
 * Calculate average correlation between price pairs
 */
export const calcAverageCorrelation = (priceArrays) => {
  if (priceArrays.length < 2) return 0;

  let totalCorr = 0;
  let count = 0;

  for (let i = 0; i < priceArrays.length; i++) {
    for (let j = i + 1; j < priceArrays.length; j++) {
      const corr = calculateCorrelation(priceArrays[i], priceArrays[j]);
      totalCorr += corr;
      count++;
    }
  }

  return count > 0 ? totalCorr / count : 0;
};

/**
 * Helper: Calculate correlation between two price series
 */
const calculateCorrelation = (arr1, arr2) => {
  const minLen = Math.min(arr1.length, arr2.length);
  if (minLen < 2) return 0;

  const slice1 = arr1.slice(-minLen);
  const slice2 = arr2.slice(-minLen);

  const mean1 = slice1.reduce((a, b) => a + b) / minLen;
  const mean2 = slice2.reduce((a, b) => a + b) / minLen;

  let numerator = 0;
  let denom1 = 0;
  let denom2 = 0;

  for (let i = 0; i < minLen; i++) {
    const diff1 = slice1[i] - mean1;
    const diff2 = slice2[i] - mean2;
    numerator += diff1 * diff2;
    denom1 += diff1 * diff1;
    denom2 += diff2 * diff2;
  }

  const denominator = Math.sqrt(denom1 * denom2);
  return denominator === 0 ? 0 : numerator / denominator;
};

/**
 * Calculate max drawdown
 */
export const calcMaxDrawdown = (prices) => {
  if (prices.length < 2) return 0;

  let maxDD = 0;
  let peak = prices[0];

  for (let price of prices) {
    peak = Math.max(peak, price);
    const dd = (price - peak) / peak;
    maxDD = Math.min(maxDD, dd);
  }

  return maxDD * 100;
};
