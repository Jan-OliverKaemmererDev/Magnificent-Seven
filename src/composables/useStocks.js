import { ref, computed } from 'vue'
import { useCsvParser } from './useCsvParser'

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSE9O332jZ7FaoZRpK_d27RA3FMXhizwRQMXJDjEII4Hi_tAaMVQS5rP4PhbVWXBommFUiiBk2r_gRS/pub?output=csv'

/**
 * The "Magnificent Seven" — the 7 mega-cap tech stocks
 * that have their own SVG logo in /stock-icons/.
 */
const MAGNIFICENT_SEVEN = ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'META', 'NVDA', 'TSLA']

/**
 * Maps tickers to their SVG icon filename in /stock-icons/.
 */
const TICKER_ICON_MAP = {
  AAPL: 'apple.svg',
  MSFT: 'microsoft.svg',
  GOOG: 'alphabet.svg',
  AMZN: 'amazon.svg',
  META: 'meta.svg',
  NVDA: 'nvidia.svg',
  TSLA: 'tesla.svg',
}

/**
 * Filters raw parsed CSV rows to only include valid stock entries.
 * Excludes header rows, empty tickers, and rows without a proper company link.
 * @param {Object[]} rawRows - Array of parsed CSV row objects with ticker and companyLink fields.
 * @returns {Object[]} Filtered array of valid row objects.
 */
function filterValidRows(rawRows) {
  return rawRows.filter((row) => {
    if (!row.ticker || row.ticker === 'Ticker') return false
    if (!row.companyLink || !row.companyLink.startsWith('▶️')) return false
    return true
  })
}

/**
 * Maps a raw CSV row object to a stock data object.
 * Extracts ticker, company name, MAG 7 membership, and icon path.
 * @param {Object} row - A parsed CSV row with ticker and companyLink fields.
 * @returns {{ ticker: string, companyName: string, isMag7: boolean, iconPath: string|null }}
 */
function mapToStockObject(row) {
  const ticker = row.ticker.trim()
  const companyName = row.companyLink.replace('▶️', '').trim()
  const isMag7 = MAGNIFICENT_SEVEN.includes(ticker)
  const iconFilename = TICKER_ICON_MAP[ticker] || null
  const iconPath = iconFilename ? `/stock-icons/${iconFilename}` : null
  return { ticker, companyName, isMag7, iconPath }
}

/**
 * Composable that fetches stock data from the published Google Sheets CSV
 * and provides reactive state for the component tree.
 * @returns {Object} Reactive refs and computed properties for stock data, filtering, and loading state.
 */
export function useStocks() {
  const allStocks = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')

  const { parse } = useCsvParser()

  /**
   * Fetches the CSV from Google Sheets and populates allStocks with parsed stock objects.
   * Each stock has: { ticker, companyName, isMag7, iconPath }.
   */
  async function loadStocks() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(CSV_URL)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const csvText = await response.text()
      const rawRows = parse(csvText, ['ticker', 'companyLink'], [0, 1])
      allStocks.value = filterValidRows(rawRows).map(mapToStockObject)
    } catch (err) {
      error.value = err.message || 'Fehler beim Laden der Aktien-Daten.'
      console.error('[useStocks] Fehler:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * The 7 highlighted mega-cap stocks from the full list.
   * @type {import('vue').ComputedRef<Object[]>}
   */
  const magnificentSeven = computed(() =>
    allStocks.value.filter((s) => s.isMag7)
  )

  /**
   * All remaining stocks not in the Magnificent Seven.
   * @type {import('vue').ComputedRef<Object[]>}
   */
  const otherStocks = computed(() =>
    allStocks.value.filter((s) => !s.isMag7)
  )

  /**
   * Stocks filtered by the current search query (matches ticker or company name).
   * @type {import('vue').ComputedRef<Object[]>}
   */
  const filteredStocks = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) return allStocks.value
    return allStocks.value.filter(
      (s) =>
        s.ticker.toLowerCase().includes(query) ||
        s.companyName.toLowerCase().includes(query)
    )
  })

  /**
   * Magnificent Seven stocks filtered by the current search query.
   * @type {import('vue').ComputedRef<Object[]>}
   */
  const filteredMag7 = computed(() =>
    filteredStocks.value.filter((s) => s.isMag7)
  )

  /**
   * Other stocks (non-MAG 7) filtered by the current search query.
   * @type {import('vue').ComputedRef<Object[]>}
   */
  const filteredOther = computed(() =>
    filteredStocks.value.filter((s) => !s.isMag7)
  )

  return {
    allStocks,
    magnificentSeven,
    otherStocks,
    filteredStocks,
    filteredMag7,
    filteredOther,
    loading,
    error,
    searchQuery,
    loadStocks,
  }
}
