<script setup>
import StockCard from './StockCard.vue'

defineProps({
  stocks: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  featured: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <section v-if="stocks.length > 0" class="stock-grid">
    <div class="stock-grid__header">
      <h2 class="stock-grid__title">{{ title }}</h2>
      <span class="stock-grid__count">{{ stocks.length }}</span>
    </div>

    <div
      class="stock-grid__list"
      :class="{ 'stock-grid__list--featured': featured }"
    >
      <StockCard
        v-for="stock in stocks"
        :key="stock.ticker"
        :stock="stock"
        :featured="featured"
      />
    </div>
  </section>
</template>

<style scoped>
.stock-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stock-grid__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stock-grid__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
}

.stock-grid__count {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: #94a3b8;
}

/* Grid layouts */
.stock-grid__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.625rem;
}

.stock-grid__list--featured {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .stock-grid__list,
  .stock-grid__list--featured {
    grid-template-columns: 1fr;
  }
}
</style>
