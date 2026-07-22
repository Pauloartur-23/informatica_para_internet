<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import ThemeToggle from '../ui/ThemeToggle.vue'
import SidebarDrawer from './SidebarDrawer.vue'
import { useAuthStore } from '../../stores/auth.js'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const drawerOpen = ref(false)

function close() {
  drawerOpen.value = false
}

function openSearch() {
  router.push({ name: 'search' })
}

watch(
  () => route.fullPath,
  () => {
    close()
  },
)

watch(drawerOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
  <header class="mobileHeader">
    <div class="mobileHeaderInner">
      <button class="menuBtn" aria-label="Abrir menu" @click="drawerOpen = true">
        <i class="mdi mdi-menu"></i>
      </button>

      <RouterLink to="/" class="brand">
        <div class="brandMark">
          <span>I</span>
        </div>
        <span class="brandName">Info<span class="brandAccent">Internet</span></span>
      </RouterLink>

      <div class="mobileActions">
        <button class="searchBtn" aria-label="Buscar" @click="openSearch">
          <i class="mdi mdi-magnify"></i>
        </button>
        <ThemeToggle />
        <RouterLink
          to="/perfil"
          class="userBtn"
          :class="{ loggedIn: auth.isLoggedIn }"
        >
          <template v-if="auth.isLoggedIn">
            <span class="userAvatar">{{ auth.user?.avatar || 'U' }}</span>
          </template>
          <template v-else>
            <i class="mdi mdi-login"></i>
          </template>
        </RouterLink>
      </div>
    </div>
  </header>

  <SidebarDrawer :open="drawerOpen" @close="close" />
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

.menuBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  color: var(--color-text-1);
  font-size: 1.4rem;
  transition: all var(--duration-fast) var(--ease-spring);
  flex-shrink: 0;
}

.menuBtn:hover {
  background: var(--color-accent-subtle);
  transform: scale(1.08);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  text-decoration: none;
  flex: 1;
  justify-content: center;
}

.brandMark {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-xs);
  background: var(--color-navy-accent);
  border: 1px solid var(--color-border-2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-xs);
  transition: all var(--duration-fast) var(--ease-spring);
}

.brand:hover .brandMark {
  transform: scale(1.08) rotate(-2deg);
  box-shadow: var(--shadow-sm);
}

.brandMark span {
  font-size: 0.85rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.brandName {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text-1);
  letter-spacing: var(--tracking-tight);
}

.brandAccent {
  color: var(--color-text-3);
  font-weight: 500;
}

.mobileActions {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-shrink: 0;
}

.searchBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-full);
  background: var(--color-surface-3);
  border: 1px solid var(--color-border-2);
  color: var(--color-text-3);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  flex-shrink: 0;
}

.searchBtn:hover {
  background: var(--color-navy-accent-muted);
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
}

.userBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-full);
  background: var(--color-surface-3);
  border: 1px solid var(--color-border-2);
  color: var(--color-text-3);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-spring);
  flex-shrink: 0;
}

.userBtn:not(.loggedIn) {
  font-size: 1.1rem;
}

.userBtn:not(.loggedIn):hover {
  background: var(--color-navy);
  border-color: var(--color-navy);
  color: #ffffff;
}

.userBtn.loggedIn:hover {
  transform: scale(1.08);
  box-shadow: 0 0 0 3px var(--color-navy-accent-muted);
}

.userAvatar {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-navy-accent) 0%, var(--color-navy-lighter) 100%);
  color: #ffffff;
  font-size: var(--text-sm);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
