import { useState, useEffect } from 'react';
import { ETFS } from '../constants/etfConfig';
import { calculateRSI, calculateMA, generateSignal, getConfidenceScore } from '../utils/indicators';

const CACHE_KEY = 'marketsync_etf_cache';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Fetch data from Vercel API endpoint
 */
const fetchETFData = async (symbol) => {
  try {
    const response = await fetch(`/api/etf/${encodeURIComponent(symbol)}?range=2y&interval=1mo`);
    const json = await response.json();

    if (!json.history || json.history.length === 0) return null;

    const history = json.history.map(h => ({
      date: new Date(h.date).toLocaleDateString('en-US'),
      price: h.price
    }));

    const prices = history.map(h => h.price);
    const rsi = calculateRSI(prices);
    const ma20 = calculateMA(prices, 20);
    const ma50 = calculateMA(prices, 50);
    const signal = generateSignal(rsi, ma20, ma50, 0);
    const confidence = getConfidenceScore(prices);

    const changePercent = ((json.currentPrice - json.previousClose) / json.previousClose * 100);

    return {
      symbol,
      price: json.currentPrice,
      change: parseFloat(changePercent.toFixed(2)),
      rsi,
      trend: rsi > 65 ? 'Haussière' : rsi < 35 ? 'Baissière' : 'Neutre',
      momentum: ma20 && ma50 ? ((prices[prices.length - 1] - prices[Math.max(0, prices.length - 20)]) / prices[Math.max(0, prices.length - 20)] * 100) : 0,
      conviction: confidence,
      signal,
      history,
      isLive: !json.isFallback,
      latency: json.latency || 0,
      timestamp: Date.now(),
    };
  } catch (e) {
    console.warn(`Failed to fetch ${symbol}:`, e);
    return null;
  }
};

/**
 * Load from cache or fetch fresh
 */
const loadETFData = async (symbol) => {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  const cached = cache[symbol];

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached;
  }

  const fresh = await fetchETFData(symbol);
  if (fresh) {
    cache[symbol] = fresh;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    return fresh;
  }

  return cached || null;
};

/**
 * Market data hook with live/demo status
 */
export const useMarketData = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLive, setIsLive] = useState(false);
  const [avgLatency, setAvgLatency] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const results = {};
        const latencies = [];

        const responses = await Promise.all(ETFS.map(etf => loadETFData(etf)));

        responses.forEach((response, i) => {
          if (response) {
            results[ETFS[i]] = response;
            if (response.latency) latencies.push(response.latency);
          }
        });

        setData(results);
        setLastUpdate(new Date());
        setError(null);
        setIsLive(responses.some(r => r?.isLive));
        setAvgLatency(latencies.length > 0 ? Math.round(latencies.reduce((a,b) => a+b, 0) / latencies.length) : 0);
      } catch (e) {
        console.error('Error loading market data:', e);
        setError('Failed to load market data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    // Refresh every 15 minutes
    const interval = setInterval(fetchAll, CACHE_DURATION);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, lastUpdate, isLive, avgLatency };
};
