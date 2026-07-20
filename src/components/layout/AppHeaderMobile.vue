<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ThemeToggle from '../ui/ThemeToggle.vue'
import { useAuthStore } from '../../stores/auth.js'

const route = useRoute()
const auth = useAuthStore()
const mobileMenuOpen = ref(false)
const isBuilder = ref(false)

function onScroll() {
  isBuilder.value = route.name === 'builder'
}

watch(mobileMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

watch(() => route.fullPath, () => {
  closeMobile()
  isBuilder.value = route.name === 'builder'
})

function closeMobile() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="mobileHeader">
    <div class="mobileHeaderInner">
      <RouterLink to="/" class="brand" @click="closeMobile">
        <div class="brandMark">
          <span>I</span>
        </div>
        <span class="brandName">Informática para Internet</span>
      </RouterLink>

      <button
        class="menuBtn"
        @click="mobileMenuOpen = !mobileMenuOpen"
        :aria-label="mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'"
        :aria-expanded="mobileMenuOpen"
      >
        <i class="mdi" :class="mobileMenuOpen ? 'mdi-close' : 'mdi-menu'"></i>
      </button>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="mobileMenuOpen" class="mobileOverlay" @click="closeMobile"></div>
    </Transition>
    <Transition name="drawer">
      <div v-if="mobileMenuOpen" class="mobileDrawer">
        <div class="drawerHeader">
          <RouterLink to="/" class="brand" @click="closeMobile">
            <div class="brandMark">
              <span>I</span>
            </div>
            <span class="brandName">Informática para Internet</span>
          </RouterLink>
        </div>

        <nav class="drawerNav">
          <RouterLink to="/" class="drawerLink" @click="closeMobile">
            <i class="mdi mdi-home"></i>
            Inicio
          </RouterLink>

          <RouterLink
            v-if="auth.isLoggedIn && !isBuilder"
            to="/professor/criar-atividade"
            class="drawerLink"
            @click="closeMobile"
          >
            <i class="mdi mdi-plus"></i>
            Criar Atividade
          </RouterLink>

          <button v-if="!auth.isLoggedIn" class="drawerLink" @click="auth.quickLogin(); closeMobile()">
            <i class="mdi mdi-login"></i>
            Entrar
          </button>
        </nav>

        <div class="drawerFooter">
          <div class="drawerFooterRow">
            <ThemeToggle />
            <template v-if="auth.isLoggedIn">
              <RouterLink to="/perfil" class="avatar" :title="auth.user?.email" @click="closeMobile">
                {{ auth.user?.avatar || 'U' }}
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mobileHeader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--header-h);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border-bottom: 1px solid var(--glass-border);
}

.mobileHeaderInner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 var(--sp-4);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  text-decoration: none;
  flex-shrink: 0;
}

.brandMark {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  background: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--duration-fast) var(--ease-spring);
}

.brand:hover .brandMark {
  transform: scale(1.08) rotate(-3deg);
}

.brandMark span {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--color-text-on-accent);
  line-height: 1;
}

.brandName {
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-text-1);
  letter-spacing: var(--tracking-tight);
}

.menuBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-1);
  font-size: 1.5rem;
  transition: background var(--duration-fast);
}

.menuBtn:hover {
  background: var(--color-accent-subtle);
}

/* Mobile Overlay */
.mobileOverlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: var(--color-overlay);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Mobile Drawer */
.mobileDrawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 201;
  width: 280px;
  max-width: 85vw;
  background: var(--color-surface);
  border-left: 1px solid var(--color-border-2);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.drawerHeader {
  padding: var(--sp-5) var(--sp-5);
  border-bottom: 1px solid var(--color-border-1);
  flex-shrink: 0;
}

.drawerNav {
  flex: 1;
  padding: var(--sp-3);
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.drawerLink {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--color-text-2);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out);
}

.drawerLink:hover {
  background: var(--color-accent-subtle);
  color: var(--color-text-1);
}

.drawerLink.router-link-exact-active {
  background: var(--color-accent-subtle);
  color: var(--color-text-1);
  font-weight: 600;
}

.drawerLink i {
  flex-shrink: 0;
  font-size: 1.25rem;
  color: var(--color-text-4);
}

.drawerLink:hover i {
  color: var(--color-text-2);
}

.drawerFooter {
  padding: var(--sp-4) var(--sp-5);
  border-top: 1px solid var(--color-border-1);
  flex-shrink: 0;
}

.drawerFooterRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  background: var(--color-accent);
  color: var(--color-text-on-accent);
  font-size: var(--text-sm);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-spring);
}

.avatar:hover {
  transform: scale(1.08);
}

/* Overlay transitions */
.overlay-enter-active {
  transition: opacity 0.25s var(--ease-out);
}
.overlay-leave-active {
  transition: opacity 0.2s var(--ease-out);
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Drawer transitions */
.drawer-enter-active {
  transition: transform 0.3s var(--ease-out);
}
.drawer-leave-active {
  transition: transform 0.2s var(--ease-out);
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}
</style>
