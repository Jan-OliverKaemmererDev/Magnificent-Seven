<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import CompanyCard from './components/CompanyCard.vue'
import RevenueLineChart from './components/charts/RevenueLineChart.vue'
import RevenueDonutChart from './components/charts/RevenueDonutChart.vue'
import SharedBarChart from './components/charts/SharedBarChart.vue'
import { useAlphaVantage } from './composables/useAlphaVantage'

const { 
  isLoading, 
  error, 
  loadData, 
  topCardsData, 
  revenueBreakdownData, 
  netIncomeData, 
  grossMarginData, 
  revenueGrowthData, 
  revenueHistoryData 
} = useAlphaVantage();

const isMobile = ref(false);

/**
 * Updates the isMobile ref based on the current viewport width.
 * Breakpoint is 768px.
 */
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  loadData();
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const colors = [
  '#38bdf8',
  '#0284c7',
  '#0ea5e9',
  '#7dd3fc',
  '#0369a1',
  '#bae6fd',
  '#00d2ff'
];

/**
 * Appends the latest revenue value to each dataset label for the legend.
 * @param {Object} ds - A single chart.js dataset object.
 * @param {number} colorIndex - The index for color assignment.
 * @returns {Object} A dataset object with color and updated label.
 */
function buildLineDataset(ds, colorIndex) {
  const latestValue = ds.data.length > 0 ? ds.data[ds.data.length - 1] : '';
  return {
    label: `${ds.label} ${latestValue}`,
    data: ds.data,
    borderColor: colors[colorIndex % colors.length],
    backgroundColor: colors[colorIndex % colors.length],
  };
}

/**
 * Computed chart data for the revenue history line chart.
 * Each dataset includes the latest value appended to the legend label.
 * @type {import('vue').ComputedRef<Object>}
 */
const lineChartData = computed(() => ({
  labels: revenueHistoryData.value.labels,
  datasets: revenueHistoryData.value.datasets.map((ds, i) => buildLineDataset(ds, i))
}));

/**
 * Computed chart data for the revenue breakdown donut chart.
 * Labels include their corresponding data values.
 * @type {import('vue').ComputedRef<Object>}
 */
const donutChartData = computed(() => {
  const labelsWithData = revenueBreakdownData.value.labels.map((label, idx) => {
    return `${label} ${revenueBreakdownData.value.data[idx]}`;
  });
  return {
    labels: labelsWithData,
    datasets: [{
      data: revenueBreakdownData.value.data,
      backgroundColor: colors,
      hoverOffset: 4
    }]
  };
});

/**
 * Computed chart data for the net income horizontal bar chart.
 * @type {import('vue').ComputedRef<Object>}
 */
const netIncomeChartData = computed(() => ({
  labels: netIncomeData.value.labels,
  datasets: [{
    label: 'Net Income TTM',
    data: netIncomeData.value.data,
    backgroundColor: '#0ea5e9',
    borderColor: '#ffffff',
    borderWidth: 1
  }]
}));

/**
 * Computed chart data for the gross margin horizontal bar chart.
 * @type {import('vue').ComputedRef<Object>}
 */
const grossMarginChartData = computed(() => ({
  labels: grossMarginData.value.labels,
  datasets: [{
    label: 'Gross Margin %',
    data: grossMarginData.value.data,
    backgroundColor: '#0ea5e9',
    borderColor: '#ffffff',
    borderWidth: 1
  }]
}));

/**
 * Computed chart data for the revenue growth grouped bar chart.
 * Each dataset represents one quarter with per-company growth values.
 * @type {import('vue').ComputedRef<Object>}
 */
const revenueGrowthChartData = computed(() => ({
  labels: revenueGrowthData.value.labels,
  datasets: revenueGrowthData.value.datasets.map((ds, i) => ({
    label: ds.label,
    data: ds.data,
    backgroundColor: colors[i % colors.length],
    borderColor: '#ffffff',
    borderWidth: 1
  }))
}));

const cardsContainer = ref(null);

/**
 * Scrolls the cards container 250px to the right with smooth animation.
 */
const scrollRight = () => {
  if (cardsContainer.value) {
    cardsContainer.value.scrollBy({ left: 250, behavior: 'smooth' });
  }
};

/**
 * Scrolls the cards container 250px to the left with smooth animation.
 */
const scrollLeft = () => {
  if (cardsContainer.value) {
    cardsContainer.value.scrollBy({ left: -250, behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="dashboard-wrapper">
    <header class="header">
      <div class="header-indicator"></div>
      <h1 class="header-title">The Magnificent Seven Companies</h1>
    </header>

    <main class="dashboard-content">
      <div v-if="isLoading" class="state-message">
        <div class="spinner"></div>
        <p>Lade echte Finanzdaten...</p>
      </div>
      <div v-else-if="error" class="state-message error">
        <p>{{ error }}</p>
      </div>
      <template v-else>
      <div class="cards-wrapper">
        <button class="scroll-arrow arrow-left" @click="scrollLeft" aria-label="Scroll left">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <section class="cards-section" ref="cardsContainer">
          <CompanyCard v-for="stock in topCardsData" :key="stock.ticker" :stock="stock" />
        </section>
        
        <button class="scroll-arrow arrow-right" @click="scrollRight" aria-label="Scroll right">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <section class="charts-middle">
        <RevenueLineChart 
          :chartData="lineChartData" 
          :legendPosition="isMobile ? 'bottom' : 'right'" 
          class="chart-line" 
        />
        <RevenueDonutChart 
          :chartData="donutChartData" 
          :legendPosition="isMobile ? 'bottom' : 'right'" 
          class="chart-donut" 
        />
      </section>

      <section class="charts-bottom">
        <SharedBarChart 
          title="Net Income TTM" 
          :chartData="netIncomeChartData" 
          :horizontal="true" 
        />
        <SharedBarChart 
          title="Gross Margin in % LQ" 
          :chartData="grossMarginChartData" 
          :horizontal="true" 
        />
        <SharedBarChart 
          title="Revenue Growth in % YoY" 
          :chartData="revenueGrowthChartData" 
          class="chart-growth" 
        />
      </section>
      </template>
    </main>
  </div>
</template>

<style>
/* ======================================================
   Global Resets
   ====================================================== */
body {
  margin: 0;
  padding: 0;
  background-color: #0b131e;
  font-family: 'Rubik', system-ui, sans-serif;
  color: #ffffff;
}

#app {
  min-height: 100vh;
}
</style>

<style scoped>
/* ======================================================
   Layout
   ====================================================== */
.dashboard-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ======================================================
   Header
   ====================================================== */
.header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-indicator {
  width: 48px;
  height: 16px;
  background-color: #38bdf8;
  border-radius: 8px;
}

.header-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

/* ======================================================
   Cards Section
   ====================================================== */
.cards-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.cards-section {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.cards-section::-webkit-scrollbar {
  display: none;
}

/* ======================================================
   Scroll Arrows
   ====================================================== */
.scroll-arrow {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #38bdf8;
  color: #0b131e;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  z-index: 10;
  transition: transform 0.2s, background-color 0.2s;
}

.arrow-right {
  right: -30px;
}

.arrow-left {
  left: -30px;
}

.scroll-arrow:hover {
  background-color: #0ea5e9;
  transform: scale(1.05);
}

/* ======================================================
   Chart Grids
   ====================================================== */
.charts-middle {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.charts-middle > *, .charts-bottom > * {
  min-width: 0;
}

.charts-bottom {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 1.5rem;
  margin-top: 2rem;
}

/* ======================================================
   State Messages
   ====================================================== */
.state-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: #38bdf8;
  font-size: 1.2rem;
}

.state-message.error {
  color: #ef4444;
}

/* ======================================================
   Spinner
   ====================================================== */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(56, 189, 248, 0.2);
  border-left-color: #38bdf8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ======================================================
   Responsive
   ====================================================== */
@media (max-width: 1024px) {
  .charts-middle {
    grid-template-columns: 1fr;
  }
  .charts-bottom {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-wrapper {
    padding: 1rem;
  }
  .dashboard-content {
    gap: 1.5rem;
  }
  .scroll-arrow {
    display: none;
  }
}
</style>
