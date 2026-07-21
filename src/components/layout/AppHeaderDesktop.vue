<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import ThemeToggle from '../ui/ThemeToggle.vue'
import { useAuthStore } from '../../stores/auth.js'
const auth = useAuthStore()
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header" :class="{ scrolled }">
    <div class="headerInner">
      <RouterLink to="/" class="brand">
        <div class="brandMark">
          <span>I</span>
        </div>
        <span class="brandName">Info<span class="brandAccent">Internet</span></span>
      </RouterLink>

      <nav class="navLinks">
        <RouterLink to="/" class="navLink">Início</RouterLink>
      </nav>

      <div class="headerActions">
        <ThemeToggle />
        <RouterLink to="/perfil" class="avatarLink" title="Meu Perfil">
          <div v-if="auth.isLoggedIn" class="avatar">
            {{ auth.user?.avatar || 'U' }}
          </div>
          <div v-else class="avatar avatarGhost">
            <i class="mdi mdi-account-outline"></i>
          </div>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
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
  transition: box-shadow var(--duration-normal) var(--ease-out);
}

.header.scrolled {
  box-shadow: var(--shadow-md);
}

.headerInner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--max-w);
  margin: 0 auto;
  height: 100%;
  padding: 0 var(--sp-6);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  text-decoration: none;
  flex-shrink: 0;
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
  transition: all var(--duration-fast) var(--ease-spring);
  box-shadow: var(--shadow-sm);
}

.brand:hover .brandMark {
  transform: scale(1.08) rotate(-3deg);
  box-shadow: var(--shadow-md);
  border-color: var(--color-navy-accent-hover, var(--color-navy-accent));
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
  letter-spacing: var(--tracking-tight);
}

.brandAccent {
  color: var(--color-text-3);
  font-weight: 500;
}

.navLinks {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
}

.navLink {
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-3);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out);
  position: relative;
}

.navLink::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 16px;
  height: 2px;
  border-radius: var(--radius-full);
  background: var(--color-navy-accent);
  transition: transform var(--duration-fast) var(--ease-spring);
}

.navLink:hover {
  color: var(--color-navy-accent);
  background: var(--color-navy-accent-muted);
}

.navLink:hover::after {
  transform: translateX(-50%) scaleX(1);
}

.navLink.router-link-exact-active {
  color: var(--color-navy-accent);
  background: var(--color-navy-accent-muted);
  font-weight: 600;
}

.navLink.router-link-exact-active::after {
  transform: translateX(-50%) scaleX(1);
}

.headerActions {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-shrink: 0;
}

.avatarLink {
  text-decoration: none;
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
  transition: all var(--duration-fast) var(--ease-spring);
}

.avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 3px var(--color-navy-accent-muted);
}

.avatarGhost {
  background: var(--color-surface-3);
  border: 1px solid var(--color-border-2);
  color: var(--color-text-3);
  font-size: 1.1rem;
  font-weight: 400;
}

.avatarGhost:hover {
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
}

@media (max-width: 900px) {
  .navLinks {
    display: none;
  }
}
</style>
