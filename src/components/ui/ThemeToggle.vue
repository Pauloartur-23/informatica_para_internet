<script setup>
import { useTheme } from '../../composables/useTheme.js'
const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    class="toggle"
    :aria-label="isDark ? 'Ativar tema claro' : 'Ativar tema escuro'"
    @click="toggleTheme"
  >
    <span class="toggleTrack" :class="{ dark: isDark }">
      <span class="toggleThumb">
        <Transition name="icon" mode="out-in">
          <span
            v-if="isDark"
            key="sun"
            :size="0.75"
            class="mdi mdi-weather-sunny"
          ></span>

          <span
            v-else
            key="moon"
            :size="0.75"
            class="mdi mdi-weather-night"
          ></span>
        </Transition>
      </span>
    </span>
  </button>
</template>

<style scoped>
.toggle {
  position: relative;
  padding: 2px;
  background: none;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.toggleTrack {
  display: flex;
  align-items: center;
  width: 52px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--color-surface-3);
  border: 1px solid var(--color-border-2);
  padding: 2px;
  transition: all var(--duration-normal) var(--ease-out);
}

.toggleTrack.dark {
  background: var(--color-accent-muted);
  border-color: var(--color-accent);
}

.toggleThumb {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-text-1);
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-normal) var(--ease-spring);
}

.toggleTrack.dark .toggleThumb {
  transform: translateX(24px);
  background: var(--color-accent);
}

.mdi {
  color: var(--color-primary);
}

.mdi-enter-active {
  transition: all 0.2s var(--ease-spring);
}

.mdi-leave-active {
  transition: all 0.15s ease-in;
}

.mdi-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(-90deg);
}

.mdi-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(90deg);
}

.toggle:hover .toggleTrack {
  box-shadow: var(--shadow-glow-sm);
}

.toggle:active .toggleThumb {
  width: 26px;
}

.toggleTrack.dark:active .toggleThumb {
  transform: translateX(20px);
}
</style>