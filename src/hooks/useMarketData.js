import { useState, useEffect } from 'react';
import { ETFS } from '../constants/etfConfig';

const CACHE_KEY = 'marketsync_etf_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch data for an ETF from Yahoo Finance
 */
const fetchETFData = async (etf) => {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${etf}?interval=1d&range=1y`;
    const response = await fetch(url);
    const json = await response.json();

    if (json.chart.result && json.chart.result[0]) {
      const result = json.chart.result[0];
      const timestamps = result.timestamp || [];
      const closes = result.indicators?.quote?.[0]?.close || [];

      return {
        symbol: etf,
        price: closes[closes.length - 1] || 0,
        change: closes[closes.length - 1] - closes[Math.max(0, closes.length - 6)] || 0,
        history: timestamps
          .map((t, i) => ({
            date: new Date(t * 1000).toLocaleDateString('en-US'),
            price: closes[i] || 0,
          }))
          .slice(-252), // Last 252 trading days
        timestamp: Date.now(),
      };
    }

    return null;
  } catch (e) {
    console.error(`Error fetching ${etf}:`, e);
    return null;
  }
};

/**
 * Load cached data or fetch fresh data
 */
const loadETFData = async (etf) => {
  // Try cache first
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  const cached = cache[etf];

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached;
  }

  // Fetch fresh data
  const fresh = await fetchETFData(etf);

  // Update cache
  if (fresh) {
    cache[etf] = fresh;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  }

  return fresh;
};

/**
 * Hook: Fetch and manage market data for all ETFs
 */
export const useMarketData = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const results = {};

        // Fetch all ETFs in parallel
        const promises = ETFS.map(etf => loadETFData(etf));
        const responses = await Promise.all(promises);

        responses.forEach((response, i) => {
          if (response) {
            results[ETFS[i]] = response;
          }
        });

        setData(results);
        setLastUpdate(new Date());
        setError(null);
      } catch (e) {
        console.error('Error loading market data:', e);
        setError('Failed to load market data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    // Refresh every 5 minutes
    const interval = setInterval(fetchAll, CACHE_DURATION);
    return () => clearInterval(interval);
  }, []);

  const refresh = async () => {
    // Clear cache and refetch
    localStorage.removeItem(CACHE_KEY);
    const results = {};

    const promises = ETFS.map(etf => fetchETFData(etf));
    const responses = await Promise.all(promises);

    responses.forEach((response, i) => {
      if (response) {
        results[ETFS[i]] = response;
      }
    });

    setData(results);
    setLastUpdate(new Date());
  };

  return { data, loading, error, lastUpdate, refresh };
};
