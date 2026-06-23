<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

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
 * Generates custom legend labels with white stroke styling.
 * @param {Object} chart - The Chart.js chart instance.
 * @returns {Object[]} Array of label configuration objects with white borders.
 */
function generateCustomLabels(chart) {
  const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
  const labels = original(chart);
  labels.forEach(label => {
    label.strokeStyle = '#ffffff';
    label.lineWidth = 1;
  });
  return labels;
}

/**
 * Computed Chart.js options for the revenue line chart.
 * Dynamically adjusts legend position based on the legendPosition prop.
 * @type {import('vue').ComputedRef<Object>}
 */
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: props.legendPosition,
      labels: { 
        color: '#9ca3af', 
        font: { family: 'Rubik' },
        generateLabels: generateCustomLabels
      }
    },
    datalabels: {
      display: false
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
      ticks: { color: '#9ca3af', font: { family: 'Rubik', size: 10 } },
      border: { color: '#ffffff', width: 1 }
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
      ticks: { color: '#9ca3af', font: { family: 'Rubik', size: 10 } },
      border: { color: '#ffffff', width: 1 }
    }
  },
  elements: {
    line: { borderWidth: 2, tension: 0.3 },
    point: { radius: 0 }
  }
}))
</script>

<template>
  <div class="chart-container">
    <h3 class="chart-title">Revenue last 3 years</h3>
    <div class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>
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
   Responsive
   ====================================================== */
@media (max-width: 768px) {
  .chart-container {
    padding: 1rem;
  }
}
</style>
