import { ref, computed } from 'vue';

const API_KEY = 'MMJAZRVURIF3GYD4';
const BASE_URL = 'https://www.alphavantage.co/query';

const COMPANY_META = {
  AAPL: { name: 'Apple', icon: 'apple.svg' },
  MSFT: { name: 'Microsoft', icon: 'microsoft.svg' },
  NVDA: { name: 'Nvidia', icon: 'nvidia.svg' },
  GOOG: { name: 'Google', icon: 'google.svg' },
  AMZN: { name: 'Amazon', icon: 'amazon.svg' },
  META: { name: 'Meta', icon: 'meta.svg' },
  TSLA: { name: 'Tesla', icon: 'tesla.svg' }
};

const MAG_7 = Object.keys(COMPANY_META);
const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function useAlphaVantage() {
  const isLoading = ref(true);
  const error = ref(null);

  // Raw data store
  const rawData = ref({});

  // Fetch logic with caching
  async function loadData() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const fetchedData = {};
      
      for (const ticker of MAG_7) {
        const cacheKey = `av_income_statement_${ticker}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          const parsedCache = JSON.parse(cached);
          const now = new Date().getTime();
          if (now - parsedCache.timestamp < CACHE_EXPIRATION_MS) {
            fetchedData[ticker] = parsedCache.data;
            continue;
          }
        }

        // Fetch from API
        const url = `${BASE_URL}?function=INCOME_STATEMENT&symbol=${ticker}&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        // Alpha Vantage returns 'Note' or 'Information' on rate limits
        if (data.Note || data.Information) {
          throw new Error(`Alpha Vantage API Limit erreicht. Bitte versuche es später wieder.`);
        }
        
        if (!data.quarterlyReports) {
          throw new Error(`Unerwartete API Antwort für ${ticker}.`);
        }

        fetchedData[ticker] = data;
        
        // Cache the data
        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: new Date().getTime(),
          data: data
        }));

        // Add a small delay to avoid hitting the 5 requests/minute limit immediately, 
        // though standard keys may still hit the 25 req/day limit quickly.
        await new Promise(r => setTimeout(r, 2000));
      }
      
      rawData.value = fetchedData;
    } catch (err) {
      console.error(err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  // --- Data Transformations ---

  // Helper to get value in Billions
  const toBillions = (valueStr) => {
    const val = parseFloat(valueStr);
    if (isNaN(val)) return 0;
    return val / 1000000000;
  };

  const topCardsData = computed(() => {
    if (!Object.keys(rawData.value).length) return [];
    
    return MAG_7.map(ticker => {
      const reports = rawData.value[ticker]?.quarterlyReports || [];
      const q0 = reports[0];
      const q4 = reports[4]; // Same quarter last year
      
      const revQ0 = toBillions(q0?.totalRevenue);
      const revQ4 = toBillions(q4?.totalRevenue);
      
      let growthAbs = 0;
      let growthPct = 0;
      
      if (revQ4 > 0) {
        growthAbs = revQ0 - revQ4;
        growthPct = (growthAbs / revQ4) * 100;
      }
      
      return {
        ticker,
        name: COMPANY_META[ticker].name,
        revenue: revQ0.toFixed(2),
        growthAbs: growthAbs.toFixed(2),
        growthPct: growthPct.toFixed(2),
        icon: COMPANY_META[ticker].icon
      };
    });
  });

  const revenueBreakdownData = computed(() => {
    if (!Object.keys(rawData.value).length) return { labels: [], data: [] };
    
    const labels = [];
    const data = [];
    
    MAG_7.forEach(ticker => {
      const q0 = rawData.value[ticker]?.quarterlyReports?.[0];
      labels.push(COMPANY_META[ticker].name);
      data.push(toBillions(q0?.totalRevenue).toFixed(2));
    });
    
    return { labels, data };
  });

  const netIncomeData = computed(() => {
    if (!Object.keys(rawData.value).length) return { labels: [], data: [] };
    
    const labels = [];
    const data = [];
    
    MAG_7.forEach(ticker => {
      const reports = rawData.value[ticker]?.quarterlyReports || [];
      // TTM (Trailing Twelve Months) = sum of last 4 quarters
      const ttmNetIncome = reports.slice(0, 4).reduce((sum, q) => sum + toBillions(q.netIncome), 0);
      
      labels.push(COMPANY_META[ticker].name);
      data.push(ttmNetIncome.toFixed(2));
    });
    
    // Sort descending
    const combined = labels.map((l, i) => ({ label: l, value: parseFloat(data[i]) }));
    combined.sort((a, b) => b.value - a.value);
    
    return {
      labels: combined.map(c => c.label),
      data: combined.map(c => c.value)
    };
  });

  const grossMarginData = computed(() => {
    if (!Object.keys(rawData.value).length) return { labels: [], data: [] };
    
    const labels = [];
    const data = [];
    
    MAG_7.forEach(ticker => {
      const q0 = rawData.value[ticker]?.quarterlyReports?.[0];
      const gp = parseFloat(q0?.grossProfit) || 0;
      const rev = parseFloat(q0?.totalRevenue) || 0;
      const margin = rev > 0 ? (gp / rev) * 100 : 0;
      
      labels.push(COMPANY_META[ticker].name);
      data.push(margin.toFixed(1));
    });

    // Sort descending
    const combined = labels.map((l, i) => ({ label: l, value: parseFloat(data[i]) }));
    combined.sort((a, b) => b.value - a.value);

    return {
      labels: combined.map(c => c.label),
      data: combined.map(c => c.value)
    };
  });

  const revenueGrowthData = computed(() => {
    if (!Object.keys(rawData.value).length) return { labels: [], datasets: [] };
    
    const labels = MAG_7.map(t => COMPANY_META[t].name);
    const datasets = [];
    
    // Calculate YoY growth for the last 4 available quarters
    // Quarter 0 (most recent), Quarter 1, 2, 3
    for (let i = 0; i < 4; i++) {
      const qData = [];
      let labelName = `Q${i+1} (Letzte)`;
      
      MAG_7.forEach(ticker => {
        const reports = rawData.value[ticker]?.quarterlyReports || [];
        const currentQ = reports[i];
        const prevYearQ = reports[i + 4]; // Same quarter previous year
        
        if (currentQ && prevYearQ && parseFloat(prevYearQ.totalRevenue) > 0) {
          const currentRev = parseFloat(currentQ.totalRevenue);
          const prevRev = parseFloat(prevYearQ.totalRevenue);
          const growth = ((currentRev - prevRev) / prevRev) * 100;
          qData.push(Math.round(growth));
          
          if (ticker === 'AAPL' && currentQ.fiscalDateEnding) {
             labelName = currentQ.fiscalDateEnding; // Use Apple's fiscal date as rough label
          }
        } else {
          qData.push(0);
        }
      });
      
      datasets.push({
        label: labelName,
        data: qData
      });
    }
    
    return { labels, datasets };
  });

  const revenueHistoryData = computed(() => {
    if (!Object.keys(rawData.value).length) return { labels: [], datasets: [] };
    
    // Get up to 12 quarters (3 years)
    const MAX_QUARTERS = 12;
    const datasets = [];
    let commonLabels = [];
    
    MAG_7.forEach(ticker => {
      const reports = rawData.value[ticker]?.quarterlyReports || [];
      const recentReports = reports.slice(0, MAX_QUARTERS).reverse(); // Oldest to newest
      
      if (ticker === 'AAPL') {
        commonLabels = recentReports.map(q => q.fiscalDateEnding);
      }
      
      datasets.push({
        label: COMPANY_META[ticker].name,
        data: recentReports.map(q => toBillions(q.totalRevenue).toFixed(2))
      });
    });
    
    return {
      labels: commonLabels,
      datasets
    };
  });

  return {
    isLoading,
    error,
    loadData,
    topCardsData,
    revenueBreakdownData,
    netIncomeData,
    grossMarginData,
    revenueGrowthData,
    revenueHistoryData
  };
}
