<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAtividade, disciplinaNomes, getAnoIdByDisciplina, deleteAtividade } from '../data/disciplinas.js'
import { useAuthStore } from '../stores/auth.js'

const props = defineProps({
  disciplinaId: { type: String, required: true },
  atividadeId: { type: String, required: true },
})

const router = useRouter()
const auth = useAuthStore()

const atividade = computed(() => getAtividade(props.disciplinaId, props.atividadeId))
const disciplinaName = computed(() => disciplinaNomes[props.disciplinaId] || '')
const anoId = computed(() => getAnoIdByDisciplina(props.disciplinaId))

const showDeleteModal = ref(false)

function confirmDelete() {
  showDeleteModal.value = true
}

function cancelDelete() {
  showDeleteModal.value = false
}

function executeDelete() {
  deleteAtividade(props.disciplinaId, props.atividadeId)
  showDeleteModal.value = false
  router.push(`/disciplina/${anoId.value || 1}/${props.disciplinaId}`)
}
const hasBlocks = computed(() => atividade.value?.blocks && atividade.value.blocks.length > 0)
const totalBlocks = computed(() => atividade.value?.blocks?.length || 0)
const questionCount = computed(() => {
  if (hasBlocks.value) {
    return atividade.value.blocks.filter(b => b.type === 'question').length
  }
  return atividade.value?.questoes?.length || 0
})

const revealed = ref({})

function toggleReveal(key) {
  revealed.value[key] = !revealed.value[key]
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

function renderMarkdown(text) {
  if (!text) return ''
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="md-code"><code class="lang-${lang}">${code.trim()}</code></pre>`
  })

  html = html.replace(/`([^`]+)`/g, '<code class="md-inline">$1</code>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')

  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')

  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return `<ul>${match}</ul>`
  })

  html = html.replace(/\n{2,}/g, '</p><p>')
  html = html.replace(/\n/g, '<br>')
  html = `<p>${html}</p>`
  html = html.replace(/<p><\/p>/g, '')
  html = html.replace(/<p>(<h[123]>)/g, '$1')
  html = html.replace(/(<\/h[123]>)<\/p>/g, '$1')
  html = html.replace(/<p>(<pre)/g, '$1')
  html = html.replace(/(<\/pre>)<\/p>/g, '$1')
  html = html.replace(/<p>(<ul>)/g, '$1')
  html = html.replace(/(<\/ul>)<\/p>/g, '$1')

  return html
}

function getBlockIcon(type) {
  const map = {
    text: 'mdi-text',
    heading: 'mdi-format-header-1',
    code: 'mdi-code-tags',
    image: 'mdi-image-outline',
    list: 'mdi-format-list-bulleted',
    divider: 'mdi-minus',
    question: 'mdi-frequently-asked-questions',
  }
  return map[type] || 'mdi-help-circle-outline'
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
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
            <RouterLink v-if="anoId" :to="`/ano/${anoId}`">{{ anoId }}º Ano</RouterLink>
            <i class="mdi mdi-chevron-right"></i>
            <RouterLink :to="`/disciplina/${anoId || 1}/${disciplinaId}`">{{ disciplinaName }}</RouterLink>
            <i class="mdi mdi-chevron-right"></i>
            <span>{{ atividade.title }}</span>
          </div>
          <h1 class="ativTitle">{{ atividade.title }}</h1>
          <p v-if="atividade.desc" class="ativDesc">{{ atividade.desc }}</p>
          <div class="ativMeta">
            <span class="metaItem" v-if="questionCount > 0">
              <i class="mdi mdi-help-circle-outline"></i>
              {{ questionCount }} questão{{ questionCount > 1 ? 'ões' : '' }}
            </span>
            <span class="metaItem" v-if="totalBlocks > 0">
              <i class="mdi mdi-cube-outline"></i>
              {{ totalBlocks }} bloco{{ totalBlocks > 1 ? 's' : '' }}
            </span>
            <button class="shareBtn" @click="copyLink" title="Copiar link">
              <i class="mdi mdi-link-variant"></i>
              Compartilhar
            </button>
            <template v-if="auth.isLoggedIn">
              <RouterLink
                :to="`/editar-atividade/${disciplinaId}/${atividadeId}`"
                class="shareBtn editBtn"
                title="Editar atividade"
              >
                <i class="mdi mdi-pencil-outline"></i>
                Editar
              </RouterLink>
              <button class="shareBtn deleteBtn" @click="confirmDelete" title="Excluir atividade">
                <i class="mdi mdi-delete-outline"></i>
                Excluir
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- BLOCKS VIEW -->
      <div v-if="hasBlocks" class="blocksView">
        <template v-for="(block, idx) in atividade.blocks" :key="idx">

          <div v-if="block.type === 'text'" class="viewBlock viewText animate-fade-in-up" :class="`delay-${Math.min(idx + 1, 5)}`">
            <p class="plainText">{{ block.content }}</p>
          </div>

          <div v-else-if="block.type === 'markdown'" class="viewBlock viewMarkdown animate-fade-in-up" :class="`delay-${Math.min(idx + 1, 5)}`">
            <div class="mdRender" v-html="renderMarkdown(block.content)"></div>
          </div>

          <div v-else-if="block.type === 'heading'" class="viewBlock viewHeading animate-fade-in-up" :class="`delay-${Math.min(idx + 1, 5)}`">
            <component :is="`h${block.level}`" class="headingEl">{{ block.content }}</component>
          </div>

          <div v-else-if="block.type === 'code'" class="viewBlock viewCode animate-fade-in-up" :class="`delay-${Math.min(idx + 1, 5)}`">
            <div class="codeBlock">
              <div class="codeBlockHeader">
                <i class="mdi mdi-code-tags"></i>
                <span>{{ block.language }}</span>
              </div>
              <pre class="codePre"><code>{{ block.content }}</code></pre>
            </div>
          </div>

          <div v-else-if="block.type === 'image' && block.url" class="viewBlock viewImage animate-fade-in-up" :class="`delay-${Math.min(idx + 1, 5)}`">
            <img :src="block.url" :alt="block.alt || ''" class="viewImageEl" />
            <p v-if="block.alt" class="viewImageAlt">{{ block.alt }}</p>
          </div>

          <div v-else-if="block.type === 'list'" class="viewBlock viewList animate-fade-in-up" :class="`delay-${Math.min(idx + 1, 5)}`">
            <component :is="block.ordered ? 'ol' : 'ul'" class="viewListEl">
              <li v-for="(item, i) in block.items.filter(Boolean)" :key="i">{{ item }}</li>
            </component>
          </div>

          <div v-else-if="block.type === 'divider'" class="viewBlock viewDivider animate-fade-in-up" :class="`delay-${Math.min(idx + 1, 5)}`">
            <hr />
          </div>

          <div v-else-if="block.type === 'question'" class="viewBlock viewQuestion animate-fade-in-up" :class="`delay-${Math.min(idx + 1, 5)}`">
            <div class="questionCard">
              <div class="questionHeader">
                <span class="questionNumber">Q{{ idx + 1 }}</span>
                <span class="questionTipo" :class="getTipoClass(block.tipo)">
                  <i :class="`mdi ${getTipoIcon(block.tipo)}`"></i>
                  {{ getTipoLabel(block.tipo) }}
                </span>
              </div>
              <div class="questionEnunciado mdRender" v-html="renderMarkdown(block.enunciado)"></div>
              <button class="revealBtn" @click="toggleReveal(`q-${idx}`)">
                <i :class="revealed[`q-${idx}`] ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
                {{ revealed[`q-${idx}`] ? 'Ocultar dica' : 'Ver dica' }}
              </button>
              <Transition name="expand">
                <div v-if="revealed[`q-${idx}`]" class="dicaBox">
                  <p v-if="block.tipo === 'exercicio'">
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
        </template>
      </div>

      <!-- FALLBACK: old format (only questoes) -->
      <div v-else-if="atividade.questoes && atividade.questoes.length > 0" class="questoesList">
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
          <button class="revealBtn" @click="toggleReveal(`old-${idx}`)">
            <i :class="revealed[`old-${idx}`] ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
            {{ revealed[`old-${idx}`] ? 'Ocultar dica' : 'Ver dica' }}
          </button>
          <Transition name="expand">
            <div v-if="revealed[`old-${idx}`]" class="dicaBox">
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

    <!-- NOT FOUND -->
    <div class="atividadeContent" v-else>
      <div class="notFound animate-fade-in-up">
        <div class="notFoundIllustration">
          <div class="notFoundCircle">
            <i class="mdi mdi-file-question-outline"></i>
          </div>
          <div class="notFoundDots">
            <span></span><span></span><span></span>
          </div>
        </div>

        <div class="notFoundContent">
          <h2>Atividade não encontrada</h2>
          <p class="notFoundDesc">
            A atividade que você procura não existe, foi removida ou o link está incorreto.
          </p>

          <div class="notFoundReasons">
            <div class="reasonItem">
              <i class="mdi mdi-link-variant-off"></i>
              <span>Link incorreto ou desatualizado</span>
            </div>
            <div class="reasonItem">
              <i class="mdi mdi-delete-outline"></i>
              <span>Atividade removida pelo autor</span>
            </div>
            <div class="reasonItem">
              <i class="mdi mdi-database-remove-outline"></i>
              <span>Dados não encontrados no servidor</span>
            </div>
          </div>

          <div class="notFoundActions">
            <RouterLink :to="disciplinaName ? `/disciplina/${anoId || 1}/${disciplinaId}` : '/anos'" class="actionBtn actionBtnPrimary">
              <i class="mdi mdi-arrow-left"></i>
              {{ disciplinaName ? `Voltar para ${disciplinaName}` : 'Ver disciplinas' }}
            </RouterLink>
            <RouterLink to="/" class="actionBtn">
              <i class="mdi mdi-home-outline"></i>
              Página inicial
            </RouterLink>
            <RouterLink to="/buscar" class="actionBtn">
              <i class="mdi mdi-magnify"></i>
              Buscar atividades
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Transition name="fade">
      <div v-if="showDeleteModal" class="modalOverlay" @click.self="cancelDelete">
        <div class="deleteModal animate-scale-in">
          <div class="modalIcon">
            <i class="mdi mdi-alert-circle-outline"></i>
          </div>
          <h3 class="modalTitle">Excluir atividade?</h3>
          <p class="modalDesc">
            Tem certeza que deseja excluir <strong>{{ atividade?.title }}</strong>?
            Esta ação não pode ser desfeita.
          </p>
          <div class="modalActions">
            <button class="modalBtn modalBtnCancel" @click="cancelDelete">
              Cancelar
            </button>
            <button class="modalBtn modalBtnDelete" @click="executeDelete">
              <i class="mdi mdi-delete-outline"></i>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </Transition>
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
  flex-wrap: wrap;
}

.shareBtn {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border-2);
  background: transparent;
  color: var(--color-text-4);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.shareBtn:hover {
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
  background: var(--color-navy-accent-muted);
}

.shareBtn i {
  font-size: 0.85rem;
}

.shareBtn.editBtn:hover {
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
  background: var(--color-navy-accent-muted);
}

.shareBtn.deleteBtn:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: var(--color-danger-muted);
}

.modalOverlay {
  position: fixed;
  inset: 0;
  background: var(--color-overlay);
  backdrop-filter: blur(4px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-6);
}

.deleteModal {
  width: 100%;
  max-width: 400px;
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border-2);
  box-shadow: var(--shadow-xl);
  padding: var(--sp-8);
  text-align: center;
}

.modalIcon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background: var(--color-danger-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--sp-5);
}

.modalIcon i {
  font-size: 2rem;
  color: var(--color-danger);
}

.modalTitle {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text-1);
  margin-bottom: var(--sp-3);
}

.modalDesc {
  font-size: var(--text-sm);
  color: var(--color-text-4);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--sp-6);
}

.modalDesc strong {
  color: var(--color-text-2);
}

.modalActions {
  display: flex;
  gap: var(--sp-3);
}

.modalBtn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-spring);
  border: none;
}

.modalBtnCancel {
  background: var(--color-surface-3);
  color: var(--color-text-3);
  border: 1px solid var(--color-border-2);
}

.modalBtnCancel:hover {
  background: var(--color-surface-4);
}

.modalBtnDelete {
  background: var(--color-danger);
  color: #ffffff;
}

.modalBtnDelete:hover {
  background: var(--color-danger-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.fade-enter-active {
  transition: opacity 0.25s var(--ease-out);
}

.fade-leave-active {
  transition: opacity 0.2s var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.blocksView {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}

.viewBlock {
  border-radius: var(--radius-lg);
  padding: var(--sp-6);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  transition: all var(--duration-normal) var(--ease-out);
}

.viewBlock:hover {
  border-color: var(--color-border-2);
  box-shadow: var(--shadow-sm);
}

.viewText {
  line-height: var(--leading-relaxed);
}

.plainText {
  font-size: var(--text-base);
  color: var(--color-text-2);
  line-height: var(--leading-relaxed);
  white-space: pre-wrap;
}

.viewMarkdown {
  line-height: var(--leading-relaxed);
}

.viewHeading {
  background: transparent;
  border: none;
  padding: 0;
}

.headingEl {
  color: var(--color-text-1);
  letter-spacing: var(--tracking-tight);
}

h1.headingEl { font-size: var(--text-2xl); font-weight: 800; }
h2.headingEl { font-size: var(--text-xl); font-weight: 700; }
h3.headingEl { font-size: var(--text-lg); font-weight: 700; }

.viewCode {
  padding: 0;
  overflow: hidden;
}

.codeBlock {
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border-2);
}

.codeBlockHeader {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-4);
  background: var(--color-navy);
  color: var(--color-text-5);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
}

.codeBlockHeader i {
  font-size: 0.85rem;
}

.codePre {
  margin: 0;
  padding: var(--sp-5);
  background: var(--color-surface);
  overflow-x: auto;
  line-height: 1.7;
}

.codePre code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: var(--text-sm);
  color: var(--color-text-2);
}

.viewImage {
  padding: 0;
  overflow: hidden;
}

.viewImageEl {
  width: 100%;
  display: block;
  border-radius: var(--radius-lg);
}

.viewImageAlt {
  padding: var(--sp-3) var(--sp-5);
  font-size: var(--text-sm);
  color: var(--color-text-5);
  text-align: center;
  font-style: italic;
}

.viewListEl {
  padding-left: var(--sp-6);
  color: var(--color-text-2);
  line-height: var(--leading-relaxed);
}

.viewListEl li {
  margin-bottom: var(--sp-2);
}

.viewDivider {
  padding: var(--sp-2) 0;
  background: transparent;
  border: none;
}

.viewDivider hr {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border-2), transparent);
}

.viewQuestion {
  padding: 0;
  background: transparent;
  border: none;
}

.questionCard {
  border-radius: var(--radius-lg);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  padding: var(--sp-6);
  position: relative;
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-spring);
}

.questionCard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-navy-accent), var(--color-navy-lighter));
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.questionCard:hover {
  border-color: var(--color-border-2);
  box-shadow: var(--shadow-sm), 0 0 20px rgba(74, 111, 165, 0.05);
  transform: translateY(-2px);
}

.questionCard:hover::before {
  opacity: 1;
}

.questionHeader {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin-bottom: var(--sp-4);
}

.questionNumber {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--color-navy-accent);
  color: #ffffff;
  font-size: var(--text-sm);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--duration-normal) var(--ease-spring);
}

.questionCard:hover .questionNumber {
  transform: scale(1.1) rotate(-3deg);
  box-shadow: 0 0 16px rgba(74, 111, 165, 0.4);
}

.questionTipo {
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

.questionEnunciado {
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

.questaoCard:hover {
  border-color: var(--color-border-2);
  box-shadow: var(--shadow-sm), 0 0 16px rgba(74, 111, 165, 0.04);
  transform: translateY(-2px);
}

.questaoCard:hover::before {
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

.questaoEnunciado {
  font-size: var(--text-base);
  color: var(--color-text-2);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--sp-4);
}

.notFound {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--sp-16) var(--sp-6);
}

.notFoundIllustration {
  position: relative;
  margin-bottom: var(--sp-8);
}

.notFoundCircle {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-full);
  background: var(--color-surface-2);
  border: 2px dashed var(--color-border-2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  animation: notFoundPulse 3s ease-in-out infinite;
}

.notFoundCircle i {
  font-size: 3rem;
  color: var(--color-text-5);
}

@keyframes notFoundPulse {
  0%, 100% { transform: scale(1); border-color: var(--color-border-2); }
  50% { transform: scale(1.05); border-color: var(--color-navy-accent-muted); }
}

.notFoundDots {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 8px;
}

.notFoundDots span {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-navy-accent-muted);
  animation: dotFloat 2s ease-in-out infinite;
}

.notFoundDots span:nth-child(2) { animation-delay: 0.3s; }
.notFoundDots span:nth-child(3) { animation-delay: 0.6s; }

@keyframes dotFloat {
  0%, 100% { opacity: 0.3; transform: translateY(0); }
  50% { opacity: 0.8; transform: translateY(-8px); }
}

.notFoundContent {
  max-width: 480px;
}

.notFoundContent h2 {
  font-size: var(--text-xl);
  font-weight: 800;
  color: var(--color-text-1);
  margin-bottom: var(--sp-3);
}

.notFoundDesc {
  font-size: var(--text-base);
  color: var(--color-text-4);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--sp-6);
}

.notFoundReasons {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  margin-bottom: var(--sp-8);
  text-align: left;
}

.reasonItem {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  font-size: var(--text-sm);
  color: var(--color-text-3);
}

.reasonItem i {
  font-size: 1.1rem;
  color: var(--color-text-5);
  flex-shrink: 0;
}

.notFoundActions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  justify-content: center;
}

.actionBtn {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-5);
  border-radius: var(--radius-md);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-2);
  color: var(--color-text-2);
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--duration-normal) var(--ease-spring);
  cursor: pointer;
}

.actionBtn:hover {
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
  background: var(--color-navy-accent-muted);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.actionBtnPrimary {
  background: var(--color-navy-accent);
  border-color: var(--color-navy-accent);
  color: #ffffff;
}

.actionBtnPrimary:hover {
  background: var(--color-navy-accent-hover);
  border-color: var(--color-navy-accent-hover);
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(74, 111, 165, 0.35);
}

.mdRender :deep(h1) {
  font-size: var(--text-xl);
  font-weight: 800;
  color: var(--color-text-1);
  margin: var(--sp-3) 0 var(--sp-2);
}

.mdRender :deep(h2) {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-1);
  margin: var(--sp-3) 0 var(--sp-2);
}

.mdRender :deep(h3) {
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-text-1);
  margin: var(--sp-3) 0 var(--sp-2);
}

.mdRender :deep(p) {
  margin-bottom: var(--sp-2);
  line-height: var(--leading-relaxed);
  color: var(--color-text-2);
}

.mdRender :deep(strong) {
  font-weight: 700;
  color: var(--color-text-1);
}

.mdRender :deep(em) {
  font-style: italic;
}

.mdRender :deep(del) {
  text-decoration: line-through;
  color: var(--color-text-5);
}

.mdRender :deep(.md-code) {
  display: block;
  padding: var(--sp-4);
  border-radius: var(--radius-md);
  background: var(--color-surface-3);
  border: 1px solid var(--color-border-2);
  overflow-x: auto;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: var(--text-sm);
  line-height: 1.6;
  margin: var(--sp-3) 0;
}

.mdRender :deep(.md-inline) {
  padding: 2px var(--sp-2);
  border-radius: var(--radius-sm);
  background: var(--color-surface-4);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9em;
}

.mdRender :deep(ul),
.mdRender :deep(ol) {
  padding-left: var(--sp-6);
  margin: var(--sp-2) 0;
}

.mdRender :deep(li) {
  margin-bottom: var(--sp-1);
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
  max-height: 300px;
  transform: translateY(0) scale(1);
}

@media (max-width: 480px) {
  .ativTitle {
    font-size: var(--text-xl);
  }

  .notFoundCircle {
    width: 96px;
    height: 96px;
  }

  .notFoundCircle i {
    font-size: 2.2rem;
  }

  .notFoundActions {
    flex-direction: column;
    width: 100%;
  }

  .actionBtn {
    justify-content: center;
  }
}
</style>
