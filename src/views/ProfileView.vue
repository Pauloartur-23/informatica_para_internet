<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const auth = useAuthStore()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <div class="profilePage">
    <div class="profileCard">
      <div class="avatar">
        {{ auth.user?.avatar || 'U' }}
      </div>
      <h1 class="name">{{ auth.user?.nome || 'Usuario' }}</h1>
      <p class="email">{{ auth.user?.email }}</p>
      <button class="logoutBtn" @click="handleLogout">
        <i class="mdi mdi-logout"></i>
        Sair da conta
      </button>
    </div>
  </div>
</template>

<style scoped>
.profilePage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--header-h) - 200px);
  padding: var(--sp-6);
}

.profileCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-5);
  padding: var(--sp-10) var(--sp-12);
  border-radius: var(--radius-xl);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  box-shadow: var(--shadow-md);
  min-width: 320px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background: var(--color-accent);
  color: var(--color-text-on-accent);
  font-size: var(--text-2xl);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.name {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text-1);
}

.email {
  font-size: var(--text-sm);
  color: var(--color-text-4);
  margin-top: calc(-1 * var(--sp-3));
}

.logoutBtn {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-6);
  border-radius: var(--radius-md);
  background: var(--color-surface-3);
  border: 1px solid var(--color-border-2);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-2);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  margin-top: var(--sp-4);
}

.logoutBtn:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: var(--color-danger-muted);
}
</style>
