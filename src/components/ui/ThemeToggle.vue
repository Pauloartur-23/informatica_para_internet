<script setup>
import { useTheme } from '../../composables/useTheme.js'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    class="themeBtn"
    :aria-label="isDark ? 'Ativar tema claro' : 'Ativar tema escuro'"
    @click="toggleTheme"
  >
    <Transition name="icon" mode="out-in">
      <i v-if="isDark" key="sun" class="mdi mdi-weather-sunny"></i>
      <i v-else key="moon" class="mdi mdi-weather-night"></i>
    </Transition>
  </button>
</template>

<style scoped>
.themeBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--color-surface-3);
  border: 1px solid var(--color-border-2);
  color: var(--color-text-2);
  font-size: 1.15rem;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  flex-shrink: 0;
}

.themeBtn:hover {
  background: var(--color-navy-accent-muted);
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
  box-shadow: var(--shadow-glow-sm);
}

.icon-enter-active {
  transition: all 0.2s var(--ease-spring);
}

.icon-leave-active {
  transition: all 0.15s ease-in;
}

.icon-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(-90deg);
}

.icon-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(90deg);
}
</style>
