<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="heroBg">
        <div class="heroOrb heroOrb1"></div>
        <div class="heroOrb heroOrb2"></div>
        <div class="heroOrb heroOrb3"></div>
        <div class="heroGrid"></div>
        <div class="heroDots"></div>
      </div>

      <div class="heroInner">
        <div class="heroBadge animate-fade-in-up">
          <i class="mdi mdi-laptop"></i>
          <span>IFC Campus Araquari</span>
        </div>

        <h1 class="heroTitle animate-fade-in-up delay-1">
          Informática para<br />
          <span class="heroAccent">Internet</span>
        </h1>

        <p class="heroDesc animate-fade-in-up delay-2">
          Sistema que reúne todas as atividades, listas, projetos e materiais do
          <strong>Curso Técnico em Informática</strong>. Qualquer aluno pode consultar
          o conteúdo de forma gratuita, enquanto apenas professores possuem acesso
          administrativo para gerenciar as atividades.
        </p>

        <RouterLink to="/anos" class="btn btnPrimary animate-fade-in-up delay-3">
          <i class="mdi mdi-rocket-launch-outline"></i>
          Começar Agora
        </RouterLink>
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

.heroBg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.heroOrb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
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

.heroDots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--color-navy-accent) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.08;
  mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, black 10%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, black 10%, transparent 70%);
}

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
  position: relative;
  overflow: hidden;
}

.heroBadge::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
  animation: shimmer 4s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { left: -100%; }
  50% { left: 100%; }
}

.heroTitle {
  font-size: clamp(2.5rem, 5vw, 4rem);
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
  filter: drop-shadow(0 0 20px rgba(74, 111, 165, 0.3));
}

.heroDesc {
  font-size: var(--text-lg);
  color: var(--color-text-3);
  line-height: var(--leading-relaxed);
  max-width: 520px;
  margin-bottom: var(--sp-10);
}

.heroDesc strong {
  color: var(--color-text-2);
  font-weight: 600;
}

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
}

.btnPrimary {
  background: var(--color-navy);
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(74, 111, 165, 0.3);
  animation: btnGlow 3s ease-in-out infinite;
}

@keyframes btnGlow {
  0%, 100% { box-shadow: 0 4px 20px rgba(74, 111, 165, 0.3); }
  50% { box-shadow: 0 4px 32px rgba(74, 111, 165, 0.5); }
}

.btnPrimary:hover {
  background: var(--color-navy-light);
  box-shadow: 0 8px 40px rgba(74, 111, 165, 0.5);
  transform: translateY(-3px);
}

.btnPrimary:active {
  transform: translateY(0);
}

@media (max-width: 480px) {
  .hero {
    padding: var(--sp-10) var(--sp-6);
  }

  .heroTitle {
    font-size: var(--text-3xl);
  }

  .heroDesc {
    font-size: var(--text-base);
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
