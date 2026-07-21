<script setup>
import { RouterLink, useRoute } from 'vue-router'
import ThemeToggle from '../ui/ThemeToggle.vue'
import { useAuthStore } from '../../stores/auth.js'

defineProps({
  open: Boolean,
})

const emit = defineEmits(['close'])
const route = useRoute()
const auth = useAuthStore()

function isActive(path) {
  return route.path === path
}
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="open" class="sidebarOverlay" @click="emit('close')"></div>
    </Transition>

    <Transition name="drawer">
      <aside v-if="open" class="sidebar">
        <div class="sidebarHeader">
          <RouterLink to="/" class="brand" @click="emit('close')">
            <div class="brandMark">
              <span>I</span>
            </div>
            <span class="brandName">Info<span class="brandAccent">Internet</span></span>
          </RouterLink>

          <button class="closeBtn" aria-label="Fechar menu" @click="emit('close')">
            <i class="mdi mdi-close"></i>
          </button>
        </div>

        <nav class="sidebarNav">
          <RouterLink
            to="/"
            class="sidebarLink"
            :class="{ active: isActive('/') }"
            @click="emit('close')"
          >
            <i class="mdi mdi-home-outline"></i>
            Início
          </RouterLink>

          <RouterLink
            to="/perfil"
            class="sidebarLink"
            :class="{ active: isActive('/perfil') }"
            @click="emit('close')"
          >
            <i class="mdi mdi-account-outline"></i>
            Meu Perfil
          </RouterLink>
        </nav>

        <div class="sidebarFooter">
          <div class="sidebarFooterRow">
            <ThemeToggle />
            <RouterLink
              to="/perfil"
              class="avatar"
              :title="auth.isLoggedIn ? auth.user?.email : 'Entrar'"
              @click="emit('close')"
            >
              <template v-if="auth.isLoggedIn">{{ auth.user?.avatar || 'U' }}</template>
              <template v-else><i class="mdi mdi-account-outline"></i></template>
            </RouterLink>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sidebarOverlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: var(--color-overlay);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 201;
  width: 300px;
  max-width: 85vw;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border-2);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
}

.sidebarHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-5);
  border-bottom: 1px solid var(--color-border-1);
  flex-shrink: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  text-decoration: none;
}

.brandMark {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--color-navy-accent);
  border: 1px solid var(--color-border-2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-fast) var(--ease-spring);
}

.brand:hover .brandMark {
  transform: scale(1.06) rotate(-2deg);
  box-shadow: var(--shadow-md);
}

.brandMark span {
  font-size: 1rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.brandName {
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-text-1);
}

.brandAccent {
  color: var(--color-text-3);
  font-weight: 500;
}

.closeBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  color: var(--color-text-3);
  font-size: 1.3rem;
  transition: all var(--duration-fast) var(--ease-spring);
}

.closeBtn:hover {
  background: var(--color-accent-subtle);
  color: var(--color-text-1);
  transform: rotate(90deg);
}

.sidebarNav {
  flex: 1;
  padding: var(--sp-3);
  overflow-y: auto;
}

.sidebarLink {
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
  position: relative;
  overflow: hidden;
}

.sidebarLink::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) scaleY(0);
  width: 3px;
  height: 60%;
  border-radius: 0 var(--radius-full) var(--radius-full) 0;
  background: var(--color-navy-accent);
  transition: transform var(--duration-fast) var(--ease-spring);
}

.sidebarLink:hover {
  background: var(--color-navy-accent-muted);
  color: var(--color-navy-accent);
  padding-left: var(--sp-5);
}

.sidebarLink:hover::before {
  transform: translateY(-50%) scaleY(1);
}

.sidebarLink.active {
  background: var(--color-navy-accent-muted);
  color: var(--color-navy-accent);
  font-weight: 600;
}

.sidebarLink.active::before {
  transform: translateY(-50%) scaleY(1);
}

.sidebarLink i {
  flex-shrink: 0;
  font-size: 1.2rem;
  color: var(--color-text-4);
}

.sidebarLink:hover i,
.sidebarLink.active i {
  color: var(--color-navy-accent);
}

.sidebarFooter {
  padding: var(--sp-4) var(--sp-5);
  border-top: 1px solid var(--color-border-1);
  flex-shrink: 0;
}

.sidebarFooterRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  background: var(--color-navy-accent);
  border: 1.5px solid var(--color-border-2);
  color: #ffffff;
  font-size: var(--text-sm);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-spring);
}

.avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 3px var(--color-navy-accent-muted);
}

/* Transitions */
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

.drawer-enter-active {
  transition: transform 0.3s var(--ease-out);
}

.drawer-leave-active {
  transition: transform 0.2s var(--ease-out);
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}
</style>
