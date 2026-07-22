<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAtividade, disciplinaNomes } from '../data/disciplinas.js'

const props = defineProps({
  disciplinaId: { type: String, required: true },
  atividadeId: { type: String, required: true },
})

const router = useRouter()

const atividade = computed(() => getAtividade(props.disciplinaId, props.atividadeId))
const disciplinaName = computed(() => disciplinaNomes[props.disciplinaId] || '')

const answered = ref({})

function toggleAnswer(idx) {
  answered.value[idx] = !answered.value[idx]
}

function getTipoLabel(tipo) {
  if (tipo === 'exercicio') return 'Exercício'
  if (tipo === 'teorica') return 'Teórica'
  return tipo
}

function getTipoIcon(tipo) {
  if (tipo === 'exercicio') return 'mdi-code-braces'
  if (tipo === 'teorica') return 'mdi-book-open-page-variant'
  return 'mdi-help-circle-outline'
}

function getTipoClass(tipo) {
  if (tipo === 'exercicio') return 'tipoExercicio'
  if (tipo === 'teorica') return 'tipoTeorica'
  return ''
}
</script>

<template>
  <div v-if="atividade" class="atividadeView">
    <div class="ativHeader animate-fade-in-up">
      <button class="backBtn" @click="router.back()">
        <i class="mdi mdi-arrow-left"></i>
      </button>
      <div class="ativInfo">
        <div class="ativBreadcrumb">
          <RouterLink :to="`/disciplina/1/${disciplinaId}`">{{ disciplinaName }}</RouterLink>
          <i class="mdi mdi-chevron-right"></i>
          <span>{{ atividade.title }}</span>
        </div>
        <h1 class="ativTitle">{{ atividade.title }}</h1>
        <p class="ativDesc">{{ atividade.desc }}</p>
        <div class="ativMeta">
          <span class="metaItem">
            <i class="mdi mdi-help-circle-outline"></i>
            {{ atividade.questoes.length }} questão{{ atividade.questoes.length > 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>

    <div class="questoesList">
      <div
        v-for="(q, idx) in atividade.questoes"
        :key="idx"
        class="questaoCard animate-fade-in-up"
        :class="`delay-${Math.min(idx + 1, 5)}`"
      >
        <div class="questaoHeader">
          <span class="questaoNumber">Q{{ idx + 1 }}</span>
          <span class="questaoTipo" :class="getTipoClass(q.tipo)">
            <i :class="`mdi ${getTipoIcon(q.tipo)}`"></i>
            {{ getTipoLabel(q.tipo) }}
          </span>
        </div>
        <p class="questaoEnunciado">{{ q.enunciado }}</p>
        <button class="revealBtn" @click="toggleAnswer(idx)">
          <i :class="answered[idx] ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
          {{ answered[idx] ? 'Ocultar dica' : 'Ver dica' }}
        </button>
        <Transition name="expand">
          <div v-if="answered[idx]" class="dicaBox">
            <p v-if="q.tipo === 'exercicio'">
              Pense sobre os conceitos abordados na disciplina e tente resolver passo a passo.
              Considere criar um pseudocódigo antes de implementar.
            </p>
            <p v-else>
              Revise o conteúdo teórico da disciplina e formule uma resposta completa,
              incluindo exemplos práticos quando possível.
            </p>
          </div>
        </Transition>
      </div>
    </div>
  </div>

  <div v-else class="atividadeView">
    <div class="emptyState animate-fade-in-up">
      <i class="mdi mdi-alert-circle-outline"></i>
      <h2>Atividade não encontrada</h2>
      <p>A atividade solicitada não existe.</p>
      <RouterLink to="/" class="backHome">Voltar ao início</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.atividadeView {
  max-width: var(--max-w-narrow);
  margin: 0 auto;
  padding: var(--sp-8) var(--sp-6);
}

.ativHeader {
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
  transition: all var(--duration-fast) var(--ease-out);
  margin-bottom: var(--sp-4);
}

.backBtn:hover {
  background: var(--color-surface-4);
  color: var(--color-text-1);
  transform: translateX(-2px);
}

.ativBreadcrumb {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--text-xs);
  color: var(--color-text-5);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  margin-bottom: var(--sp-3);
}

.ativBreadcrumb a {
  color: var(--color-navy-accent);
  text-decoration: none;
  font-weight: 600;
  transition: color var(--duration-fast) var(--ease-out);
}

.ativBreadcrumb a:hover {
  color: var(--color-navy-accent-hover);
}

.ativBreadcrumb i {
  font-size: 0.7rem;
}

.ativTitle {
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--color-text-1);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--sp-2);
}

.ativDesc {
  font-size: var(--text-base);
  color: var(--color-text-4);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--sp-3);
}

.ativMeta {
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
  color: var(--color-navy-accent);
}

.questoesList {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.questaoCard {
  border-radius: var(--radius-lg);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  padding: var(--sp-6);
  transition: all var(--duration-fast) var(--ease-out);
}

.questaoCard:hover {
  border-color: var(--color-border-2);
}

.questaoHeader {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin-bottom: var(--sp-3);
}

.questaoNumber {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: var(--color-navy-accent);
  color: #ffffff;
  font-size: var(--text-xs);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--duration-fast) var(--ease-spring);
}

.questaoCard:hover .questaoNumber {
  transform: scale(1.1);
  box-shadow: var(--shadow-glow-sm);
}

.questaoTipo {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
}

.tipoExercicio {
  background: var(--color-info-muted);
  color: var(--color-info);
}

.tipoTeorica {
  background: var(--color-warning-muted);
  color: var(--color-warning);
}

.questaoEnunciado {
  font-size: var(--text-base);
  color: var(--color-text-2);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--sp-4);
}

.revealBtn {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-sm);
  background: var(--color-surface-3);
  border: 1px solid var(--color-border-2);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-3);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-spring);
}

.revealBtn:hover {
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
  background: var(--color-navy-accent-muted);
  transform: scale(1.05);
}

.revealBtn:active {
  transform: scale(0.98);
}

.dicaBox {
  margin-top: var(--sp-4);
  padding: var(--sp-4);
  border-radius: var(--radius-md);
  background: var(--color-surface-3);
  border-left: 3px solid var(--color-navy-accent);
}

.dicaBox p {
  font-size: var(--text-sm);
  color: var(--color-text-3);
  line-height: var(--leading-relaxed);
}

.expand-enter-active {
  transition: all 0.3s var(--ease-out);
}

.expand-leave-active {
  transition: all 0.2s var(--ease-out);
}

.expand-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}

.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 200px;
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
  .ativTitle {
    font-size: var(--text-xl);
  }

  .questaoCard {
    padding: var(--sp-4);
  }
}
</style>
