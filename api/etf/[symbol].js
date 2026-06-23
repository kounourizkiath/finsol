export default async function handler(req, res) {
  const { symbol } = req.query;
  const { range = '2y', interval = '1mo' } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const startTime = Date.now();

  try {
    // Encode special characters (e.g., ^FCHI → %5EFCHI)
    const encodedSymbol = encodeURIComponent(symbol);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodedSymbol}?interval=${interval}&range=${range}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 5000
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!data.chart?.result?.[0]) throw new Error('Invalid response format');

    const chart = data.chart.result[0];
    const timestamps = chart.timestamp || [];
    const closes = chart.indicators?.quote?.[0]?.close || [];
    const meta = chart.meta || {};

    const latency = Date.now() - startTime;

    res.status(200).json({
      symbol,
      currentPrice: meta.regularMarketPrice || closes[closes.length - 1] || 0,
      previousClose: meta.chartPreviousClose || 0,
      currency: meta.currency || 'USD',
      isFallback: false,
      latency,
      history: timestamps
        .map((ts, i) => ({
          date: new Date(ts * 1000).toISOString().split('T')[0],
          price: closes[i] ? parseFloat(closes[i].toFixed(2)) : null,
        }))
        .filter(d => d.price !== null)
        .slice(-24) // Last 24 months
    });
  } catch (error) {
    const latency = Date.now() - startTime;

    // Fallback data
    const FALLBACK = {
      'SPY': {
        currentPrice: 542.3,
        previousClose: 535.8,
        history: [
          { date: '2023-01-31', price: 380 }, { date: '2023-02-28', price: 395 },
          { date: '2023-03-31', price: 408 }, { date: '2023-04-28', price: 415 },
          { date: '2023-05-31', price: 420 }, { date: '2023-06-30', price: 435 },
          { date: '2023-07-31', price: 442 }, { date: '2023-08-31', price: 428 },
          { date: '2023-09-29', price: 415 }, { date: '2023-10-31', price: 430 },
          { date: '2023-11-30', price: 448 }, { date: '2023-12-29', price: 460 },
          { date: '2024-01-31', price: 465 }, { date: '2024-02-29', price: 472 },
          { date: '2024-03-28', price: 468 }, { date: '2024-04-30', price: 475 },
          { date: '2024-05-31', price: 488 }, { date: '2024-06-28', price: 492 },
          { date: '2024-07-31', price: 500 }, { date: '2024-08-30', price: 510 },
          { date: '2024-09-30', price: 520 }, { date: '2024-10-31', price: 530 },
          { date: '2024-11-29', price: 538 }, { date: '2024-12-31', price: 542 }
        ]
      },
      'QQQ': {
        currentPrice: 478.9,
        previousClose: 470.1,
        history: [
          { date: '2023-01-31', price: 265 }, { date: '2023-02-28', price: 280 },
          { date: '2023-03-31', price: 295 }, { date: '2023-04-28', price: 308 },
          { date: '2023-05-31', price: 315 }, { date: '2023-06-30', price: 330 },
          { date: '2023-07-31', price: 345 }, { date: '2023-08-31', price: 328 },
          { date: '2023-09-29', price: 310 }, { date: '2023-10-31', price: 330 },
          { date: '2023-11-30', price: 352 }, { date: '2023-12-29', price: 368 },
          { date: '2024-01-31', price: 375 }, { date: '2024-02-29', price: 385 },
          { date: '2024-03-28', price: 378 }, { date: '2024-04-30', price: 390 },
          { date: '2024-05-31', price: 410 }, { date: '2024-06-28', price: 420 },
          { date: '2024-07-31', price: 435 }, { date: '2024-08-30', price: 448 },
          { date: '2024-09-30', price: 460 }, { date: '2024-10-31', price: 470 },
          { date: '2024-11-29', price: 476 }, { date: '2024-12-31', price: 479 }
        ]
      },
      'URTH': {
        currentPrice: 118.4,
        previousClose: 117.5,
        history: [
          { date: '2023-01-31', price: 95 }, { date: '2023-02-28', price: 98 },
          { date: '2023-03-31', price: 101 }, { date: '2023-04-28', price: 103 },
          { date: '2023-05-31', price: 105 }, { date: '2023-06-30', price: 108 },
          { date: '2023-07-31', price: 110 }, { date: '2023-08-31', price: 106 },
          { date: '2023-09-29', price: 102 }, { date: '2023-10-31', price: 106 },
          { date: '2023-11-30', price: 110 }, { date: '2023-12-29', price: 113 },
          { date: '2024-01-31', price: 114 }, { date: '2024-02-29', price: 116 },
          { date: '2024-03-28', price: 114 }, { date: '2024-04-30', price: 116 },
          { date: '2024-05-31', price: 118 }, { date: '2024-06-28', price: 119 },
          { date: '2024-07-31', price: 120 }, { date: '2024-08-30', price: 121 },
          { date: '2024-09-30', price: 120 }, { date: '2024-10-31', price: 119 },
          { date: '2024-11-29', price: 118 }, { date: '2024-12-31', price: 118 }
        ]
      },
      'GLD': {
        currentPrice: 231.7,
        previousClose: 232.4,
        history: [
          { date: '2023-01-31', price: 175 }, { date: '2023-02-28', price: 178 },
          { date: '2023-03-31', price: 182 }, { date: '2023-04-28', price: 188 },
          { date: '2023-05-31', price: 192 }, { date: '2023-06-30', price: 195 },
          { date: '2023-07-31', price: 188 }, { date: '2023-08-31', price: 180 },
          { date: '2023-09-29', price: 172 }, { date: '2023-10-31', price: 178 },
          { date: '2023-11-30', price: 185 }, { date: '2023-12-29', price: 190 },
          { date: '2024-01-31', price: 192 }, { date: '2024-02-29', price: 196 },
          { date: '2024-03-28', price: 198 }, { date: '2024-04-30', price: 205 },
          { date: '2024-05-31', price: 210 }, { date: '2024-06-28', price: 218 },
          { date: '2024-07-31', price: 220 }, { date: '2024-08-30', price: 225 },
          { date: '2024-09-30', price: 228 }, { date: '2024-10-31', price: 230 },
          { date: '2024-11-29', price: 232 }, { date: '2024-12-31', price: 232 }
        ]
      },
      '%5EFCHI': {
        currentPrice: 7842,
        previousClose: 7810,
        history: [
          { date: '2023-01-31', price: 6800 }, { date: '2023-02-28', price: 6950 },
          { date: '2023-03-31', price: 7100 }, { date: '2023-04-28', price: 7200 },
          { date: '2023-05-31', price: 7350 }, { date: '2023-06-30', price: 7450 },
          { date: '2023-07-31', price: 7300 }, { date: '2023-08-31', price: 7100 },
          { date: '2023-09-29', price: 6950 }, { date: '2023-10-31', price: 7050 },
          { date: '2023-11-30', price: 7200 }, { date: '2023-12-29', price: 7350 },
          { date: '2024-01-31', price: 7400 }, { date: '2024-02-29', price: 7500 },
          { date: '2024-03-28', price: 7450 }, { date: '2024-04-30', price: 7550 },
          { date: '2024-05-31', price: 7650 }, { date: '2024-06-28', price: 7700 },
          { date: '2024-07-31', price: 7750 }, { date: '2024-08-30', price: 7800 },
          { date: '2024-09-30', price: 7820 }, { date: '2024-10-31', price: 7840 },
          { date: '2024-11-29', price: 7842 }, { date: '2024-12-31', price: 7842 }
        ]
      }
    };

    const fallbackData = FALLBACK[symbol];
    res.status(200).json({
      symbol,
      currentPrice: fallbackData?.currentPrice || 0,
      previousClose: fallbackData?.previousClose || 0,
      currency: 'USD',
      isFallback: true,
      latency,
      history: fallbackData?.history || [],
      error: error.message
    });
  }
}
