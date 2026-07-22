<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  getDisciplina,
  getAtividades,
  disciplinaDescricoes,
} from '../data/disciplinas.js'

const props = defineProps({
  anoId: { type: String, required: true },
  disciplinaId: { type: String, required: true },
})

const router = useRouter()

const disciplina = computed(() => getDisciplina(Number(props.anoId), props.disciplinaId))
const desc = computed(() => disciplinaDescricoes[props.disciplinaId] || '')
const atividades = computed(() => getAtividades(props.disciplinaId))
</script>

<template>
  <div v-if="disciplina" class="disciplinaView">
    <div class="discHeader animate-fade-in-up">
      <button class="backBtn" @click="router.back()">
        <i class="mdi mdi-arrow-left"></i>
      </button>
      <div class="discInfo">
        <div class="discBreadcrumb">
          <RouterLink :to="`/ano/${anoId}`">Ano {{ anoId }}</RouterLink>
          <i class="mdi mdi-chevron-right"></i>
          <span>{{ disciplina.name }}</span>
        </div>
        <h1 class="discTitle">
          <span class="discTitleIcon"><i :class="`mdi ${disciplina.icon}`"></i></span>
          {{ disciplina.name }}
        </h1>
        <p class="discDesc" v-if="desc">{{ desc }}</p>
      </div>
    </div>

    <div v-if="atividades.length" class="atividadesList">
      <div
        v-for="(ativ, idx) in atividades"
        :key="ativ.id"
        class="atividadeCard animate-fade-in-up"
        :class="`delay-${Math.min(idx + 1, 5)}`"
      >
        <RouterLink
          :to="`/atividade/${disciplinaId}/${ativ.id}`"
          class="atividadeLink"
        >
          <div class="atividadeNumber">{{ String(ativ.id).padStart(2, '0') }}</div>
          <div class="atividadeContent">
            <h2 class="atividadeTitle">{{ ativ.title }}</h2>
            <p class="atividadeDesc">{{ ativ.desc }}</p>
            <div class="atividadeMeta">
              <span class="metaItem">
                <i class="mdi mdi-help-circle-outline"></i>
                {{ativ.questoes.length}} questão{{ativ.questoes.length > 1 ? 's' : ''}}
              </span>
            </div>
          </div>
          <i class="mdi mdi-chevron-right atividadeArrow"></i>
        </RouterLink>
      </div>
    </div>

    <div v-else class="emptyState animate-fade-in-up">
      <i class="mdi mdi-file-document-outline"></i>
      <h2>Nenhuma atividade</h2>
      <p>Esta disciplina ainda não possui atividades cadastradas.</p>
    </div>
  </div>

  <div v-else class="disciplinaView">
    <div class="emptyState animate-fade-in-up">
      <i class="mdi mdi-alert-circle-outline"></i>
      <h2>Disciplina não encontrada</h2>
      <p>A disciplina solicitada não existe.</p>
      <RouterLink to="/" class="backHome">Voltar ao início</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.disciplinaView {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: var(--sp-8) var(--sp-6);
}

.discHeader {
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

.discInfo {
  flex: 1;
}

.discBreadcrumb {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--text-xs);
  color: var(--color-text-5);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  margin-bottom: var(--sp-3);
}

.discBreadcrumb a {
  color: var(--color-navy-accent);
  text-decoration: none;
  font-weight: 600;
  transition: color var(--duration-fast) var(--ease-out);
}

.discBreadcrumb a:hover {
  color: var(--color-navy-accent-hover);
}

.discBreadcrumb i {
  font-size: 0.7rem;
}

.discTitle {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--color-text-1);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--sp-2);
}

.discTitleIcon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--color-navy-accent-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--duration-fast) var(--ease-spring);
  animation: iconPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--color-navy-accent-muted); }
  50% { box-shadow: 0 0 0 6px transparent; }
}

.discTitleIcon i {
  font-size: 1.3rem;
  color: var(--color-navy-accent);
}

.discDesc {
  font-size: var(--text-base);
  color: var(--color-text-4);
  line-height: var(--leading-relaxed);
}

.atividadesList {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.atividadeCard {
  border-radius: var(--radius-lg);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  overflow: hidden;
  transition: all var(--duration-fast) var(--ease-out);
}

.atividadeCard:hover {
  border-color: var(--color-border-2);
  box-shadow: var(--shadow-sm);
}

.atividadeLink {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-5) var(--sp-6);
  text-decoration: none;
}

.atividadeCard:hover .atividadeLink {
  background: var(--color-surface-3);
}

.atividadeNumber {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--color-navy-accent);
  color: #ffffff;
  font-size: var(--text-sm);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--duration-fast) var(--ease-spring);
}

.atividadeCard:hover .atividadeNumber {
  transform: scale(1.1);
  box-shadow: var(--shadow-glow-sm);
}

.atividadeContent {
  flex: 1;
  min-width: 0;
}

.atividadeTitle {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-text-1);
  margin-bottom: var(--sp-1);
}

.atividadeDesc {
  font-size: var(--text-sm);
  color: var(--color-text-4);
  line-height: var(--leading-normal);
  margin-bottom: var(--sp-2);
}

.atividadeMeta {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}

.metaItem {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  font-size: var(--text-xs);
  color: var(--color-text-5);
}

.metaItem i {
  font-size: 0.85rem;
  color: var(--color-navy-accent);
}

.atividadeArrow {
  font-size: 1.2rem;
  color: var(--color-text-5);
  transition: all var(--duration-fast) var(--ease-out);
  flex-shrink: 0;
}

.atividadeCard:hover .atividadeArrow {
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
  .discTitle {
    font-size: var(--text-xl);
  }

  .atividadeLink {
    padding: var(--sp-4);
  }

  .atividadeNumber {
    width: 36px;
    height: 36px;
    font-size: var(--text-xs);
  }
}
</style>
