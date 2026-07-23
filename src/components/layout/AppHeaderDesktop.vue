<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import ThemeToggle from '../ui/ThemeToggle.vue'
import { useAuthStore } from '../../stores/auth.js'

const auth = useAuthStore()
const router = useRouter()
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 8
}

function openSearch() {
  router.push({ name: 'search' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="header" :class="{ scrolled }">
    <div class="headerInner">
      <RouterLink to="/" class="brand">
        <div class="brandMark">
          <span>I</span>
        </div>
        <div class="brandText">
          <span class="brandName">Info<span class="brandAccent">Internet</span></span>
          <span class="brandDesc">Atividades do Curso Técnico em Informática</span>
        </div>
      </RouterLink>

      <RouterLink to="/" class="homeBtn">
        <i class="mdi mdi-home"></i>
        <span>Home</span>
      </RouterLink>

      <div class="headerActions">
        <RouterLink to="/criar-atividade" class="createBtn">
          <i class="mdi mdi-plus-circle-outline"></i>
          <span>Criar</span>
        </RouterLink>

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
            <span class="loginLabel">Logar</span>
          </template>
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
  flex: 1;
  justify-content: flex-start;
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

.brandText {
  display: flex;
  flex-direction: column;
}

.brandName {
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-text-1);
  letter-spacing: var(--tracking-tight);
  line-height: 1.2;
}

.brandAccent {
  color: var(--color-text-3);
  font-weight: 500;
}

.brandDesc {
  font-size: var(--text-xs);
  color: var(--color-text-5);
  line-height: 1.2;
}

.headerActions {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex: 1;
  justify-content: flex-end;
}

.createBtn {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-navy-accent);
  background: var(--color-navy-accent-muted);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out);
}

.createBtn:hover {
  background: var(--color-navy-accent);
  color: #ffffff;
  box-shadow: var(--shadow-glow-sm);
  transform: translateY(-1px);
}

.homeBtn {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-3);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out);
}

.homeBtn:hover {
  color: var(--color-navy-accent);
  background: var(--color-navy-accent-muted);
}

.homeBtn.router-link-exact-active {
  color: var(--color-navy-accent);
  background: var(--color-navy-accent-muted);
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
  font-size: 1.15rem;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.searchBtn:hover {
  background: var(--color-navy-accent-muted);
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
  box-shadow: var(--shadow-glow-sm);
}

.userBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  border-radius: var(--radius-full);
  background: var(--color-surface-3);
  border: 1px solid var(--color-border-2);
  color: var(--color-text-3);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-spring);
  overflow: hidden;
}

.userBtn:not(.loggedIn) {
  padding: 0 var(--sp-4);
  gap: var(--sp-2);
  font-size: var(--text-sm);
  font-weight: 600;
}

.userBtn:not(.loggedIn):hover {
  background: var(--color-navy);
  border-color: var(--color-navy);
  color: #ffffff;
  box-shadow: var(--shadow-glow-sm);
  transform: translateY(-1px);
}

.userBtn.loggedIn {
  width: 38px;
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

.loginLabel {
  white-space: nowrap;
}
</style>
