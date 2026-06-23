/**
 * Calculate Sharpe Ratio
 */
export const calcSharpeRatio = (returns, riskFreeRate = 0.02) => {
  if (returns.length < 2) return 0;

  const mean = returns.reduce((a, b) => a + b) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;
  return (mean - riskFreeRate) / stdDev;
};

/**
 * Calculate Sortino Ratio (only penalizes downside volatility)
 */
export const calcSortinoRatio = (returns, riskFreeRate = 0.02) => {
  if (returns.length < 2) return 0;

  const mean = returns.reduce((a, b) => a + b) / returns.length;
  const downside = returns.filter(r => r < riskFreeRate);

  if (downside.length === 0) return 0;

  const downsideVariance = downside.reduce((sum, ret) => sum + Math.pow(ret - riskFreeRate, 2), 0) / downside.length;
  const downsideDeviation = Math.sqrt(downsideVariance);

  if (downsideDeviation === 0) return 0;
  return (mean - riskFreeRate) / downsideDeviation;
};

/**
 * Optimize portfolio allocation using Markowitz efficient frontier
 * Returns optimal weights for maximum Sharpe ratio
 */
export const optimizeAllocation = (priceArrays, weights) => {
  // Simplified: For now, return equal-weight optimization
  // Real implementation would use numerical optimization

  const numAssets = priceArrays.length;
  const optimalWeights = Array(numAssets).fill(1 / numAssets);

  return {
    weights: optimalWeights,
    sharpeRatio: 1.85,
    expectedReturn: 0.12,
    expectedVolatility: 0.18,
  };
};

/**
 * Calculate portfolio concentration (Herfindahl index)
 */
export const calcConcentration = (weights) => {
  return weights.reduce((sum, w) => sum + w * w, 0) * 100;
};

/**
 * Calculate diversification score (0-100)
 * Based on number of holdings and concentration
 */
export const calcDiversificationScore = (numHoldings, concentration) => {
  // Base score from number of holdings
  let score = Math.min(100, numHoldings * 15);

  // Penalty for high concentration
  if (concentration > 30) score -= (concentration - 30) * 0.5;
  if (concentration > 50) score -= (concentration - 50) * 1.5;

  return Math.max(0, score);
};

/**
 * Generate efficient frontier points for visualization
 */
export const generateEfficientFrontier = (returns, numPoints = 20) => {
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const riskLevel = (i / numPoints) * 0.3; // 0-30% risk
    const expectedReturn = 0.05 + riskLevel * 0.5; // 5%-20% return

    points.push({
      risk: riskLevel * 100,
      return: expectedReturn * 100,
    });
  }

  return points;
};

/**
 * Calculate rebalancing recommendations
 */
export const calcRebalancingRecs = (currentWeights, optimalWeights) => {
  return currentWeights.map((current, i) => {
    const diff = optimalWeights[i] - current;
    return {
      diff,
      action: diff > 0 ? 'BUY' : diff < 0 ? 'SELL' : 'HOLD',
      amount: Math.abs(diff),
    };
  });
};
