import { ref, computed } from 'vue';

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
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
const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000;

/**
 * Converts a numeric string value to billions.
 * @param {string} valueStr - The raw numeric string from the API.
 * @returns {number} The value divided by one billion, or 0 if invalid.
 */
const toBillions = (valueStr) => {
  const val = parseFloat(valueStr);
  if (isNaN(val)) return 0;
  return val / 1000000000;
};

/**
 * Retrieves cached income statement data from localStorage.
 * @param {string} ticker - The stock ticker symbol.
 * @returns {Object|null} The cached API data, or null if expired/missing.
 */
function getCachedData(ticker) {
  const cached = localStorage.getItem(`av_income_statement_${ticker}`);
  if (!cached) return null;
  const parsedCache = JSON.parse(cached);
  const isExpired = Date.now() - parsedCache.timestamp >= CACHE_EXPIRATION_MS;
  return isExpired ? null : parsedCache.data;
}

/**
 * Fetches income statement data for a single ticker from the Alpha Vantage API.
 * @param {string} ticker - The stock ticker symbol.
 * @returns {Promise<Object>} The parsed JSON response from the API.
 * @throws {Error} If the API rate limit is hit or the response is unexpected.
 */
async function fetchTickerData(ticker) {
  const url = `${BASE_URL}?function=INCOME_STATEMENT&symbol=${ticker}&apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.Note || data.Information) {
    throw new Error('Alpha Vantage API Limit erreicht. Bitte versuche es später wieder.');
  }
  if (!data.quarterlyReports) {
    throw new Error(`Unerwartete API Antwort für ${ticker}.`);
  }
  return data;
}

/**
 * Stores income statement data in localStorage with a timestamp.
 * @param {string} ticker - The stock ticker symbol.
 * @param {Object} data - The API response data to cache.
 */
function cacheData(ticker, data) {
  const cacheKey = `av_income_statement_${ticker}`;
  localStorage.setItem(cacheKey, JSON.stringify({
    timestamp: Date.now(),
    data: data
  }));
}

/**
 * Calculates absolute and percentage revenue growth between two quarters.
 * @param {number} currentRevenue - Revenue of the current quarter in billions.
 * @param {number} previousRevenue - Revenue of the comparison quarter in billions.
 * @returns {{ growthAbs: string, growthPct: string }} Formatted growth values.
 */
function calculateGrowth(currentRevenue, previousRevenue) {
  if (previousRevenue <= 0) return { growthAbs: '0.00', growthPct: '0.00' };
  const abs = currentRevenue - previousRevenue;
  const pct = (abs / previousRevenue) * 100;
  return { growthAbs: abs.toFixed(2), growthPct: pct.toFixed(2) };
}

/**
 * Sorts label-value pairs in descending order by value.
 * @param {string[]} labels - The label array (e.g. company names).
 * @param {(string|number)[]} data - The corresponding values.
 * @returns {{ labels: string[], data: number[] }} Sorted labels and numeric data.
 */
function sortDescending(labels, data) {
  const combined = labels.map((l, i) => ({ label: l, value: parseFloat(data[i]) }));
  combined.sort((a, b) => b.value - a.value);
  return {
    labels: combined.map(c => c.label),
    data: combined.map(c => c.value)
  };
}

/**
 * Calculates YoY revenue growth for a specific quarter offset across all MAG 7 companies.
 * @param {Object} raw - The raw data object keyed by ticker.
 * @param {number} quarterIndex - The quarter offset (0 = most recent).
 * @returns {{ label: string, data: number[] }} Dataset with label and growth percentages.
 */
function calculateQuarterGrowth(raw, quarterIndex) {
  let labelName = `Q${quarterIndex + 1} (Letzte)`;
  const qData = MAG_7.map(ticker => {
    const reports = raw[ticker]?.quarterlyReports || [];
    const currentQ = reports[quarterIndex];
    const prevYearQ = reports[quarterIndex + 4];
    if (!currentQ || !prevYearQ || parseFloat(prevYearQ.totalRevenue) <= 0) return 0;
    const growth = ((parseFloat(currentQ.totalRevenue) - parseFloat(prevYearQ.totalRevenue)) / parseFloat(prevYearQ.totalRevenue)) * 100;
    if (ticker === 'AAPL' && currentQ.fiscalDateEnding) labelName = currentQ.fiscalDateEnding;
    return Math.round(growth);
  });
  return { label: labelName, data: qData };
}

/**
 * Builds a revenue history dataset for a single ticker.
 * @param {Object} raw - The raw data object keyed by ticker.
 * @param {string} ticker - The stock ticker symbol.
 * @param {number} maxQuarters - Maximum number of quarters to include.
 * @returns {{ label: string, data: string[] }} Dataset with company name and revenue values.
 */
function buildTickerDataset(raw, ticker, maxQuarters) {
  const reports = raw[ticker]?.quarterlyReports || [];
  const recentReports = reports.slice(0, maxQuarters).reverse();
  return {
    label: COMPANY_META[ticker].name,
    data: recentReports.map(q => toBillions(q.totalRevenue).toFixed(2))
  };
}

/**
 * Composable that fetches and transforms Magnificent Seven financial data
 * from the Alpha Vantage API with localStorage caching.
 * @returns {Object} Reactive state and computed chart data for the dashboard.
 */
export function useAlphaVantage() {
  const isLoading = ref(true);
  const error = ref(null);
  const rawData = ref({});

  /**
   * Loads income statement data for all MAG 7 tickers.
   * Uses localStorage cache when available; fetches from API otherwise.
   * Includes a 2-second delay between API calls to respect rate limits.
   */
  async function loadData() {
    isLoading.value = true;
    error.value = null;
    try {
      const fetchedData = {};
      for (const ticker of MAG_7) {
        const cached = getCachedData(ticker);
        if (cached) { fetchedData[ticker] = cached; continue; }
        fetchedData[ticker] = await fetchTickerData(ticker);
        cacheData(ticker, fetchedData[ticker]);
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

  /**
   * Computed property providing card data for each MAG 7 company.
   * Includes ticker, name, latest quarterly revenue, and YoY growth.
   * @type {import('vue').ComputedRef<Array<{ticker: string, name: string, revenue: string, growthAbs: string, growthPct: string, icon: string}>>}
   */
  const topCardsData = computed(() => {
    if (!Object.keys(rawData.value).length) return [];
    return MAG_7.map(ticker => {
      const reports = rawData.value[ticker]?.quarterlyReports || [];
      const revQ0 = toBillions(reports[0]?.totalRevenue);
      const revQ4 = toBillions(reports[4]?.totalRevenue);
      const { growthAbs, growthPct } = calculateGrowth(revQ0, revQ4);
      return {
        ticker, name: COMPANY_META[ticker].name,
        revenue: revQ0.toFixed(2), growthAbs, growthPct,
        icon: COMPANY_META[ticker].icon
      };
    });
  });

  /**
   * Computed property providing revenue breakdown data for the donut chart.
   * Shows latest quarterly revenue per company in billions.
   * @type {import('vue').ComputedRef<{labels: string[], data: string[]}>}
   */
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

  /**
   * Computed property providing trailing twelve months net income, sorted descending.
   * Sums the last 4 quarters of net income per company.
   * @type {import('vue').ComputedRef<{labels: string[], data: number[]}>}
   */
  const netIncomeData = computed(() => {
    if (!Object.keys(rawData.value).length) return { labels: [], data: [] };
    const labels = [];
    const data = [];
    MAG_7.forEach(ticker => {
      const reports = rawData.value[ticker]?.quarterlyReports || [];
      const ttm = reports.slice(0, 4).reduce((sum, q) => sum + toBillions(q.netIncome), 0);
      labels.push(COMPANY_META[ticker].name);
      data.push(ttm.toFixed(2));
    });
    return sortDescending(labels, data);
  });

  /**
   * Computed property providing gross margin percentages for the latest quarter, sorted descending.
   * @type {import('vue').ComputedRef<{labels: string[], data: number[]}>}
   */
  const grossMarginData = computed(() => {
    if (!Object.keys(rawData.value).length) return { labels: [], data: [] };
    const labels = [];
    const data = [];
    MAG_7.forEach(ticker => {
      const q0 = rawData.value[ticker]?.quarterlyReports?.[0];
      const gp = parseFloat(q0?.grossProfit) || 0;
      const rev = parseFloat(q0?.totalRevenue) || 0;
      labels.push(COMPANY_META[ticker].name);
      data.push(rev > 0 ? ((gp / rev) * 100).toFixed(1) : '0.0');
    });
    return sortDescending(labels, data);
  });

  /**
   * Computed property providing YoY revenue growth data for the last 4 quarters.
   * Each dataset represents one quarter with growth percentages per company.
   * @type {import('vue').ComputedRef<{labels: string[], datasets: Array<{label: string, data: number[]}>}>}
   */
  const revenueGrowthData = computed(() => {
    if (!Object.keys(rawData.value).length) return { labels: [], datasets: [] };
    const labels = MAG_7.map(t => COMPANY_META[t].name);
    const datasets = [];
    for (let i = 0; i < 4; i++) {
      datasets.push(calculateQuarterGrowth(rawData.value, i));
    }
    return { labels, datasets };
  });

  /**
   * Computed property providing quarterly revenue history for the line chart.
   * Includes up to 12 quarters (3 years) per company, ordered oldest to newest.
   * @type {import('vue').ComputedRef<{labels: string[], datasets: Array<{label: string, data: string[]}>}>}
   */
  const revenueHistoryData = computed(() => {
    if (!Object.keys(rawData.value).length) return { labels: [], datasets: [] };
    const MAX_QUARTERS = 12;
    const reports = rawData.value['AAPL']?.quarterlyReports || [];
    const labels = reports.slice(0, MAX_QUARTERS).reverse().map(q => q.fiscalDateEnding);
    const datasets = MAG_7.map(ticker => buildTickerDataset(rawData.value, ticker, MAX_QUARTERS));
    return { labels, datasets };
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
