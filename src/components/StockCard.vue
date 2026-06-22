<script setup>
defineProps({
  stock: {
    type: Object,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="stock-card" :class="{ 'stock-card--featured': featured }">
    <!-- Icon / Ticker badge -->
    <div class="stock-card__icon-area">
      <img
        v-if="stock.iconPath"
        :src="stock.iconPath"
        :alt="stock.companyName + ' Logo'"
        class="stock-card__logo"
      />
      <span v-else class="stock-card__ticker-badge">
        {{ stock.ticker.slice(0, 2) }}
      </span>
    </div>

    <!-- Info -->
    <div class="stock-card__info">
      <span class="stock-card__ticker">{{ stock.ticker }}</span>
      <span class="stock-card__name">{{ stock.companyName }}</span>
    </div>

    <!-- Mag7 badge -->
    <span v-if="stock.isMag7" class="stock-card__mag7-badge">MAG 7</span>
  </div>
</template>

<style scoped>
.stock-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.125rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
  position: relative;
  overflow: hidden;
}

.stock-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  background: radial-gradient(
    600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(96, 165, 250, 0.06),
    transparent 40%
  );
  transition: opacity 0.3s;
}

.stock-card:hover::before {
  opacity: 1;
}

.stock-card:hover {
  border-color: rgba(96, 165, 250, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

/* Featured variant (for Mag7 hero section) */
.stock-card--featured {
  padding: 1.25rem 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(96, 165, 250, 0.06) 0%,
    rgba(59, 130, 246, 0.03) 100%
  );
  border-color: rgba(96, 165, 250, 0.12);
}

.stock-card--featured:hover {
  border-color: rgba(96, 165, 250, 0.3);
  box-shadow: 0 12px 32px rgba(6, 50, 110, 0.35);
}

/* Icon area */
.stock-card__icon-area {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stock-card--featured .stock-card__icon-area {
  width: 48px;
  height: 48px;
}

.stock-card__logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.85;
  transition: opacity 0.2s;
}

.stock-card:hover .stock-card__logo {
  opacity: 1;
}

.stock-card__ticker-badge {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(96, 165, 250, 0.1);
  color: #60a5fa;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.02em;
}

/* Info */
.stock-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
  flex-grow: 1;
}

.stock-card__ticker {
  font-weight: 700;
  font-size: 0.9375rem;
  color: #f1f5f9;
  letter-spacing: 0.03em;
}

.stock-card--featured .stock-card__ticker {
  font-size: 1.0625rem;
}

.stock-card__name {
  font-size: 0.8125rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stock-card--featured .stock-card__name {
  font-size: 0.875rem;
  color: #94a3b8;
}

/* MAG 7 badge */
.stock-card__mag7-badge {
  flex-shrink: 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.2);
}
</style>
