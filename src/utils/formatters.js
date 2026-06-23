/**
 * Format currency (USD)
 */
export const formatCurrency = (value, decimals = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format percentage
 */
export const formatPercent = (value, decimals = 2) => {
  return `${(value >= 0 ? '+' : '')}${value.toFixed(decimals)}%`;
};

/**
 * Format percentage change (with color indicator)
 */
export const formatPercentChange = (value, decimals = 2) => {
  return {
    text: formatPercent(value, decimals),
    isPositive: value >= 0,
    arrow: value >= 0 ? '↑' : '↓',
  };
};

/**
 * Format large numbers with K/M suffix
 */
export const formatCompact = (value) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toFixed(2);
};

/**
 * Format price (currency with appropriate decimals)
 */
export const formatPrice = (price) => {
  if (price > 100) return `$${price.toFixed(2)}`;
  return `$${price.toFixed(4)}`;
};

/**
 * Format date string
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format time
 */
export const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format number with commas
 */
export const formatNumber = (value, decimals = 0) => {
  return parseFloat(value.toFixed(decimals)).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
