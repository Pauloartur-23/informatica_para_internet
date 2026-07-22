<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { getAno } from '../data/disciplinas.js'

const props = defineProps({
  anoId: { type: String, required: true },
})

const router = useRouter()

const ano = computed(() => getAno(Number(props.anoId)))
const disciplinas = computed(() => ano.value?.disciplinas || [])
</script>

<template>
  <div v-if="ano" class="anoView">
    <div class="anoHeader animate-fade-in-up">
      <button class="backBtn" @click="router.back()">
        <i class="mdi mdi-arrow-left"></i>
      </button>
      <div class="anoInfo">
        <h1 class="anoTitle">{{ ano.label }}</h1>
        <p class="anoDesc">{{ ano.desc }}</p>
      </div>
    </div>

    <div class="disciplinasGrid">
      <RouterLink
        v-for="(disc, idx) in disciplinas"
        :key="disc.id"
        :to="`/disciplina/${anoId}/${disc.id}`"
        class="disciplinaCard animate-fade-in-up"
        :class="`delay-${Math.min(idx + 1, 5)}`"
      >
        <div class="discIcon">
          <i :class="`mdi ${disc.icon}`"></i>
        </div>
        <div class="discContent">
          <h2 class="discName">{{ disc.name }}</h2>
        </div>
        <i class="mdi mdi-chevron-right discArrow"></i>
      </RouterLink>
    </div>
  </div>

  <div v-else class="anoView">
    <div class="emptyState animate-fade-in-up">
      <i class="mdi mdi-alert-circle-outline"></i>
      <h2>Ano não encontrado</h2>
      <p>O ano solicitado não existe.</p>
      <RouterLink to="/" class="backHome">Voltar ao início</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.anoView {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: var(--sp-8) var(--sp-6);
}

.anoHeader {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-4);
  margin-bottom: var(--sp-8);
}

.backBtn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--color-surface-3);
  border: 1px solid var(--color-border-2);
  color: var(--color-text-3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all var(--duration-fast) var(--ease-out);
}

.backBtn:hover {
  background: var(--color-surface-4);
  color: var(--color-text-1);
  transform: translateX(-2px);
}

.anoInfo {
  flex: 1;
}

.anoTitle {
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-text-1);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--sp-2);
}

.anoDesc {
  font-size: var(--text-base);
  color: var(--color-text-4);
  line-height: var(--leading-relaxed);
}

.disciplinasGrid {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.disciplinaCard {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-5) var(--sp-6);
  border-radius: var(--radius-lg);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out);
  cursor: pointer;
}

.disciplinaCard:hover {
  background: var(--color-surface-3);
  border-color: var(--color-border-2);
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

.discIcon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--color-navy-accent-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--duration-fast) var(--ease-spring);
}

.disciplinaCard:hover .discIcon {
  transform: scale(1.1) rotate(-3deg);
  background: var(--color-navy-accent);
}

.discIcon i {
  font-size: 1.4rem;
  color: var(--color-navy-accent);
  transition: color var(--duration-fast) var(--ease-out);
}

.disciplinaCard:hover .discIcon i {
  color: #ffffff;
}

.discContent {
  flex: 1;
  min-width: 0;
}

.discName {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-text-1);
}

.discArrow {
  font-size: 1.2rem;
  color: var(--color-text-5);
  transition: all var(--duration-fast) var(--ease-out);
  flex-shrink: 0;
}

.disciplinaCard:hover .discArrow {
  color: var(--color-navy-accent);
  transform: translateX(4px);
}

.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
  text-align: center;
  padding: var(--sp-20) var(--sp-6);
}

.emptyState i {
  font-size: 3rem;
  color: var(--color-text-5);
}

.emptyState h2 {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text-1);
}

.emptyState p {
  font-size: var(--text-base);
  color: var(--color-text-4);
}

.backHome {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-6);
  border-radius: var(--radius-md);
  background: var(--color-navy);
  color: #ffffff;
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out);
}

.backHome:hover {
  background: var(--color-navy-light);
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .anoTitle {
    font-size: var(--text-2xl);
  }

  .disciplinaCard {
    padding: var(--sp-4);
  }
}
</style>
