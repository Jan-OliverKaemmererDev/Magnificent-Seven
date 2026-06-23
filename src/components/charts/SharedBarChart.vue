<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  horizontal: {
    type: Boolean,
    default: false
  }
})

/**
 * Formats a chart data value for the datalabel display.
 * Appends a percent sign when the chart title contains "%".
 * @param {number|string} value - The raw data value from the chart.
 * @returns {string} The formatted display string.
 */
function formatDataLabel(value) {
  if (props.title.includes('%')) {
    return `${value}%`
  }
  return value
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: props.horizontal ? 'y' : 'x',
  plugins: {
    legend: {
      display: !props.horizontal,
      position: 'right',
      labels: { color: '#9ca3af', font: { family: 'Rubik' } }
    },
    datalabels: {
      display: props.horizontal,
      color: '#ffffff',
      anchor: 'end',
      align: 'start',
      offset: 4,
      font: { family: 'Rubik', size: 10 },
      formatter: formatDataLabel
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
  }
}
</script>

<template>
  <div class="chart-container">
    <h3 :id="`chart-title-${title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`" class="chart-title">{{ title }}</h3>
    <div class="chart-wrapper">
      <Bar :data="chartData" :options="chartOptions" :plugins="[ChartDataLabels]" role="img" :aria-labelledby="`chart-title-${title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`" />
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
