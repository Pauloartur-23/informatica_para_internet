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
  <div class="atividadeView">
    <div class="pageDeco">
      <div class="pageDecoOrb pageDecoOrb1"></div>
      <div class="pageDecoOrb pageDecoOrb2"></div>
      <div class="pageDecoOrb pageDecoOrb3"></div>
      <div class="pageDecoDots"></div>
      <div class="pageDecoGrid"></div>
    </div>

    <div class="atividadeContent" v-if="atividade">
      <div class="ativHeader animate-fade-in-up">
        <button class="backBtn" @click="router.back()">
          <i class="mdi mdi-arrow-left"></i>
        </button>
        <div class="ativInfo">
          <div class="breadcrumb">
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

    <div class="atividadeContent" v-else>
      <div class="emptyState animate-fade-in-up">
        <div class="emptyStateIcon">
          <i class="mdi mdi-alert-circle-outline"></i>
        </div>
        <h2>Atividade não encontrada</h2>
        <p>A atividade solicitada não existe.</p>
        <RouterLink to="/" class="backHome">Voltar ao início</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.atividadeView {
  position: relative;
  min-height: calc(100vh - var(--header-h));
}

.atividadeContent {
  position: relative;
  z-index: 1;
  max-width: var(--max-w-narrow);
  margin: 0 auto;
  padding: var(--sp-8) var(--sp-6);
}

.ativHeader {
  margin-bottom: var(--sp-8);
  display: flex;
  align-items: flex-start;
  gap: var(--sp-4);
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
  transition: all var(--duration-normal) var(--ease-spring);
}

.backBtn:hover {
  background: var(--color-surface-4);
  color: var(--color-text-1);
  transform: translateX(-3px);
  box-shadow: var(--shadow-sm);
}

.ativInfo {
  flex: 1;
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
  transition: all var(--duration-normal) var(--ease-spring);
  position: relative;
  overflow: hidden;
}

.questaoCard::before {
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

.questaoCard::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(74, 111, 165, 0.03), transparent 70%);
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
  pointer-events: none;
}

.questaoCard:hover {
  border-color: var(--color-border-2);
  box-shadow: var(--shadow-sm), 0 0 16px rgba(74, 111, 165, 0.04);
  transform: translateY(-2px);
}

.questaoCard:hover::before {
  opacity: 1;
}

.questaoCard:hover::after {
  opacity: 1;
}

.questaoHeader {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin-bottom: var(--sp-3);
}

.questaoNumber {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--color-navy-accent);
  color: #ffffff;
  font-size: var(--text-xs);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--duration-normal) var(--ease-spring);
}

.questaoCard:hover .questaoNumber {
  transform: scale(1.15) rotate(-3deg);
  box-shadow: 0 0 16px rgba(74, 111, 165, 0.4);
}

.questaoTipo {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  transition: all var(--duration-fast) var(--ease-out);
}

.tipoExercicio {
  background: var(--color-info-muted);
  color: var(--color-info);
  border: 1px solid rgba(96, 165, 250, 0.15);
}

.tipoExercicio:hover {
  box-shadow: 0 0 12px rgba(96, 165, 250, 0.15);
  transform: scale(1.05);
}

.tipoTeorica {
  background: var(--color-warning-muted);
  color: var(--color-warning);
  border: 1px solid rgba(251, 191, 36, 0.15);
}

.tipoTeorica:hover {
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.15);
  transform: scale(1.05);
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
  transition: all var(--duration-normal) var(--ease-spring);
  position: relative;
  overflow: hidden;
}

.revealBtn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-navy-accent-muted), transparent);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.revealBtn:hover {
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
  transform: scale(1.05);
  box-shadow: 0 0 16px rgba(74, 111, 165, 0.1);
}

.revealBtn:hover::before {
  opacity: 1;
}

.revealBtn:active {
  transform: scale(0.97);
}

.dicaBox {
  margin-top: var(--sp-4);
  padding: var(--sp-4);
  border-radius: var(--radius-md);
  background: var(--color-surface-3);
  border-left: 3px solid var(--color-navy-accent);
  position: relative;
  overflow: hidden;
}

.dicaBox::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  background: linear-gradient(90deg, rgba(74, 111, 165, 0.04), transparent);
  pointer-events: none;
}

.dicaBox p {
  font-size: var(--text-sm);
  color: var(--color-text-3);
  line-height: var(--leading-relaxed);
}

.expand-enter-active {
  transition: all 0.35s var(--ease-spring);
}

.expand-leave-active {
  transition: all 0.25s var(--ease-out);
}

.expand-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-12px) scale(0.97);
}

.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 200px;
  transform: translateY(0) scale(1);
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
