<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'right',
      labels: { color: '#9ca3af', font: { family: 'Rubik' }, padding: 20 }
    }
  },
  elements: {
    arc: {
      borderWidth: 1,
      borderColor: '#111c2a'
    }
  }
}
</script>

<template>
  <div class="chart-container">
    <h3 class="chart-title">Revenue Breakdown Magnificent Seven</h3>
    <div class="chart-wrapper">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
    <p class="chart-subtitle">in Billion USD TTM</p>
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
  text-align: center;
}
.chart-wrapper {
  flex-grow: 1;
  position: relative;
  height: 300px;
}
.chart-subtitle {
  color: #6b7280;
  font-size: 0.75rem;
  text-align: right;
  margin-bottom: 0;
  margin-top: 0.5rem;
}
</style>
