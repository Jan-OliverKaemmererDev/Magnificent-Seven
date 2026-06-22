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
 * Composable that fetches stock data from the published Google Sheets CSV
 * and provides reactive state for the component tree.
 */
export function useStocks() {
  const allStocks = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')

  const { parse } = useCsvParser()

  /**
   * Fetches the CSV and populates allStocks with parsed objects.
   * Each stock has: { ticker, companyName, isMag7, iconPath }
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

      // The left side of the CSV (col 0 + col 1) has Ticker + "▶️ Company Name"
      const rawRows = parse(csvText, ['ticker', 'companyLink'], [0, 1])

      // Filter and clean the data
      const stocks = rawRows
        .filter((row) => {
          // Skip header row, empty tickers, and meta/note rows
          if (!row.ticker || row.ticker === 'Ticker') return false
          // Skip rows without a proper company link
          if (!row.companyLink || !row.companyLink.startsWith('▶️')) return false
          return true
        })
        .map((row) => {
          const ticker = row.ticker.trim()
          const companyName = row.companyLink.replace('▶️', '').trim()
          const isMag7 = MAGNIFICENT_SEVEN.includes(ticker)
          const iconFilename = TICKER_ICON_MAP[ticker] || null
          const iconPath = iconFilename ? `/stock-icons/${iconFilename}` : null

          return { ticker, companyName, isMag7, iconPath }
        })

      allStocks.value = stocks
    } catch (err) {
      error.value = err.message || 'Fehler beim Laden der Aktien-Daten.'
      console.error('[useStocks] Fehler:', err)
    } finally {
      loading.value = false
    }
  }

  /** The 7 highlighted mega-cap stocks */
  const magnificentSeven = computed(() =>
    allStocks.value.filter((s) => s.isMag7)
  )

  /** All remaining stocks (not in the Magnificent Seven) */
  const otherStocks = computed(() =>
    allStocks.value.filter((s) => !s.isMag7)
  )

  /** Stocks filtered by the current search query */
  const filteredStocks = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) return allStocks.value

    return allStocks.value.filter(
      (s) =>
        s.ticker.toLowerCase().includes(query) ||
        s.companyName.toLowerCase().includes(query)
    )
  })

  /** Magnificent Seven stocks filtered by search */
  const filteredMag7 = computed(() =>
    filteredStocks.value.filter((s) => s.isMag7)
  )

  /** Other stocks filtered by search */
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
