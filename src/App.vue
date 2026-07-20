  <script setup>
  import { RouterView, useRoute } from 'vue-router'
  import { computed } from 'vue'
  import AppHeader from './components/layout/AppHeader.vue'
  import AppFooter from './components/layout/AppFooter.vue'

  const route = useRoute()
  const pageKey = computed(() => route.fullPath)
  const isHome = computed(() => route.name === 'home')
  const isAuth = computed(() => ['login', 'builder'].includes(route.name))
  </script>

  <template>
    <div class="app" :class="{ 'is-home': isHome, 'is-auth': isAuth }">
      <AppHeader />
      <main class="main">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="pageKey" />
          </Transition>
        </RouterView>
      </main>
      <AppFooter v-if="!isHome && !isAuth" />
    </div>
  </template>

  <style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main {
    flex: 1;
  }

  .page-enter-active {
    transition: opacity 0.3s var(--ease-out), transform 0.3s var(--ease-out);
  }

  .page-leave-active {
    transition: opacity 0.2s var(--ease-out), transform 0.2s var(--ease-out);
  }

  .page-enter-from {
    opacity: 0;
    transform: translateY(12px);
  }

  .page-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s var(--ease-out);
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-up-enter-active {
    transition: opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out);
  }

  .slide-up-leave-active {
    transition: opacity 0.25s var(--ease-out), transform 0.25s var(--ease-out);
  }

  .slide-up-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }

  .slide-up-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }

  @keyframes pulse-glow {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }

  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.1s; }
  .stagger-3 { animation-delay: 0.15s; }
  .stagger-4 { animation-delay: 0.2s; }
  .stagger-5 { animation-delay: 0.25s; }
  .stagger-6 { animation-delay: 0.3s; }
  .stagger-7 { animation-delay: 0.35s; }
  .stagger-8 { animation-delay: 0.4s; }
  </style>
