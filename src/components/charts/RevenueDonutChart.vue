<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

import { computed } from 'vue'

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  legendPosition: {
    type: String,
    default: 'right'
  }
})

/**
 * Computed Chart.js options for the revenue donut chart.
 * Dynamically adjusts legend position based on the legendPosition prop.
 * @type {import('vue').ComputedRef<Object>}
 */
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      position: props.legendPosition,
      labels: { color: '#9ca3af', font: { family: 'Rubik' }, padding: 20 }
    },
    datalabels: {
      display: false
    }
  },
  elements: {
    arc: {
      borderWidth: 1,
      borderColor: '#ffffff'
    }
  }
}))
</script>

<template>
  <div class="chart-container">
    <h3 id="revenue-donut-title" class="chart-title">Revenue Breakdown Magnificent Seven</h3>
    <div class="chart-wrapper">
      <Doughnut :data="chartData" :options="chartOptions" role="img" aria-labelledby="revenue-donut-title" />
    </div>
    <p class="chart-subtitle">in Billion USD TTM</p>
  </div>
</template>

<style scoped>
/* ======================================================
   Container
   ====================================================== */
.chart-container {
  background-color: #111c2a;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* ======================================================
   Title
   ====================================================== */
.chart-title {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
  text-align: center;
}

/* ======================================================
   Chart Wrapper
   ====================================================== */
.chart-wrapper {
  flex-grow: 1;
  position: relative;
  height: 300px;
}

/* ======================================================
   Subtitle
   ====================================================== */
.chart-subtitle {
  color: #6b7280;
  font-size: 0.75rem;
  text-align: right;
  margin-bottom: 0;
  margin-top: 0.5rem;
}

/* ======================================================
   Responsive
   ====================================================== */
@media (max-width: 768px) {
  .chart-container {
    padding: 1rem;
  }
}
</style>
