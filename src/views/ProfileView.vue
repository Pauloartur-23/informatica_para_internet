<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loginError = ref('')
const isLoading = ref(false)
const showForm = ref(false)

const initials = computed(() => {
  if (!auth.user?.nome) return 'U'
  return auth.user.nome.charAt(0).toUpperCase()
})

watch(
  () => auth.isLoggedIn,
  (val) => {
    showForm.value = !val
  },
  { immediate: true },
)

function handleLogin() {
  loginError.value = ''
  isLoading.value = true
  setTimeout(() => {
    const ok = auth.login(email.value, password.value)
    isLoading.value = false
    if (!ok) {
      loginError.value = 'E-mail ou senha inválidos.'
    }
  }, 600)
}

function handleLogout() {
  isLoading.value = true
  setTimeout(() => {
    auth.logout()
    isLoading.value = false
  }, 400)
}

function handleQuickLogin() {
  isLoading.value = true
  setTimeout(() => {
    auth.quickLogin()
    isLoading.value = false
  }, 500)
}
</script>

<template>
  <div class="profilePage">
    <div class="profileGlow"></div>
    <div class="profileGlow profileGlow2"></div>

    <Transition name="card-switch" mode="out-in">
      <div v-if="auth.isLoggedIn" key="logged" class="profileCard">
        <div class="cardShine"></div>

        <div class="avatarSection">
          <div class="avatarRing">
            <div class="avatar">
              {{ initials }}
            </div>
          </div>
          <div class="statusDot"></div>
        </div>

        <div class="profileInfo">
          <h1 class="name">{{ auth.user?.nome || 'Usuário' }}</h1>
          <p class="email">{{ auth.user?.email }}</p>
          <span class="badge">
            <i class="mdi mdi-shield-check-outline"></i>
            Conectado
          </span>
        </div>

        <div class="divider"></div>

        <div class="profileDetails">
          <div class="detailRow">
            <div class="detailIcon">
              <i class="mdi mdi-school-outline"></i>
            </div>
            <div class="detailContent">
              <span class="detailLabel">Curso</span>
              <span class="detailValue">Técnico em Informática</span>
            </div>
          </div>
          <div class="detailRow">
            <div class="detailIcon">
              <i class="mdi mdi-map-marker-outline"></i>
            </div>
            <div class="detailContent">
              <span class="detailLabel">Campus</span>
              <span class="detailValue">IFC Campus Araquari</span>
            </div>
          </div>
          <div class="detailRow">
            <div class="detailIcon">
              <i class="mdi mdi-calendar-outline"></i>
            </div>
            <div class="detailContent">
              <span class="detailLabel">Membro desde</span>
              <span class="detailValue">{{ new Date().getFullYear() }}</span>
            </div>
          </div>
        </div>

        <button class="logoutBtn" :class="{ loading: isLoading }" @click="handleLogout" :disabled="isLoading">
          <Transition name="btn-icon" mode="out-in">
            <i v-if="isLoading" key="loading" class="mdi mdi-loading mdi-spin"></i>
            <i v-else key="idle" class="mdi mdi-logout"></i>
          </Transition>
          {{ isLoading ? 'Saindo...' : 'Sair da conta' }}
        </button>
      </div>

      <div v-else key="login" class="profileCard">
        <div class="cardShine"></div>

        <div class="loginIconWrap">
          <div class="loginIconRing">
            <i class="mdi mdi-account-outline loginIcon"></i>
          </div>
        </div>

        <div class="profileInfo">
          <h1 class="name">Bem-vindo de volta</h1>
          <p class="email">Acesse sua conta para continuar.</p>
        </div>

        <form class="loginForm" @submit.prevent="handleLogin">
          <div class="field" :class="{ focused: false }">
            <label for="email">
              <i class="mdi mdi-email-outline"></i>
              E-mail
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div class="field">
            <label for="password">
              <i class="mdi mdi-lock-outline"></i>
              Senha
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Sua senha"
              required
            />
          </div>

          <Transition name="error-slide">
            <p v-if="loginError" class="error">
              <i class="mdi mdi-alert-circle-outline"></i>
              {{ loginError }}
            </p>
          </Transition>

          <button
            type="submit"
            class="loginBtn"
            :class="{ loading: isLoading }"
            :disabled="isLoading"
          >
            <Transition name="btn-icon" mode="out-in">
              <i v-if="isLoading" key="loading" class="mdi mdi-loading mdi-spin"></i>
              <i v-else key="idle" class="mdi mdi-login"></i>
            </Transition>
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="divider">
          <span>ou</span>
        </div>

        <button class="quickBtn" @click="handleQuickLogin" :disabled="isLoading">
          <i class="mdi mdi-flash-outline"></i>
          Entrar rápido (Demo)
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.profilePage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--header-h) - 200px);
  padding: var(--sp-6);
  position: relative;
  overflow: hidden;
}

.profileGlow {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--color-navy-accent-muted) 0%, transparent 70%);
  top: 10%;
  left: 20%;
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
}

.profileGlow2 {
  top: auto;
  bottom: 10%;
  left: auto;
  right: 20%;
  animation-delay: -4s;
  animation-duration: 10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 15px) scale(0.95); }
}

.profileCard {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-6);
  padding: var(--sp-12);
  border-radius: var(--radius-2xl);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  box-shadow: var(--shadow-lg);
  min-width: 380px;
  max-width: 440px;
  width: 100%;
  z-index: 1;
  animation: cardAppear 0.6s var(--ease-out) both;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.cardShine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  background: linear-gradient(135deg, var(--color-navy-accent-muted) 0%, transparent 60%);
  pointer-events: none;
  opacity: 0.5;
}

/* Avatar */
.avatarSection {
  position: relative;
}

.avatarRing {
  padding: 3px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-navy-accent) 0%, var(--color-navy-lighter) 100%);
  animation: ringPulse 3s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--color-navy-accent-muted); }
  50% { box-shadow: 0 0 0 8px transparent; }
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background: var(--color-navy);
  color: #ffffff;
  font-size: var(--text-3xl);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.statusDot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  border-radius: var(--radius-full);
  background: var(--color-success);
  border: 3px solid var(--color-surface-2);
  animation: statusBounce 2s ease-in-out infinite;
}

@keyframes statusBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

/* Login icon */
.loginIconWrap {
  margin-bottom: var(--sp-2);
}

.loginIconRing {
  width: 88px;
  height: 88px;
  border-radius: var(--radius-full);
  background: var(--color-navy-accent-muted);
  border: 2px dashed var(--color-border-2);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: iconSpin 20s linear infinite;
}

@keyframes iconSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loginIcon {
  font-size: 2.5rem;
  color: var(--color-navy-accent);
  animation: iconSpin 20s linear infinite reverse;
}

/* Profile info */
.profileInfo {
  text-align: center;
  position: relative;
  z-index: 1;
}

.name {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text-1);
  margin-bottom: var(--sp-1);
}

.email {
  font-size: var(--text-sm);
  color: var(--color-text-4);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  margin-top: var(--sp-3);
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--radius-full);
  background: var(--color-success-muted);
  color: var(--color-success);
  font-size: var(--text-xs);
  font-weight: 600;
}

/* Divider */
.divider {
  width: 100%;
  height: 1px;
  background: var(--color-border-1);
  position: relative;
}

.divider span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0 var(--sp-3);
  background: var(--color-surface-2);
  font-size: var(--text-xs);
  color: var(--color-text-5);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
}

/* Profile details */
.profileDetails {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  width: 100%;
}

.detailRow {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
  background: var(--color-surface-3);
  transition: all var(--duration-fast) var(--ease-out);
}

.detailRow:hover {
  background: var(--color-surface-4);
  transform: translateX(4px);
}

.detailIcon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--color-navy-accent-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detailIcon i {
  font-size: 1.1rem;
  color: var(--color-navy-accent);
}

.detailContent {
  display: flex;
  flex-direction: column;
}

.detailLabel {
  font-size: var(--text-xs);
  color: var(--color-text-5);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
}

.detailValue {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-2);
}

/* Logout button */
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
  width: 100%;
  justify-content: center;
  margin-top: var(--sp-2);
}

.logoutBtn:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: var(--color-danger-muted);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--color-danger-muted);
}

.logoutBtn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Login form */
.loginForm {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  width: 100%;
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.field label {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field label i {
  font-size: 0.9rem;
  color: var(--color-navy-accent);
}

.field input {
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-2);
  background: var(--color-surface-3);
  font-size: var(--text-sm);
  color: var(--color-text-1);
  outline: none;
  transition: all var(--duration-fast) var(--ease-out);
}

.field input::placeholder {
  color: var(--color-text-5);
}

.field input:focus {
  border-color: var(--color-navy-accent);
  box-shadow: 0 0 0 3px var(--color-navy-accent-muted);
  transform: translateY(-1px);
}

.error {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--text-sm);
  color: var(--color-danger);
  text-align: center;
  justify-content: center;
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-md);
  background: var(--color-danger-muted);
}

.loginBtn {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-6);
  border-radius: var(--radius-md);
  background: var(--color-navy);
  border: none;
  font-size: var(--text-sm);
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  width: 100%;
  justify-content: center;
}

.loginBtn:hover {
  background: var(--color-navy-light);
  box-shadow: var(--shadow-glow-sm);
  transform: translateY(-1px);
}

.loginBtn:active {
  transform: translateY(0);
}

.loginBtn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.quickBtn {
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
  width: 100%;
  justify-content: center;
}

.quickBtn:hover {
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
  background: var(--color-navy-accent-muted);
  transform: translateY(-1px);
}

.quickBtn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Card switch transition */
.card-switch-enter-active {
  transition: all 0.5s var(--ease-out);
}

.card-switch-leave-active {
  transition: all 0.3s var(--ease-out);
}

.card-switch-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.card-switch-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* Error slide */
.error-slide-enter-active {
  transition: all 0.3s var(--ease-spring);
}

.error-slide-leave-active {
  transition: all 0.2s var(--ease-out);
}

.error-slide-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Button icon transition */
.btn-icon-enter-active {
  transition: all 0.2s var(--ease-spring);
}

.btn-icon-leave-active {
  transition: all 0.1s ease-in;
}

.btn-icon-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.btn-icon-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

@media (max-width: 480px) {
  .profileCard {
    min-width: 0;
    padding: var(--sp-8) var(--sp-6);
  }

  .profileGlow {
    display: none;
  }
}
</style>
