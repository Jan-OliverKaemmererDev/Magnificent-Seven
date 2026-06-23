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

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: { 
        color: '#9ca3af', 
        font: { family: 'Rubik' },
        generateLabels: (chart) => {
          const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
          const labels = original(chart);
          labels.forEach(label => {
            label.strokeStyle = '#ffffff';
            label.lineWidth = 1;
          });
          return labels;
        }
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
}
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
.chart-container {
  background-color: #111c2a;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}
.chart-title {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
}
.chart-wrapper {
  flex-grow: 1;
  position: relative;
  height: 300px;
}
</style>
