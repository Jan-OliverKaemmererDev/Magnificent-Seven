<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  resultCount: {
    type: Number,
    default: 0,
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="search-bar">
    <div class="search-bar__input-wrapper">
      <svg
        class="search-bar__icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        width="18"
        height="18"
      >
        <path
          fill-rule="evenodd"
          d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
          clip-rule="evenodd"
        />
      </svg>

      <label for="stock-search" class="sr-only">Aktie suchen</label>
      <input
        id="stock-search"
        type="text"
        class="search-bar__input"
        placeholder="Aktie suchen… (z. B. AAPL, Tesla)"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />

      <button
        v-if="modelValue"
        class="search-bar__clear"
        aria-label="Suche leeren"
        @click="$emit('update:modelValue', '')"
      >
        ✕
      </button>
    </div>

    <span v-if="modelValue" class="search-bar__count" aria-live="polite">
      {{ resultCount }} {{ resultCount === 1 ? 'Ergebnis' : 'Ergebnisse' }}
    </span>
  </div>
</template>

<style scoped>
/* ======================================================
   Container
   ====================================================== */
.search-bar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 480px;
}

/* ======================================================
   Input Wrapper
   ====================================================== */
.search-bar__input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-bar__input-wrapper:focus-within {
  border-color: rgba(96, 165, 250, 0.4);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.08);
}

.search-bar__icon {
  flex-shrink: 0;
  color: #64748b;
}

/* ======================================================
   Input Field
   ====================================================== */
.search-bar__input {
  flex-grow: 1;
  background: none;
  border: none;
  outline: none;
  color: #f1f5f9;
  font-family: inherit;
  font-size: 0.9375rem;
  font-weight: 400;
}

.search-bar__input::placeholder {
  color: #475569;
}

/* ======================================================
   Clear Button
   ====================================================== */
.search-bar__clear {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 0.8125rem;
  padding: 0.2rem 0.35rem;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}

.search-bar__clear:hover {
  color: #f1f5f9;
  background: rgba(255, 255, 255, 0.08);
}

.search-bar__clear:focus-visible {
  outline: 2px solid #60a5fa;
  outline-offset: 2px;
}

/* ======================================================
   Result Count
   ====================================================== */
.search-bar__count {
  font-size: 0.8125rem;
  color: #64748b;
  padding-left: 0.25rem;
}
</style>
