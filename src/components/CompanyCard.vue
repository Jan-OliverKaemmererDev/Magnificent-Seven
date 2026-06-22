<script setup>
defineProps({
  stock: {
    type: Object,
    required: true,
  }
});
</script>

<template>
  <div class="company-card">
    <div class="card-header">
      <img :src="`/stock-icons/${stock.icon}`" :alt="stock.name" class="company-logo" />
      <span class="company-name">{{ stock.name }}</span>
    </div>
    
    <div class="card-body">
      <p class="revenue-label">Revenue Q1 2024</p>
      <div class="revenue-values">
        <span class="revenue-main">{{ stock.revenue }}</span>
        <div class="growth-container" :class="stock.growthAbs >= 0 ? 'growth-positive' : 'growth-negative'">
          <span class="growth-abs">
            {{ stock.growthAbs >= 0 ? '+' : '' }}{{ stock.growthAbs }} 
            {{ stock.growthAbs >= 0 ? '↑' : '↓' }}
          </span>
          <span class="growth-pct">
            {{ stock.growthPct >= 0 ? '+' : '' }}{{ stock.growthPct }} %
          </span>
        </div>
      </div>
      <p class="revenue-unit">in Bill USD</p>
    </div>
  </div>
</template>

<style scoped>
.company-card {
  background-color: #111c2a;
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 180px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.company-logo {
  width: 24px;
  height: 24px;
}

.company-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: #ffffff;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.revenue-label {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

.revenue-values {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.revenue-main {
  font-size: 2rem;
  color: #ffffff;
}

.growth-container {
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  font-weight: 500;
}

.growth-positive {
  color: #10b981;
}

.growth-negative {
  color: #ef4444;
}

.revenue-unit {
  font-size: 0.65rem;
  color: #6b7280;
  margin: 0;
}
</style>
