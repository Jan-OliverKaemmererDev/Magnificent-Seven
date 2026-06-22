<script setup>
import { computed, ref } from 'vue'
import CompanyCard from './components/CompanyCard.vue'
import RevenueLineChart from './components/charts/RevenueLineChart.vue'
import RevenueDonutChart from './components/charts/RevenueDonutChart.vue'
import SharedBarChart from './components/charts/SharedBarChart.vue'

import {
  topCardsData,
  revenueBreakdownData,
  netIncomeData,
  grossMarginData,
  revenueGrowthData,
  revenueHistoryData
} from './data/mockData'

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
  labels: revenueHistoryData.labels,
  datasets: revenueHistoryData.datasets.map((ds, i) => ({
    label: ds.label,
    data: ds.data,
    borderColor: colors[i % colors.length],
    backgroundColor: colors[i % colors.length],
  }))
}));

const donutChartData = computed(() => ({
  labels: revenueBreakdownData.labels,
  datasets: [{
    data: revenueBreakdownData.data,
    backgroundColor: colors,
    hoverOffset: 4
  }]
}));

const netIncomeChartData = computed(() => ({
  labels: netIncomeData.labels,
  datasets: [{
    label: 'Net Income TTM',
    data: netIncomeData.data,
    backgroundColor: '#0ea5e9'
  }]
}));

const grossMarginChartData = computed(() => ({
  labels: grossMarginData.labels,
  datasets: [{
    label: 'Gross Margin %',
    data: grossMarginData.data,
    backgroundColor: '#0ea5e9'
  }]
}));

const revenueGrowthChartData = computed(() => ({
  labels: revenueGrowthData.labels,
  datasets: revenueGrowthData.datasets.map((ds, i) => ({
    label: ds.label,
    data: ds.data,
    backgroundColor: colors[i % colors.length]
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
        <RevenueLineChart :chartData="lineChartData" class="chart-line" />
        <RevenueDonutChart :chartData="donutChartData" class="chart-donut" />
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
}

@media (max-width: 1024px) {
  .charts-middle {
    grid-template-columns: 1fr;
  }
  .charts-bottom {
    grid-template-columns: 1fr;
  }
}
</style>
