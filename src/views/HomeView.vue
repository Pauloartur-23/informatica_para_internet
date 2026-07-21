<script setup>
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="heroBg">
        <div class="heroOrb heroOrb1"></div>
        <div class="heroOrb heroOrb2"></div>
        <div class="heroOrb heroOrb3"></div>
        <div class="heroGrid"></div>
      </div>

      <div class="heroInner">
        <div class="heroBadge animate-fade-in-up">
          <i class="mdi mdi-laptop"></i>
          <span>IFC Campus Araquari</span>
        </div>

        <h1 class="heroTitle animate-fade-in-up delay-1">
          Informática<br />
          <span class="heroAccent">para Internet</span>
        </h1>

        <p class="heroDesc animate-fade-in-up delay-2">
          Plataforma de atividades escolares criada pela
          <strong>Monitoria de Informática</strong> para o curso
          <strong>Técnico em Informática</strong>.
        </p>

        <div class="heroActions animate-fade-in-up delay-3">
          <RouterLink
            to="/perfil"
            class="btn btnPrimary"
            @click="!auth.isLoggedIn && auth.quickLogin()"
          >
            <i :class="auth.isLoggedIn ? 'mdi mdi-account-outline' : 'mdi mdi-login'"></i>
            {{ auth.isLoggedIn ? 'Meu Perfil' : 'Começar Agora' }}
          </RouterLink>
        </div>

        
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  position: relative;
}

.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--header-h));
  padding: var(--sp-16) var(--sp-6);
  overflow: hidden;
}

/* Background effects */
.heroBg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.heroOrb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.heroOrb1 {
  width: 500px;
  height: 500px;
  background: var(--color-navy-accent-muted);
  top: -10%;
  right: -5%;
  animation: orbFloat 12s ease-in-out infinite;
}

.heroOrb2 {
  width: 350px;
  height: 350px;
  background: var(--color-navy-accent-muted);
  bottom: -5%;
  left: -5%;
  animation: orbFloat 10s ease-in-out infinite reverse;
}

.heroOrb3 {
  width: 200px;
  height: 200px;
  background: var(--color-navy-accent-muted);
  top: 40%;
  left: 50%;
  animation: orbFloat 14s ease-in-out infinite;
  animation-delay: -3s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(30px, -30px); }
  66% { transform: translate(-20px, 20px); }
}

.heroGrid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--color-border-1) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border-1) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.3;
  mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 70%);
}

/* Content */
.heroInner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 640px;
}

.heroBadge {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-full);
  background: var(--color-navy-accent-muted);
  border: 1px solid var(--color-border-2);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-navy-accent);
  margin-bottom: var(--sp-8);
  backdrop-filter: blur(8px);
}

.heroTitle {
  font-size: var(--text-5xl);
  font-weight: 800;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-1);
  margin-bottom: var(--sp-6);
}

.heroAccent {
  background: linear-gradient(135deg, var(--color-navy-accent) 0%, var(--color-navy-accent-hover, var(--color-navy-accent)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.heroDesc {
  font-size: var(--text-lg);
  color: var(--color-text-3);
  line-height: var(--leading-relaxed);
  max-width: 480px;
  margin-bottom: var(--sp-10);
}

.heroDesc strong {
  color: var(--color-text-2);
  font-weight: 600;
}

.heroActions {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin-bottom: var(--sp-12);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-4) var(--sp-8);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  border: 1px solid transparent;
}

.btnPrimary {
  background: var(--color-navy);
  color: #ffffff;
}

.btnPrimary:hover {
  background: var(--color-navy-light);
  box-shadow: var(--shadow-glow-sm);
  transform: translateY(-2px);
}

.btnPrimary:active {
  transform: translateY(0);
}

/* Features pills */
.heroFeatures {
  display: flex;
  align-items: center;
  gap: var(--sp-6);
  flex-wrap: wrap;
  justify-content: center;
}

.heroFeature {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--text-sm);
  color: var(--color-text-4);
}

.heroFeature i {
  color: var(--color-success);
  font-size: 1.1rem;
}

@media (max-width: 900px) {
  .heroTitle {
    font-size: var(--text-4xl);
  }

  .heroFeatures {
    gap: var(--sp-4);
  }
}

@media (max-width: 480px) {
  .heroTitle {
    font-size: var(--text-3xl);
  }

  .heroDesc {
    font-size: var(--text-base);
  }

  .heroFeatures {
    flex-direction: column;
    gap: var(--sp-3);
  }
}
</style>
