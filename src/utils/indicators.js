/**
 * Calculate RSI (Relative Strength Index)
 * Returns value between 0-100
 */
export const calculateRSI = (prices, period = 14) => {
  if (!prices || prices.length < period + 1) return null;

  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  // Calculate average gains and losses
  let sumGains = 0;
  let sumLosses = 0;

  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) sumGains += changes[i];
    else sumLosses += Math.abs(changes[i]);
  }

  let avgGain = sumGains / period;
  let avgLoss = sumLosses / period;

  // Smooth the averages for remaining data
  for (let i = period; i < changes.length; i++) {
    avgGain = (avgGain * (period - 1) + (changes[i] > 0 ? changes[i] : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (changes[i] < 0 ? Math.abs(changes[i]) : 0)) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

/**
 * Calculate Moving Average
 */
export const calculateMA = (prices, period) => {
  if (!prices || prices.length < period) return null;
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
};

/**
 * Calculate Momentum (percentage change over period)
 */
export const calculateMomentum = (prices, days = 30) => {
  if (!prices || prices.length < days) return null;
  const current = prices[prices.length - 1];
  const previous = prices[Math.max(0, prices.length - days)];
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Generate trading signal based on indicators
 * Returns: "ACHETER" | "CONSERVER" | "ALLÉGER"
 */
export const generateSignal = (rsi, ma20, ma50, momentum) => {
  if (rsi === null || ma20 === null || ma50 === null) return 'CONSERVER';

  // BUY: RSI < 40 AND MA20 > MA50 AND momentum > 0
  if (rsi < 40 && ma20 > ma50 && momentum > 0) {
    return 'ACHETER';
  }

  // SELL: RSI > 65 OR momentum < -3
  if (rsi > 65 || momentum < -3) {
    return 'ALLÉGER';
  }

  // HOLD: Everything else
  return 'CONSERVER';
};

/**
 * Get trading signal based on price history
 */
export const getSignal = (prices) => {
  if (!prices || prices.length < 50) return 'CONSERVER';

  const rsi = calculateRSI(prices);
  const ma20 = calculateMA(prices, 20);
  const ma50 = calculateMA(prices, 50);
  const momentum = calculateMomentum(prices, 30);

  return generateSignal(rsi, ma20, ma50, momentum);
};

/**
 * Get confidence score for signal (0-100)
 */
export const getConfidenceScore = (prices) => {
  if (!prices || prices.length < 50) return 0;

  const rsi = calculateRSI(prices);
  const ma20 = calculateMA(prices, 20);
  const ma50 = calculateMA(prices, 50);

  let score = 50;

  if (rsi === null || ma20 === null || ma50 === null) return score;

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
  if (!prices || prices.length < 2) return 0;

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
  if (!priceArrays || priceArrays.length < 2) return 0;

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
  if (!arr1 || !arr2) return 0;

  const minLen = Math.min(arr1.length, arr2.length);
  if (minLen < 2) return 0;

  const slice1 = arr1.slice(-minLen);
  const slice2 = arr2.slice(-minLen);

  const mean1 = slice1.reduce((a, b) => a + b, 0) / minLen;
  const mean2 = slice2.reduce((a, b) => a + b, 0) / minLen;

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
  if (!prices || prices.length < 2) return 0;

  let maxDD = 0;
  let peak = prices[0];

  for (let price of prices) {
    peak = Math.max(peak, price);
    const dd = (price - peak) / peak;
    maxDD = Math.min(maxDD, dd);
  }

  return maxDD * 100;
};
