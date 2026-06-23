import { useState, useEffect } from 'react';
import { ETFS } from '../constants/etfConfig';
import { HARDCODED_ETF_DATA } from '../constants/hardcodedData';

const CACHE_KEY = 'marketsync_etf_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CORS_PROXY = 'https://corsproxy.io/?';

/**
 * Fetch data for an ETF from Yahoo Finance using CORS proxy
 */
const fetchETFData = async (etf) => {
  try {
    const yfinanceUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${etf}?interval=1d&range=1y`;
    const url = CORS_PROXY + encodeURIComponent(yfinanceUrl);

    const response = await fetch(url, { timeout: 5000 });
    const json = await response.json();

    if (json.chart.result && json.chart.result[0]) {
      const result = json.chart.result[0];
      const timestamps = result.timestamp || [];
      const closes = result.indicators?.quote?.[0]?.close || [];

      if (closes.length === 0) return null;

      const history = timestamps
        .map((t, i) => ({
          date: new Date(t * 1000).toLocaleDateString('en-US'),
          price: closes[i] || 0,
        }))
        .slice(-252);

      return {
        symbol: etf,
        price: closes[closes.length - 1] || 0,
        change: ((closes[closes.length - 1] - closes[Math.max(0, closes.length - 6)]) / closes[Math.max(0, closes.length - 6)] * 100) || 0,
        history,
        timestamp: Date.now(),
      };
    }

    return null;
  } catch (e) {
    console.warn(`Failed to fetch ${etf} from API:`, e);
    return null;
  }
};

/**
 * Load cached data, try API, fallback to hardcoded
 */
const loadETFData = async (etf) => {
  // Try cache first
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  const cached = cache[etf];

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached;
  }

  // Try API
  const fresh = await fetchETFData(etf);

  if (fresh) {
    cache[etf] = fresh;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    return fresh;
  }

  // Fallback to hardcoded
  console.info(`Using hardcoded data for ${etf}`);
  const hardcoded = {
    ...HARDCODED_ETF_DATA[etf],
    timestamp: Date.now(),
  };
  cache[etf] = hardcoded;
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  return hardcoded;
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
