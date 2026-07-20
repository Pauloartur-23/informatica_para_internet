<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ThemeToggle from '../ui/ThemeToggle.vue'
import { useAuthStore } from '../../stores/auth.js'

const route = useRoute()
const auth = useAuthStore()
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const breadcrumbs = computed(() => {
  const crumbs = [{ label: 'Inicio', to: '/', name: 'home' }]
  if (route.name === 'ano') {
    crumbs.push({ label: `${route.params.id}\u00ba Ano` })
  }
  if (route.name === 'disciplina') {
    crumbs.push({ label: `${route.params.anoId}\u00ba Ano`, to: `/ano/${route.params.anoId}`, name: 'ano' })
    crumbs.push({ label: route.params.disciplinaId })
  }
  if (route.name === 'atividade') {
    crumbs.push({ label: `${route.params.anoId}\u00ba Ano`, to: `/ano/${route.params.anoId}`, name: 'ano' })
    crumbs.push({ label: route.params.disciplinaId, to: `/ano/${route.params.anoId}/disciplina/${route.params.disciplinaId}`, name: 'disciplina' })
    crumbs.push({ label: `Atividade ${route.params.atividadeId}` })
  }
  if (route.name === 'builder') {
    crumbs.push({ label: 'Criar Atividade' })
  }
  return crumbs
})

const showBreadcrumbs = computed(() => !['home', 'login'].includes(route.name))
const isBuilder = computed(() => route.name === 'builder')
</script>

<template>
  <header class="header" :class="{ scrolled }">
    <div class="headerInner">
      <RouterLink to="/" class="brand">
        <div class="brandMark">
          <span>I</span>
        </div>
        <span class="brandName">Informática para Internet</span>
      </RouterLink>

      <nav v-if="showBreadcrumbs" class="breadcrumbs" aria-label="Breadcrumb">
        <template v-for="(crumb, i) in breadcrumbs" :key="i">
          <span v-if="i > 0" class="sep">
            <i class="mdi mdi-chevron-right"></i>
          </span>
          <RouterLink
            v-if="crumb.to"
            :to="crumb.to"
            class="crumb crumbLink"
          >{{ crumb.label }}</RouterLink>
          <span v-else class="crumb crumbCurrent">{{ crumb.label }}</span>
        </template>
      </nav>

      <div v-else class="navSpacer"></div>

      <div class="headerActions">
        <ThemeToggle />

        <template v-if="auth.isLoggedIn && !isBuilder">
          <RouterLink to="/professor/criar-atividade" class="headerLink">
            <i class="mdi mdi-plus"></i>
            Criar Atividade
          </RouterLink>
        </template>

        <template v-if="!auth.isLoggedIn">
          <button class="loginBtn" @click="auth.quickLogin()">
            <i class="mdi mdi-login"></i>
            Entrar
          </button>
        </template>

        <template v-if="auth.isLoggedIn">
          <RouterLink to="/perfil" class="avatar" :title="auth.user?.email">
            {{ auth.user?.avatar || 'U' }}
          </RouterLink>
        </template>
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
  transition: all var(--duration-normal) var(--ease-out);
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

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  min-width: 0;
}

.crumb {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.crumbLink {
  color: var(--color-text-3);
  padding: var(--sp-1) var(--sp-2);
  border-radius: var(--radius-xs);
  transition: all var(--duration-fast) var(--ease-out);
}

.crumbLink:hover {
  color: var(--color-text-1);
  background: var(--color-accent-subtle);
}

.crumbCurrent {
  color: var(--color-text-2);
  font-weight: 600;
}

.sep {
  display: flex;
  align-items: center;
  color: var(--color-text-5);
  flex-shrink: 0;
  font-size: 1.1rem;
}

.navSpacer {
  flex: 1;
}

.headerActions {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-shrink: 0;
}

.headerLink {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-3);
  transition: all var(--duration-fast) var(--ease-out);
}

.headerLink:hover {
  color: var(--color-accent-light);
  background: var(--color-accent-subtle);
}

.loginBtn {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-md);
  background: var(--color-surface-3);
  border: 1px solid var(--color-border-2);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-2);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.loginBtn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent-light);
  background: var(--color-accent-subtle);
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
</style>
