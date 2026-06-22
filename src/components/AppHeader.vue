<script setup>
defineProps({
  totalCount: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <header class="app-header">
    <div class="app-header__content">
      <div class="app-header__brand">
        <div class="app-header__logo-mark">
          <!-- 7 dots representing the Magnificent Seven -->
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="6" r="3" fill="#60a5fa" opacity="1" />
            <circle cx="8" cy="12" r="2.5" fill="#60a5fa" opacity="0.7" />
            <circle cx="24" cy="12" r="2.5" fill="#60a5fa" opacity="0.7" />
            <circle cx="5" cy="20" r="2" fill="#60a5fa" opacity="0.45" />
            <circle cx="27" cy="20" r="2" fill="#60a5fa" opacity="0.45" />
            <circle cx="10" cy="27" r="1.8" fill="#60a5fa" opacity="0.3" />
            <circle cx="22" cy="27" r="1.8" fill="#60a5fa" opacity="0.3" />
          </svg>
        </div>
        <div class="app-header__titles">
          <h1 class="app-header__title">Magnificent Seven</h1>
          <p class="app-header__subtitle">Stock Dashboard</p>
        </div>
      </div>

      <div class="app-header__meta">
        <span v-if="!loading && totalCount > 0" class="app-header__stock-count">
          {{ totalCount }} Aktien
        </span>
        <span v-if="loading" class="app-header__loading-badge">
          <span class="app-header__spinner"></span>
          Laden…
        </span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.app-header__content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.app-header__logo-mark {
  flex-shrink: 0;
  opacity: 0.9;
}

.app-header__titles {
  display: flex;
  flex-direction: column;
}

.app-header__title {
  font-size: 1.375rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.01em;
}

.app-header__subtitle {
  font-size: 0.8125rem;
  color: #475569;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Meta section */
.app-header__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-header__stock-count {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #64748b;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.app-header__loading-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #60a5fa;
}

.app-header__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(96, 165, 250, 0.2);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .app-header {
    padding: 1rem 1.25rem;
  }

  .app-header__title {
    font-size: 1.125rem;
  }

  .app-header__subtitle {
    font-size: 0.6875rem;
  }
}
</style>
