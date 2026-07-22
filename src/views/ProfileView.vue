<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { anos, getAtividades } from '../data/disciplinas.js'

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

const allAtividades = computed(() => {
  const list = []
  for (const [anoId, ano] of Object.entries(anos)) {
    for (const disc of ano.disciplinas) {
      const lista = getAtividades(disc.id)
      for (const ativ of lista) {
        list.push({
          anoId: Number(anoId),
          anoLabel: ano.label,
          disciplina: disc,
          atividade: ativ,
        })
      }
    }
  }
  return list
})

const stats = computed(() => {
  let totalDisc = 0
  let totalAtiv = 0
  let totalQuest = 0
  for (const [, ano] of Object.entries(anos)) {
    totalDisc += ano.disciplinas.length
    for (const disc of ano.disciplinas) {
      const lista = getAtividades(disc.id)
      totalAtiv += lista.length
      for (const ativ of lista) {
        totalQuest += ativ.questoes.length
      }
    }
  }
  return { disciplinas: totalDisc, atividades: totalAtiv, questoes: totalQuest }
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
    <div class="pageDeco">
      <div class="pageDecoOrb pageDecoOrb1"></div>
      <div class="pageDecoOrb pageDecoOrb2"></div>
      <div class="pageDecoOrb pageDecoOrb3"></div>
      <div class="pageDecoDots"></div>
      <div class="pageDecoGrid"></div>
    </div>

    <Transition name="card-switch" mode="out-in">
      <div v-if="auth.isLoggedIn" key="logged" class="adminView">
        <div class="adminHeader">
          <div class="adminHeaderLeft">
            <div class="adminUserInfo">
              <div class="avatarRing">
                <div class="avatar">{{ initials }}</div>
              </div>
              <div class="adminUserText">
                <h1 class="adminTitle">
                  <i class="mdi mdi-shield-crown-outline"></i>
                  Painel Administrativo
                </h1>
                <p class="adminUserName">{{ auth.user?.nome || 'Usuário' }}</p>
                <p class="adminUserEmail">{{ auth.user?.email }}</p>
              </div>
            </div>
            <p class="adminSubtitle">Gerencie atividades e conteúdos da plataforma.</p>
          </div>
          <button class="logoutBtn" @click="handleLogout">
            <i class="mdi mdi-logout"></i>
            Sair
          </button>
        </div>

        <div class="statsGrid">
          <div class="statCard animate-fade-in-up delay-1">
            <div class="statIcon"><i class="mdi mdi-bookshelf"></i></div>
            <div class="statInfo">
              <span class="statValue">{{ stats.disciplinas }}</span>
              <span class="statLabel">Disciplinas</span>
            </div>
          </div>
          <div class="statCard animate-fade-in-up delay-2">
            <div class="statIcon"><i class="mdi mdi-file-document-multiple"></i></div>
            <div class="statInfo">
              <span class="statValue">{{ stats.atividades }}</span>
              <span class="statLabel">Atividades</span>
            </div>
          </div>
          <div class="statCard animate-fade-in-up delay-3">
            <div class="statIcon"><i class="mdi mdi-help-rhombus"></i></div>
            <div class="statInfo">
              <span class="statValue">{{ stats.questoes }}</span>
              <span class="statLabel">Questões</span>
            </div>
          </div>
        </div>

        <div class="adminSection">
          <h2 class="sectionTitle">Todas as Atividades</h2>
          <div class="atividadesAdminList">
            <div
              v-for="(item, idx) in allAtividades"
              :key="`${item.disciplina.id}-${item.atividade.id}`"
              class="adminAtivCard animate-fade-in-up"
              :class="`delay-${Math.min(idx + 1, 5)}`"
            >
              <div class="adminAtivHeader">
                <div class="adminAtivMeta">
                  <span class="adminAtivAno">{{ item.anoLabel }}</span>
                  <i class="mdi mdi-chevron-right"></i>
                  <span class="adminAtivDisc">{{ item.disciplina.name }}</span>
                </div>
                <div class="adminAtivActions">
                  <button class="actionBtn editBtn" title="Editar">
                    <i class="mdi mdi-pencil-outline"></i>
                  </button>
                  <button class="actionBtn deleteBtn" title="Remover">
                    <i class="mdi mdi-delete-outline"></i>
                  </button>
                </div>
              </div>
              <h3 class="adminAtivTitle">{{ item.atividade.title }}</h3>
              <p class="adminAtivDesc">{{ item.atividade.desc }}</p>
              <span class="adminAtivQuestoes">
                <i class="mdi mdi-help-circle-outline"></i>
                {{ item.atividade.questoes.length }} questão{{ item.atividade.questoes.length > 1 ? 's' : '' }}
              </span>
            </div>
          </div>
        </div>

        <div class="adminSection">
          <h2 class="sectionTitle">Adicionar Nova Atividade</h2>
          <div class="addAtivCard">
            <div class="addAtivIcon">
              <i class="mdi mdi-plus-circle-outline"></i>
            </div>
            <p class="addAtivText">Funcionalidade em desenvolvimento</p>
            <p class="addAtivSubtext">Em breve será possível adicionar novas atividades.</p>
          </div>
        </div>
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
          <div class="field">
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
  position: relative;
  min-height: calc(100vh - var(--header-h));
}

/* =============================================
   Login Card
   ============================================= */
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
  margin: var(--sp-16) auto;
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
  transition: all var(--duration-normal) var(--ease-spring);
}

.loginIconRing:hover {
  transform: scale(1.05);
  border-color: var(--color-navy-accent);
  box-shadow: 0 0 24px rgba(74, 111, 165, 0.15);
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
  transition: all var(--duration-normal) var(--ease-spring);
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
  transition: all var(--duration-normal) var(--ease-spring);
  width: 100%;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.loginBtn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: left 0.5s var(--ease-out);
}

.loginBtn:hover {
  background: var(--color-navy-light);
  box-shadow: 0 4px 20px rgba(74, 111, 165, 0.3);
  transform: translateY(-1px);
}

.loginBtn:hover::before {
  left: 100%;
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
  transition: all var(--duration-normal) var(--ease-spring);
  width: 100%;
  justify-content: center;
}

.quickBtn:hover {
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
  background: var(--color-navy-accent-muted);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(74, 111, 165, 0.1);
}

.quickBtn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* =============================================
   Admin Panel
   ============================================= */
.adminView {
  position: relative;
  z-index: 1;
  max-width: var(--max-w);
  margin: 0 auto;
  padding: var(--sp-8) var(--sp-6);
}

.adminHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-4);
  margin-bottom: var(--sp-8);
}

.adminHeaderLeft {
  flex: 1;
}

.adminUserInfo {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  margin-bottom: var(--sp-2);
}

.avatarRing {
  padding: 3px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-navy-accent) 0%, var(--color-navy-lighter) 100%);
  flex-shrink: 0;
  transition: all var(--duration-normal) var(--ease-spring);
  animation: ringGlow 3s ease-in-out infinite;
}

@keyframes ringGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74, 111, 165, 0); }
  50% { box-shadow: 0 0 12px 2px rgba(74, 111, 165, 0.2); }
}

.avatarRing:hover {
  transform: scale(1.05) rotate(-3deg);
  animation: none;
  box-shadow: 0 0 20px rgba(74, 111, 165, 0.3);
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--color-navy);
  color: #ffffff;
  font-size: var(--text-2xl);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.adminUserText {
  display: flex;
  flex-direction: column;
}

.adminTitle {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--color-text-1);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--sp-1);
}

.adminTitle i {
  color: var(--color-navy-accent);
  animation: crownPulse 2s ease-in-out infinite;
}

@keyframes crownPulse {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

.adminUserName {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-2);
}

.adminUserEmail {
  font-size: var(--text-xs);
  color: var(--color-text-5);
}

.adminSubtitle {
  font-size: var(--text-base);
  color: var(--color-text-4);
}

.logoutBtn {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-5);
  border-radius: var(--radius-md);
  background: var(--color-surface-3);
  border: 1px solid var(--color-border-2);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-2);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-spring);
  flex-shrink: 0;
}

.logoutBtn:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: var(--color-danger-muted);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(248, 113, 113, 0.1);
}

/* Stats */
.statsGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-4);
  margin-bottom: var(--sp-8);
}

.statCard {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-5) var(--sp-6);
  border-radius: var(--radius-lg);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  transition: all var(--duration-normal) var(--ease-spring);
  position: relative;
  overflow: hidden;
}

.statCard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-navy-accent), transparent);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.statCard::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(74, 111, 165, 0.03), transparent 70%);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out);
  pointer-events: none;
}

.statCard:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md), 0 0 20px rgba(74, 111, 165, 0.05);
  border-color: var(--color-border-2);
}

.statCard:hover::before {
  opacity: 1;
}

.statCard:hover::after {
  opacity: 1;
}

.statIcon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: var(--color-navy-accent-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--duration-normal) var(--ease-spring);
}

.statCard:hover .statIcon {
  transform: scale(1.1) rotate(-3deg);
  background: var(--color-navy-accent);
  box-shadow: 0 0 20px rgba(74, 111, 165, 0.3);
}

.statIcon i {
  font-size: 1.4rem;
  color: var(--color-navy-accent);
  transition: color var(--duration-fast) var(--ease-out);
}

.statCard:hover .statIcon i {
  color: #ffffff;
}

.statInfo {
  display: flex;
  flex-direction: column;
}

.statValue {
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--color-text-1);
  line-height: 1;
}

.statLabel {
  font-size: var(--text-xs);
  color: var(--color-text-4);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  margin-top: var(--sp-1);
}

/* Sections */
.adminSection {
  margin-bottom: var(--sp-8);
}

.atividadesAdminList {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.adminAtivCard {
  padding: var(--sp-5) var(--sp-6);
  border-radius: var(--radius-lg);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  transition: all var(--duration-normal) var(--ease-spring);
  position: relative;
  overflow: hidden;
}

.adminAtivCard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, var(--color-navy-accent), transparent);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.adminAtivCard:hover {
  border-color: var(--color-border-2);
  transform: translateX(4px);
  box-shadow: var(--shadow-sm), 0 0 16px rgba(74, 111, 165, 0.03);
}

.adminAtivCard:hover::before {
  opacity: 1;
}

.adminAtivHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-2);
}

.adminAtivMeta {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--text-xs);
  color: var(--color-text-5);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
}

.adminAtivAno {
  color: var(--color-navy-accent);
  font-weight: 600;
}

.adminAtivMeta i {
  font-size: 0.7rem;
}

.adminAtivDisc {
  font-weight: 600;
}

.adminAtivActions {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.actionBtn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-2);
  background: var(--color-surface-3);
  color: var(--color-text-4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-spring);
}

.actionBtn:hover {
  transform: scale(1.1) translateY(-1px);
}

.editBtn:hover {
  border-color: var(--color-info);
  color: var(--color-info);
  background: var(--color-info-muted);
  box-shadow: 0 0 12px rgba(96, 165, 250, 0.1);
}

.deleteBtn:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: var(--color-danger-muted);
  box-shadow: 0 0 12px rgba(248, 113, 113, 0.1);
}

.adminAtivTitle {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-text-1);
  margin-bottom: var(--sp-1);
}

.adminAtivDesc {
  font-size: var(--text-sm);
  color: var(--color-text-4);
  line-height: var(--leading-normal);
  margin-bottom: var(--sp-2);
}

.adminAtivQuestoes {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  font-size: var(--text-xs);
  color: var(--color-text-5);
}

.adminAtivQuestoes i {
  color: var(--color-navy-accent);
}

/* Add new card */
.addAtivCard {
  padding: var(--sp-10);
  border-radius: var(--radius-lg);
  background: var(--color-surface-2);
  border: 2px dashed var(--color-border-2);
  text-align: center;
  transition: all var(--duration-normal) var(--ease-spring);
  position: relative;
  overflow: hidden;
}

.addAtivCard::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-navy-accent-muted), transparent);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out);
  pointer-events: none;
}

.addAtivCard:hover {
  border-color: var(--color-navy-accent);
  transform: translateY(-2px);
}

.addAtivCard:hover::before {
  opacity: 0.3;
}

.addAtivIcon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background: var(--color-surface-3);
  border: 1px dashed var(--color-border-2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--sp-4);
  transition: all var(--duration-normal) var(--ease-spring);
}

.addAtivCard:hover .addAtivIcon {
  background: var(--color-navy-accent-muted);
  border-color: var(--color-navy-accent);
  transform: scale(1.1) rotate(-3deg);
}

.addAtivIcon i {
  font-size: 1.8rem;
  color: var(--color-navy-accent);
}

.addAtivText {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-text-2);
  margin-bottom: var(--sp-1);
}

.addAtivSubtext {
  font-size: var(--text-sm);
  color: var(--color-text-5);
}

/* Transitions */
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

@media (max-width: 768px) {
  .statsGrid {
    grid-template-columns: 1fr;
  }

  .adminHeader {
    flex-direction: column;
  }

  .adminUserInfo {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--sp-3);
  }

  .avatarRing .avatar {
    width: 48px;
    height: 48px;
    font-size: var(--text-xl);
  }
}

@media (max-width: 480px) {
  .profileCard {
    min-width: 0;
    padding: var(--sp-8) var(--sp-6);
    margin: var(--sp-10) var(--sp-4);
  }
}
</style>
