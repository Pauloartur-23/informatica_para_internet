<script setup>
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'

const route = useRoute()
const pageKey = computed(() => route.fullPath)
const isHome = computed(() => route.name === 'home')
</script>

<template>
  <div class="app" :class="{ 'is-home': isHome }">
    <AppHeader />
    <main class="main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="pageKey" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
}

.main {
  flex: 1;
  min-height: calc(100vh - var(--header-h));
}

/* Page transitions */
.page-enter-active {
  transition:
    opacity 0.4s var(--ease-out),
    transform 0.4s var(--ease-out),
    filter 0.4s var(--ease-out);
}

.page-leave-active {
  transition:
    opacity 0.2s var(--ease-out),
    transform 0.2s var(--ease-out),
    filter 0.2s var(--ease-out);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(16px);
  filter: blur(4px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  filter: blur(2px);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s var(--ease-out) both;
}

.animate-fade-in {
  animation: fadeIn 0.5s var(--ease-out) both;
}

.animate-scale-in {
  animation: scaleIn 0.5s var(--ease-out) both;
}

.animate-slide-in-left {
  animation: slideInLeft 0.5s var(--ease-out) both;
}

.animate-slide-in-right {
  animation: slideInRight 0.5s var(--ease-out) both;
}

.delay-1 {
  animation-delay: 0.1s;
}

.delay-2 {
  animation-delay: 0.2s;
}

.delay-3 {
  animation-delay: 0.3s;
}

.delay-4 {
  animation-delay: 0.4s;
}

.delay-5 {
  animation-delay: 0.5s;
}
</style>
