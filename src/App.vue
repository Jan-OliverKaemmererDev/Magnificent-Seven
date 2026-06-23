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
  '#38bdf8', // Light blue
  '#0284c7', // Darker blue
  '#0ea5e9', // Blue
  '#7dd3fc', // Very light blue
  '#0369a1', // Deep blue
  '#bae6fd', // Pale blue
  '#00d2ff'  // Cyan
];

const lineChartData = computed(() => ({
  labels: revenueHistoryData.value.labels,
  datasets: revenueHistoryData.value.datasets.map((ds, i) => {
    // Append the latest value to the label
    const latestValue = ds.data.length > 0 ? ds.data[ds.data.length - 1] : '';
    return {
      label: `${ds.label} ${latestValue}`,
      data: ds.data,
      borderColor: colors[i % colors.length],
      backgroundColor: colors[i % colors.length],
    };
  })
}));

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

const scrollRight = () => {
  if (cardsContainer.value) {
    cardsContainer.value.scrollBy({ left: 250, behavior: 'smooth' });
  }
};

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
        <!-- Top Row: Horizontal scroll of cards -->
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

      <!-- Middle Row: Line Chart + Donut -->
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

      <!-- Bottom Row: Bar Charts -->
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
/* Global Resets */
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
.dashboard-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

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

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Fix chart blow-out on small screens */
.charts-middle > *, .charts-bottom > * {
  min-width: 0;
}

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
  /* hide scrollbar */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.cards-section::-webkit-scrollbar {
  display: none;
}

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

.charts-middle {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.charts-bottom {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 1.5rem;
  margin-top: 2rem;
}

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
</style>
