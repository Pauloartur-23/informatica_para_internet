<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { anos, addAtividade, editAtividade, getAtividade } from '../data/disciplinas.js'

const props = defineProps({
  disciplinaId: { type: String, default: null },
  atividadeId: { type: String, default: null },
})

const router = useRouter()
const route = useRoute()

const isEditMode = computed(() => !!props.disciplinaId && !!props.atividadeId)
const editingAtividade = computed(() => {
  if (!isEditMode.value) return null
  return getAtividade(props.disciplinaId, props.atividadeId)
})

const DRAFT_KEY = 'sio-draft-activity'

function loadDraft() {
  if (isEditMode.value) return null
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveDraft() {
  if (isEditMode.value) return
  localStorage.setItem(DRAFT_KEY, JSON.stringify({
    title: title.value,
    description: description.value,
    selectedAno: selectedAno.value,
    selectedDisc: selectedDisc.value,
    blocks: blocks.value,
  }))
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY)
}

function loadEditMode() {
  if (!editingAtividade.value) return {}
  const a = editingAtividade.value
  let ano = a.ano || ''
  if (!ano) {
    for (const [id, anoData] of Object.entries(anos)) {
      if (anoData.disciplinas.some((d) => d.id === props.disciplinaId)) {
        ano = id
        break
      }
    }
  }
  return {
    title: a.title || '',
    description: a.desc || '',
    selectedAno: ano,
    selectedDisc: props.disciplinaId,
    blocks: a.blocks ? JSON.parse(JSON.stringify(a.blocks)) : [],
  }
}

const draft = isEditMode.value ? null : loadDraft()
const editData = isEditMode.value ? loadEditMode() : {}

let blockIdCounter = (draft?.blocks || editData.blocks || []).length
function nextId() {
  return ++blockIdCounter
}

const title = ref(draft?.title || editData.title || '')
const description = ref(draft?.description || editData.description || '')
const blocks = ref(draft?.blocks || editData.blocks || [])
const showAddMenu = ref(false)
const addMenuIdx = ref(null)
const previewMode = ref(false)
const selectedAno = ref(draft?.selectedAno || editData.selectedAno || '')
const selectedDisc = ref(draft?.selectedDisc || editData.selectedDisc || '')
const isSaving = ref(false)
const errors = ref({})
const showErrors = ref(false)

const anosList = Object.entries(anos).map(([id, ano]) => ({
  id,
  label: ano.label,
  disciplinas: ano.disciplinas,
}))

const disciplinasDoAno = computed(() => {
  if (!selectedAno.value) return []
  const ano = anos[selectedAno.value]
  return ano ? ano.disciplinas : []
})

const hasChanges = computed(() => {
  return title.value || description.value || blocks.value.length > 0 || selectedAno.value || selectedDisc.value
})

const blockCount = computed(() => blocks.value.length)
const questionCount = computed(() => blocks.value.filter((b) => b.type === 'question').length)
const textLength = computed(() => {
  return blocks.value.reduce((sum, b) => {
    if (b.content) return sum + b.content.length
    if (b.enunciado) return sum + b.enunciado.length
    return sum
  }, 0)
})

const blockTypes = [
  { type: 'text', label: 'Texto', icon: 'mdi-text', desc: 'Parágrafos simples de texto' },
  { type: 'markdown', label: 'Markdown', icon: 'mdi-language-markdown', desc: 'Texto com formatação rich' },
  { type: 'heading', label: 'Título', icon: 'mdi-format-header-1', desc: 'Título de seção' },
  { type: 'code', label: 'Código', icon: 'mdi-code-tags', desc: 'Bloco de código com syntax highlight' },
  { type: 'image', label: 'Imagem', icon: 'mdi-image-outline', desc: 'Imagem por URL' },
  { type: 'list', label: 'Lista', icon: 'mdi-format-list-bulleted', desc: 'Lista com marcadores ou numerada' },
  { type: 'divider', label: 'Divisor', icon: 'mdi-minus', desc: 'Linha separadora' },
  { type: 'question', label: 'Questão', icon: 'mdi-frequently-asked-questions', desc: 'Enunciado de questão' },
]

function addBlock(type, afterIdx) {
  const defaults = {
    text: { content: '' },
    markdown: { content: '' },
    heading: { content: '', level: 2 },
    code: { content: '', language: 'javascript' },
    image: { url: '', alt: '' },
    list: { items: [''], ordered: false },
    divider: {},
    question: { enunciado: '', tipo: 'exercicio' },
  }

  const block = {
    id: nextId(),
    type,
    ...defaults[type],
  }

  if (afterIdx !== undefined && afterIdx !== null) {
    blocks.value.splice(afterIdx + 1, 0, block)
  } else {
    blocks.value.push(block)
  }

  showAddMenu.value = false
  addMenuIdx.value = null
}

function removeBlock(idx) {
  blocks.value.splice(idx, 1)
}

function duplicateBlock(idx) {
  const original = blocks.value[idx]
  const clone = { ...JSON.parse(JSON.stringify(original)), id: nextId() }
  blocks.value.splice(idx + 1, 0, clone)
}

function moveBlock(idx, dir) {
  const newIdx = idx + dir
  if (newIdx < 0 || newIdx >= blocks.value.length) return
  const temp = blocks.value[idx]
  blocks.value[idx] = blocks.value[newIdx]
  blocks.value[newIdx] = temp
}

function addListItem(block) {
  block.items.push('')
}

function removeListItem(block, idx) {
  if (block.items.length > 1) {
    block.items.splice(idx, 1)
  }
}

function openAddMenu(idx) {
  addMenuIdx.value = idx
  showAddMenu.value = true
}

function closeAddMenu() {
  showAddMenu.value = false
  addMenuIdx.value = null
}

function validate() {
  const e = {}
  if (!title.value.trim()) e.title = 'O título é obrigatório.'
  if (!selectedAno.value) e.ano = 'Selecione o ano.'
  if (!selectedDisc.value) e.disc = 'Selecione a disciplina.'
  if (blocks.value.length === 0) e.blocks = 'Adicione pelo menos um bloco.'
  errors.value = e
  return Object.keys(e).length === 0
}

function resetFormState() {
  title.value = ''
  description.value = ''
  blocks.value = []
  selectedAno.value = ''
  selectedDisc.value = ''
  errors.value = {}
  showErrors.value = false
  previewMode.value = false
  blockIdCounter = 0
  clearDraft()
}

function save() {
  showErrors.value = true
  if (!validate()) {
    const firstError = document.querySelector('.fieldError')
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  isSaving.value = true

  const questoes = blocks.value
    .filter((b) => b.type === 'question')
    .map((b) => ({ enunciado: b.enunciado, tipo: b.tipo }))

  const payload = {
    title: title.value.trim(),
    desc: description.value.trim(),
    ano: selectedAno.value,
    blocks: JSON.parse(JSON.stringify(blocks.value)),
    questoes,
  }

  if (isEditMode.value) {
    editAtividade(props.disciplinaId, props.atividadeId, payload)
    setTimeout(() => {
      router.push(`/atividade/${props.disciplinaId}/${props.atividadeId}`)
    }, 400)
  } else {
    addAtividade(selectedDisc.value, payload)
    clearDraft()
    setTimeout(() => {
      resetFormState()
      isSaving.value = false
    }, 400)
  }
}

function resetForm() {
  if (hasChanges.value && !confirm('Tem certeza que deseja limpar tudo? O rascunho será perdido.')) return
  resetFormState()
}

watch([title, description, selectedAno, selectedDisc, blocks], () => {
  if (hasChanges.value) saveDraft()
}, { deep: true })

onBeforeUnmount(() => {
  if (!isEditMode.value && hasChanges.value) saveDraft()
})

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
    markdown: 'mdi-language-markdown',
    heading: 'mdi-format-header-1',
    code: 'mdi-code-tags',
    image: 'mdi-image-outline',
    list: 'mdi-format-list-bulleted',
    divider: 'mdi-minus',
    question: 'mdi-frequently-asked-questions',
  }
  return map[type] || 'mdi-help-circle-outline'
}

function getBlockLabel(type) {
  return blockTypes.find((b) => b.type === type)?.label || type
}
</script>

<template>
  <div class="createView">
    <div class="pageDeco">
      <div class="pageDecoOrb pageDecoOrb1"></div>
      <div class="pageDecoOrb pageDecoOrb2"></div>
      <div class="pageDecoDots"></div>
      <div class="pageDecoGrid"></div>
    </div>

    <div class="createContent">
      <div class="createHeader animate-fade-in-up">
        <button class="backBtn" @click="router.back()">
          <i class="mdi mdi-arrow-left"></i>
        </button>
        <div class="headerInfo">
          <h1 class="pageTitle">{{ isEditMode ? 'Editar Atividade' : 'Criar Atividade' }}</h1>
          <p class="pageDesc">{{ isEditMode ? 'Altere os blocos e salve as mudanças.' : 'Monte a atividade com blocos de conteúdo.' }}</p>
        </div>
        <div class="headerActions">
          <span class="blockCounter" v-if="blockCount > 0">
            <i class="mdi mdi-cube-outline"></i>
            {{ blockCount }} bloco{{ blockCount !== 1 ? 's' : '' }}
          </span>
          <button class="previewToggle" :class="{ active: previewMode }" @click="previewMode = !previewMode">
            <i :class="previewMode ? 'mdi mdi-pencil' : 'mdi mdi-eye-outline'"></i>
            {{ previewMode ? 'Editar' : 'Visualizar' }}
          </button>
          <button class="saveBtn" @click="save" :disabled="isSaving">
            <i :class="isSaving ? 'mdi mdi-loading mdi-spin' : 'mdi mdi-content-save-outline'"></i>
            {{ isSaving ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Salvar') }}
          </button>
        </div>
      </div>

      <Transition name="error-banner">
        <div v-if="showErrors && Object.keys(errors).length > 0" class="errorBanner animate-fade-in-up">
          <div class="errorBannerIcon">
            <i class="mdi mdi-alert-circle-outline"></i>
          </div>
          <div class="errorBannerText">
            <strong>Corrija os erros antes de salvar</strong>
            <p>{{ Object.keys(errors).length }} campo{{ Object.keys(errors).length > 1 ? 's' : '' }} precisa{{ Object.keys(errors).length === 1 ? '' : 'm' }} de atenção.</p>
          </div>
        </div>
      </Transition>

      <div v-if="draft && hasChanges" class="draftBanner animate-fade-in-up">
        <i class="mdi mdi-history"></i>
        <span>Rascunho restaurado automaticamente.</span>
        <button class="draftDismiss" @click="clearDraft">Dispensar</button>
      </div>

      <div class="formCard animate-fade-in-up delay-1">
        <div class="cardColorBar"></div>

        <div class="formBody">
          <div class="fieldGroup">
            <input
              v-model="title"
              type="text"
              class="titleInput"
              :class="{ 'hasError': showErrors && errors.title }"
              placeholder="Título da atividade"
            />
            <Transition name="field-error">
              <span v-if="showErrors && errors.title" class="fieldError">
                <i class="mdi mdi-alert-circle-outline"></i>
                {{ errors.title }}
              </span>
            </Transition>
          </div>

          <input
            v-model="description"
            type="text"
            class="descInput"
            placeholder="Descrição (opcional)"
          />

          <div class="formMeta">
            <div class="metaField">
              <label class="metaLabel">
                <i class="mdi mdi-calendar-outline"></i>
                Ano
              </label>
              <select
                v-model="selectedAno"
                class="metaSelect"
                :class="{ 'hasError': showErrors && errors.ano }"
              >
                <option value="">Selecione...</option>
                <option v-for="ano in anosList" :key="ano.id" :value="ano.id">{{ ano.label }}</option>
              </select>
              <Transition name="field-error">
                <span v-if="showErrors && errors.ano" class="fieldError">
                  <i class="mdi mdi-alert-circle-outline"></i>
                  {{ errors.ano }}
                </span>
              </Transition>
            </div>
            <div class="metaField">
              <label class="metaLabel">
                <i class="mdi mdi-book-outline"></i>
                Disciplina
              </label>
              <select
                v-model="selectedDisc"
                class="metaSelect"
                :class="{ 'hasError': showErrors && errors.disc }"
                :disabled="!selectedAno"
              >
                <option value="">Selecione...</option>
                <option v-for="disc in disciplinasDoAno" :key="disc.id" :value="disc.id">{{ disc.name }}</option>
              </select>
              <Transition name="field-error">
                <span v-if="showErrors && errors.disc" class="fieldError">
                  <i class="mdi mdi-alert-circle-outline"></i>
                  {{ errors.disc }}
                </span>
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!previewMode" class="blocksSection animate-fade-in-up delay-2">
        <div v-if="showErrors && errors.blocks" class="blocksError animate-fade-in-up">
          <i class="mdi mdi-alert-circle-outline"></i>
          {{ errors.blocks }}
        </div>

        <div v-if="blocks.length === 0" class="emptyBlocks">
          <div class="emptyBlocksIcon">
            <i class="mdi mdi-cube-outline"></i>
          </div>
          <h3>Nenhum bloco ainda</h3>
          <p>Adicione blocos de texto, código, imagens e questões para montar sua atividade.</p>
          <button class="addBtnBig" @click="openAddMenu(blocks.length)">
            <i class="mdi mdi-plus-circle-outline"></i>
            Adicionar primeiro bloco
          </button>
        </div>

        <template v-else>
          <TransitionGroup name="block" tag="div" class="blocksList">
            <div
              v-for="(block, idx) in blocks"
              :key="block.id"
              class="blockWrapper"
            >
              <div class="blockActions">
                <button class="blockAction" title="Mover para cima" @click="moveBlock(idx, -1)" :disabled="idx === 0">
                  <i class="mdi mdi-chevron-up"></i>
                </button>
                <button class="blockAction" title="Mover para baixo" @click="moveBlock(idx, 1)" :disabled="idx === blocks.length - 1">
                  <i class="mdi mdi-chevron-down"></i>
                </button>
                <button class="blockAction" title="Duplicar" @click="duplicateBlock(idx)">
                  <i class="mdi mdi-content-copy"></i>
                </button>
                <button class="blockAction blockActionDelete" title="Remover" @click="removeBlock(idx)">
                  <i class="mdi mdi-delete-outline"></i>
                </button>
              </div>

              <div class="blockCard" :class="`block-${block.type}`">
                <div class="blockCardHeader">
                  <div class="blockTypeBadge">
                    <i :class="`mdi ${getBlockIcon(block.type)}`"></i>
                    {{ getBlockLabel(block.type) }}
                  </div>
                  <span v-if="block.type === 'question'" class="blockNumber">
                    #{{ idx + 1 }}
                  </span>
                </div>

                <template v-if="block.type === 'text'">
                  <textarea
                    v-model="block.content"
                    class="blockTextarea"
                    placeholder="Escreva o texto aqui...&#10;&#10;Texto simples sem formatação."
                    rows="4"
                  ></textarea>
                  <div class="blockMeta">
                    <span class="charCount">{{ block.content?.length || 0 }} caracteres</span>
                  </div>
                </template>

                <template v-else-if="block.type === 'markdown'">
                  <textarea
                    v-model="block.content"
                    class="blockTextarea"
                    placeholder="Escreva em Markdown...&#10;&#10;**negrito**, *itálico*, `código`&#10;&#10;# Título&#10;- Lista"
                    rows="4"
                  ></textarea>
                  <div class="blockMeta">
                    <span class="charCount">{{ block.content?.length || 0 }} caracteres</span>
                  </div>
                  <div class="blockPreview" v-if="block.content">
                    <div class="mdRender" v-html="renderMarkdown(block.content)"></div>
                  </div>
                </template>

                <template v-else-if="block.type === 'heading'">
                  <div class="headingRow">
                    <select v-model="block.level" class="headingLevel">
                      <option :value="1">H1</option>
                      <option :value="2">H2</option>
                      <option :value="3">H3</option>
                    </select>
                    <input
                      v-model="block.content"
                      class="headingInput"
                      :placeholder="`Título nível ${block.level}`"
                    />
                  </div>
                </template>

                <template v-else-if="block.type === 'code'">
                  <div class="codeHeader">
                    <select v-model="block.language" class="langSelect">
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="sql">SQL</option>
                      <option value="java">Java</option>
                      <option value="c">C</option>
                      <option value="php">PHP</option>
                      <option value="markdown">Markdown</option>
                      <option value="plaintext">Texto</option>
                    </select>
                  </div>
                  <textarea
                    v-model="block.content"
                    class="codeTextarea"
                    placeholder="// Cole ou escreva o código aqui..."
                    rows="6"
                    spellcheck="false"
                  ></textarea>
                </template>

                <template v-else-if="block.type === 'image'">
                  <input
                    v-model="block.url"
                    class="blockInput"
                    placeholder="URL da imagem (https://...)"
                  />
                  <input
                    v-model="block.alt"
                    class="blockInput blockInputSecondary"
                    placeholder="Texto alternativo (opcional)"
                  />
                  <div v-if="block.url" class="imagePreview">
                    <img :src="block.url" :alt="block.alt || 'Preview'" @error="$event.target.style.display='none'" />
                  </div>
                </template>

                <template v-else-if="block.type === 'list'">
                  <div class="listControls">
                    <button class="listTypeBtn" :class="{ active: !block.ordered }" @click="block.ordered = false">
                      <i class="mdi mdi-format-list-bulleted"></i>
                      Marcadores
                    </button>
                    <button class="listTypeBtn" :class="{ active: block.ordered }" @click="block.ordered = true">
                      <i class="mdi mdi-format-list-numbered"></i>
                      Numerada
                    </button>
                  </div>
                  <div class="listItems">
                    <div v-for="(item, i) in block.items" :key="i" class="listItemRow">
                      <span class="listMarker">{{ block.ordered ? `${i + 1}.` : '•' }}</span>
                      <input
                        v-model="block.items[i]"
                        class="listItemInput"
                        :placeholder="`Item ${i + 1}`"
                        @keydown.enter="addListItem(block)"
                      />
                      <button class="listItemRemove" @click="removeListItem(block, i)" :disabled="block.items.length <= 1">
                        <i class="mdi mdi-close"></i>
                      </button>
                    </div>
                    <button class="addListItemBtn" @click="addListItem(block)">
                      <i class="mdi mdi-plus"></i>
                      Adicionar item
                    </button>
                  </div>
                </template>

                <template v-else-if="block.type === 'divider'">
                  <div class="dividerPreview">
                    <hr />
                  </div>
                </template>

                <template v-else-if="block.type === 'question'">
                  <textarea
                    v-model="block.enunciado"
                    class="blockTextarea"
                    placeholder="Escreva o enunciado da questão..."
                    rows="3"
                  ></textarea>
                  <div class="blockMeta">
                    <span class="charCount">{{ block.enunciado?.length || 0 }} caracteres</span>
                  </div>
                  <div class="questionTypeRow">
                    <button
                      class="tipoBtn"
                      :class="{ active: block.tipo === 'exercicio' }"
                      @click="block.tipo = 'exercicio'"
                    >
                      <i class="mdi mdi-pencil-outline"></i>
                      Exercício
                    </button>
                    <button
                      class="tipoBtn"
                      :class="{ active: block.tipo === 'teorica' }"
                      @click="block.tipo = 'teorica'"
                    >
                      <i class="mdi mdi-text-box-outline"></i>
                      Teórica
                    </button>
                  </div>
                  <div class="blockPreview" v-if="block.enunciado">
                    <div class="mdRender" v-html="renderMarkdown(block.enunciado)"></div>
                  </div>
                </template>
              </div>

              <div class="addBlockBetween">
                <button class="addBtnSmall" @click="openAddMenu(idx)" title="Adicionar bloco aqui">
                  <i class="mdi mdi-plus"></i>
                </button>
                <div class="addLine"></div>
              </div>
            </div>
          </TransitionGroup>

          <div class="addBlockEnd">
            <button class="addBtnBig" @click="openAddMenu(blocks.length)">
              <i class="mdi mdi-plus-circle-outline"></i>
              Adicionar bloco
            </button>
          </div>

          <div class="formFooter">
            <div class="formStats">
              <span><i class="mdi mdi-cube-outline"></i> {{ blockCount }} bloco{{ blockCount !== 1 ? 's' : '' }}</span>
              <span v-if="questionCount > 0"><i class="mdi mdi-frequently-asked-questions"></i> {{ questionCount }} questão{{ questionCount !== 1 ? 'ões' : '' }}</span>
              <span><i class="mdi mdi-text"></i> {{ textLength }} caracteres</span>
            </div>
            <div class="formFooterActions">
              <button class="resetBtn" @click="resetForm">
                <i class="mdi mdi-refresh"></i>
                Limpar tudo
              </button>
              <button class="saveBtn saveBtnBottom" @click="save" :disabled="isSaving">
                <i :class="isSaving ? 'mdi mdi-loading mdi-spin' : 'mdi mdi-content-save-outline'"></i>
                {{ isSaving ? 'Salvando...' : 'Salvar Atividade' }}
              </button>
            </div>
          </div>
        </template>

        <Transition name="fade">
          <div v-if="showAddMenu" class="addMenuOverlay" @click.self="closeAddMenu">
            <div class="addMenu animate-scale-in">
              <div class="addMenuHeader">
                <h3>Adicionar bloco</h3>
                <button class="closeMenuBtn" @click="closeAddMenu">
                  <i class="mdi mdi-close"></i>
                </button>
              </div>
              <div class="addMenuGrid">
                <button
                  v-for="bt in blockTypes"
                  :key="bt.type"
                  class="addMenuItem"
                  @click="addBlock(bt.type, addMenuIdx)"
                >
                  <div class="addMenuIcon">
                    <i :class="`mdi ${bt.icon}`"></i>
                  </div>
                  <div class="addMenuText">
                    <span class="addMenuLabel">{{ bt.label }}</span>
                    <span class="addMenuDesc">{{ bt.desc }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div v-else class="previewSection animate-fade-in-up delay-2">
        <div v-if="!title && !blocks.length" class="emptyPreview">
          <div class="emptyIcon">
            <i class="mdi mdi-eye-off-outline"></i>
          </div>
          <h3>Nada para visualizar</h3>
          <p>Adicione blocos para ver a pré-visualização.</p>
        </div>

        <div v-else class="previewCard">
          <div class="cardColorBar"></div>
          <div class="previewBody">
            <h1 v-if="title" class="previewTitle">{{ title }}</h1>
            <p v-if="description" class="previewDesc">{{ description }}</p>
            <div v-if="selectedAno || selectedDisc" class="previewMeta">
              <span v-if="selectedAno" class="previewTag">
                {{ anos[selectedAno]?.label }}
              </span>
              <span v-if="selectedDisc" class="previewTag previewTagDisc">
                {{ disciplinasDoAno.find(d => d.id === selectedDisc)?.name }}
              </span>
            </div>

            <div class="previewBlocks">
              <template v-for="(block, idx) in blocks" :key="block.id">
                <div v-if="block.type === 'text'" class="previewBlock">
                  <p class="previewPlainText">{{ block.content }}</p>
                </div>

                <div v-else-if="block.type === 'markdown'" class="previewBlock">
                  <div class="mdRender" v-html="renderMarkdown(block.content)"></div>
                </div>

                <div v-else-if="block.type === 'heading'" class="previewBlock">
                  <component :is="`h${block.level}`">{{ block.content }}</component>
                </div>

                <div v-else-if="block.type === 'code'" class="previewBlock">
                  <div class="previewCodeBlock">
                    <div class="previewCodeLang">{{ block.language }}</div>
                    <pre class="previewCode"><code>{{ block.content }}</code></pre>
                  </div>
                </div>

                <div v-else-if="block.type === 'image' && block.url" class="previewBlock">
                  <img :src="block.url" :alt="block.alt || ''" class="previewImage" />
                  <p v-if="block.alt" class="previewImageAlt">{{ block.alt }}</p>
                </div>

                <div v-else-if="block.type === 'list'" class="previewBlock">
                  <component :is="block.ordered ? 'ol' : 'ul'" class="previewList">
                    <li v-for="(item, i) in block.items.filter(Boolean)" :key="i">{{ item }}</li>
                  </component>
                </div>

                <div v-else-if="block.type === 'divider'" class="previewBlock">
                  <hr class="previewHr" />
                </div>

                <div v-else-if="block.type === 'question'" class="previewBlock previewQuestion">
                  <div class="previewQuestionBadge" :class="block.tipo">
                    {{ block.tipo === 'exercicio' ? 'Exercício' : 'Teórica' }}
                  </div>
                  <div class="mdRender" v-html="renderMarkdown(block.enunciado)"></div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.createView {
  position: relative;
  min-height: calc(100vh - var(--header-h));
}

.createContent {
  position: relative;
  z-index: 1;
  max-width: 780px;
  margin: 0 auto;
  padding: var(--sp-8) var(--sp-6);
}

.createHeader {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  margin-bottom: var(--sp-6);
}

.headerInfo {
  flex: 1;
  min-width: 0;
}

.pageTitle {
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--color-text-1);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--sp-1);
}

.pageDesc {
  font-size: var(--text-sm);
  color: var(--color-text-4);
}

.headerActions {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-shrink: 0;
}

.blockCounter {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--radius-full);
  background: var(--color-surface-3);
  color: var(--color-text-4);
  font-size: var(--text-xs);
  font-weight: 600;
}

.previewToggle {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-2);
  background: var(--color-surface-2);
  color: var(--color-text-3);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.previewToggle:hover {
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
}

.previewToggle.active {
  background: var(--color-navy-accent);
  border-color: var(--color-navy-accent);
  color: #ffffff;
}

.saveBtn {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-5);
  border-radius: var(--radius-md);
  border: none;
  background: var(--color-navy-accent);
  color: #ffffff;
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-spring);
}

.saveBtn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(74, 111, 165, 0.3);
}

.saveBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.errorBanner {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-4) var(--sp-5);
  border-radius: var(--radius-lg);
  background: var(--color-danger-muted);
  border: 1px solid rgba(248, 113, 113, 0.2);
  margin-bottom: var(--sp-4);
}

.errorBannerIcon {
  flex-shrink: 0;
}

.errorBannerIcon i {
  font-size: 1.5rem;
  color: var(--color-danger);
}

.errorBannerText strong {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-danger);
}

.errorBannerText p {
  font-size: var(--text-xs);
  color: var(--color-text-4);
  margin-top: 2px;
}

.draftBanner {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
  background: var(--color-info-muted);
  border: 1px solid rgba(96, 165, 250, 0.15);
  margin-bottom: var(--sp-4);
  font-size: var(--text-xs);
  color: var(--color-info);
}

.draftBanner i {
  flex-shrink: 0;
}

.draftDismiss {
  margin-left: auto;
  background: none;
  border: none;
  color: var(--color-info);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.fieldGroup {
  margin-bottom: var(--sp-3);
}

.fieldError {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-danger);
  margin-top: var(--sp-1);
}

.fieldError i {
  font-size: 0.85rem;
}

.hasError {
  border-color: var(--color-danger) !important;
}

.hasError:focus {
  box-shadow: 0 0 0 3px var(--color-danger-muted) !important;
}

.blocksError {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
  background: var(--color-danger-muted);
  color: var(--color-danger);
  font-size: var(--text-sm);
  font-weight: 600;
  margin-bottom: var(--sp-4);
}

.emptyBlocks {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
  text-align: center;
  padding: var(--sp-16) var(--sp-6);
  border-radius: var(--radius-xl);
  background: var(--color-surface-2);
  border: 2px dashed var(--color-border-2);
}

.emptyBlocksIcon {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background: var(--color-surface-3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.emptyBlocksIcon i {
  font-size: 2rem;
  color: var(--color-text-5);
}

.emptyBlocks h3 {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-1);
}

.emptyBlocks p {
  font-size: var(--text-sm);
  color: var(--color-text-4);
  max-width: 380px;
}

.toast {
  position: fixed;
  bottom: var(--sp-8);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-6);
  border-radius: var(--radius-lg);
  background: var(--color-success);
  color: #ffffff;
  font-size: var(--text-sm);
  font-weight: 600;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
}

.toast i {
  font-size: 1.2rem;
}

.formCard {
  border-radius: var(--radius-xl);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  overflow: hidden;
  margin-bottom: var(--sp-6);
  position: relative;
}

.cardColorBar {
  height: 10px;
  background: linear-gradient(90deg, var(--color-navy-accent), var(--color-navy-lighter));
}

.formBody {
  padding: var(--sp-6);
}

.titleInput {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-1);
  font-family: var(--font-sans);
  padding: var(--sp-2) 0;
  border-bottom: 2px solid var(--color-border-1);
  transition: border-color var(--duration-fast) var(--ease-out);
  margin-bottom: var(--sp-1);
}

.titleInput:focus {
  border-bottom-color: var(--color-navy-accent);
}

.titleInput::placeholder {
  color: var(--color-text-5);
}

.descInput {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--text-base);
  color: var(--color-text-3);
  font-family: var(--font-sans);
  padding: var(--sp-2) 0;
  margin-bottom: var(--sp-4);
}

.descInput::placeholder {
  color: var(--color-text-5);
}

.formMeta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-4);
}

.metaField {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.metaLabel {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-4);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
}

.metaLabel i {
  font-size: 0.95rem;
  color: var(--color-navy-accent);
}

.metaSelect {
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-2);
  background: var(--color-surface);
  color: var(--color-text-1);
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239ca3af'%3E%3Cpath d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: var(--sp-8);
}

.metaSelect:focus {
  outline: none;
  border-color: var(--color-navy-accent);
  box-shadow: 0 0 0 3px var(--color-navy-accent-muted);
}

.metaSelect:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.blocksSection {
  position: relative;
}

.blocksList {
  display: flex;
  flex-direction: column;
}

.blockWrapper {
  position: relative;
}

.blockActions {
  position: absolute;
  left: -52px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.blockWrapper:hover .blockActions {
  opacity: 1;
}

.blockAction {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-2);
  background: var(--color-surface-2);
  color: var(--color-text-4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  font-size: 1rem;
}

.blockAction:hover {
  background: var(--color-navy-accent-muted);
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
}

.blockAction:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.blockActionDelete:hover {
  background: var(--color-danger-muted);
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.blockCard {
  border-radius: var(--radius-lg);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  padding: var(--sp-5);
  transition: all var(--duration-fast) var(--ease-out);
}

.blockCard:hover {
  border-color: var(--color-border-2);
  box-shadow: var(--shadow-sm);
}

.blockCardHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-3);
}

.blockTypeBadge {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--radius-full);
  background: var(--color-navy-accent-muted);
  color: var(--color-navy-accent);
  font-size: var(--text-xs);
  font-weight: 600;
}

.blockTypeBadge i {
  font-size: 0.85rem;
}

.blockNumber {
  font-size: var(--text-xs);
  color: var(--color-text-5);
  font-weight: 600;
}

.blockMeta {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--sp-1);
}

.charCount {
  font-size: 0.7rem;
  color: var(--color-text-5);
}

.blockTextarea,
.blockInput {
  width: 100%;
  border: 1px solid var(--color-border-2);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-1);
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  padding: var(--sp-3) var(--sp-4);
  resize: vertical;
  transition: all var(--duration-fast) var(--ease-out);
  line-height: var(--leading-relaxed);
}

.blockTextarea:focus,
.blockInput:focus {
  outline: none;
  border-color: var(--color-navy-accent);
  box-shadow: 0 0 0 3px var(--color-navy-accent-muted);
}

.blockTextarea::placeholder,
.blockInput::placeholder {
  color: var(--color-text-5);
}

.blockInputSecondary {
  margin-top: var(--sp-2);
}

.blockPreview {
  margin-top: var(--sp-3);
  padding: var(--sp-4);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border-1);
}

.headingRow {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.headingLevel {
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-2);
  background: var(--color-surface);
  color: var(--color-navy-accent);
  font-size: var(--text-sm);
  font-weight: 700;
  font-family: var(--font-sans);
  cursor: pointer;
}

.headingInput {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text-1);
  font-family: var(--font-sans);
  padding: var(--sp-2) 0;
  border-bottom: 2px solid var(--color-border-1);
  transition: border-color var(--duration-fast) var(--ease-out);
}

.headingInput:focus {
  border-bottom-color: var(--color-navy-accent);
}

.codeHeader {
  margin-bottom: var(--sp-2);
}

.langSelect {
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-2);
  background: var(--color-surface);
  color: var(--color-text-2);
  font-size: var(--text-xs);
  font-family: var(--font-sans);
  cursor: pointer;
}

.codeTextarea {
  width: 100%;
  border: 1px solid var(--color-border-2);
  border-radius: var(--radius-md);
  background: var(--color-navy);
  color: #e2e8f0;
  font-size: var(--text-sm);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  padding: var(--sp-4);
  resize: vertical;
  line-height: 1.6;
  tab-size: 2;
}

.codeTextarea:focus {
  outline: none;
  border-color: var(--color-navy-accent);
  box-shadow: 0 0 0 3px var(--color-navy-accent-muted);
}

.imagePreview {
  margin-top: var(--sp-3);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border-1);
}

.imagePreview img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  display: block;
}

.listControls {
  display: flex;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}

.listTypeBtn {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-2);
  background: var(--color-surface);
  color: var(--color-text-4);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.listTypeBtn.active {
  background: var(--color-navy-accent-muted);
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
}

.listItems {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.listItemRow {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.listMarker {
  font-size: var(--text-sm);
  color: var(--color-text-4);
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.listItemInput {
  flex: 1;
  border: 1px solid var(--color-border-2);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-1);
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  padding: var(--sp-2) var(--sp-3);
  transition: all var(--duration-fast) var(--ease-out);
}

.listItemInput:focus {
  outline: none;
  border-color: var(--color-navy-accent);
  box-shadow: 0 0 0 3px var(--color-navy-accent-muted);
}

.listItemRemove {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  color: var(--color-text-5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  flex-shrink: 0;
}

.listItemRemove:hover:not(:disabled) {
  background: var(--color-danger-muted);
  color: var(--color-danger);
}

.listItemRemove:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.addListItemBtn {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  border: 1px dashed var(--color-border-2);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-5);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.addListItemBtn:hover {
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
  background: var(--color-navy-accent-muted);
}

.dividerPreview {
  padding: var(--sp-2) 0;
}

.dividerPreview hr {
  border: none;
  height: 1px;
  background: var(--color-border-2);
}

.questionTypeRow {
  display: flex;
  gap: var(--sp-2);
  margin-top: var(--sp-3);
}

.tipoBtn {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border-2);
  background: var(--color-surface);
  color: var(--color-text-4);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.tipoBtn.active {
  background: var(--color-navy-accent-muted);
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
}

.addBlockBetween {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-2) 0;
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.blockWrapper:hover + .blockWrapper .addBlockBetween,
.addBlockBetween:hover {
  opacity: 1;
}

.addBtnSmall {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  border: 1px dashed var(--color-border-2);
  background: var(--color-surface-2);
  color: var(--color-text-5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  transition: all var(--duration-fast) var(--ease-out);
}

.addBtnSmall:hover {
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
  background: var(--color-navy-accent-muted);
  transform: scale(1.1);
}

.addLine {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background: var(--color-border-1);
}

.addBlockEnd {
  display: flex;
  justify-content: center;
  padding: var(--sp-6) 0 var(--sp-2);
}

.addBtnBig {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-6);
  border-radius: var(--radius-full);
  border: 2px dashed var(--color-border-2);
  background: transparent;
  color: var(--color-text-4);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-spring);
}

.addBtnBig:hover {
  border-color: var(--color-navy-accent);
  color: var(--color-navy-accent);
  background: var(--color-navy-accent-muted);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.addBtnBig i {
  font-size: 1.2rem;
}

.formFooter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-5) 0;
  border-top: 1px solid var(--color-border-1);
  margin-top: var(--sp-4);
}

.formStats {
  display: flex;
  gap: var(--sp-4);
}

.formStats span {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  font-size: var(--text-xs);
  color: var(--color-text-5);
  font-weight: 500;
}

.formStats i {
  font-size: 0.85rem;
  color: var(--color-navy-accent);
}

.formFooterActions {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.resetBtn {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-2);
  background: transparent;
  color: var(--color-text-4);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.resetBtn:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: var(--color-danger-muted);
}

.saveBtnBottom {
  padding: var(--sp-3) var(--sp-6);
}

.addMenuOverlay {
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

.addMenu {
  width: 100%;
  max-width: 480px;
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border-2);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.addMenuHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-5) var(--sp-6);
  border-bottom: 1px solid var(--color-border-1);
}

.addMenuHeader h3 {
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-text-1);
}

.closeMenuBtn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  color: var(--color-text-4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.closeMenuBtn:hover {
  background: var(--color-surface-3);
  color: var(--color-text-1);
}

.addMenuGrid {
  padding: var(--sp-3);
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.addMenuItem {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  text-align: left;
}

.addMenuItem:hover {
  background: var(--color-navy-accent-muted);
}

.addMenuIcon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--color-surface-3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--duration-fast) var(--ease-spring);
}

.addMenuItem:hover .addMenuIcon {
  background: var(--color-navy-accent);
  transform: scale(1.08) rotate(-3deg);
}

.addMenuIcon i {
  font-size: 1.1rem;
  color: var(--color-text-3);
  transition: color var(--duration-fast) var(--ease-out);
}

.addMenuItem:hover .addMenuIcon i {
  color: #ffffff;
}

.addMenuText {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.addMenuLabel {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-1);
}

.addMenuDesc {
  font-size: var(--text-xs);
  color: var(--color-text-5);
}

.emptyPreview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
  text-align: center;
  padding: var(--sp-16) var(--sp-6);
  border-radius: var(--radius-xl);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
}

.emptyIcon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background: var(--color-surface-3);
  border: 1px dashed var(--color-border-2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.emptyIcon i {
  font-size: 1.8rem;
  color: var(--color-text-5);
}

.emptyPreview h3 {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-1);
}

.emptyPreview p {
  font-size: var(--text-sm);
  color: var(--color-text-4);
}

.previewCard {
  border-radius: var(--radius-xl);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  overflow: hidden;
}

.previewBody {
  padding: var(--sp-8) var(--sp-8);
}

.previewTitle {
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-text-1);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--sp-2);
}

.previewDesc {
  font-size: var(--text-base);
  color: var(--color-text-4);
  margin-bottom: var(--sp-4);
}

.previewMeta {
  display: flex;
  gap: var(--sp-2);
  margin-bottom: var(--sp-6);
}

.previewTag {
  display: inline-flex;
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--radius-full);
  background: var(--color-navy-accent-muted);
  color: var(--color-navy-accent);
  font-size: var(--text-xs);
  font-weight: 600;
}

.previewBlocks {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}

.previewBlock {
  font-size: var(--text-base);
  color: var(--color-text-2);
  line-height: var(--leading-relaxed);
}

.previewPlainText {
  white-space: pre-wrap;
}

.previewCodeBlock {
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border-2);
}

.previewCodeLang {
  padding: var(--sp-2) var(--sp-4);
  background: var(--color-navy);
  color: var(--color-text-5);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
}

.previewCode {
  margin: 0;
  padding: var(--sp-4);
  background: var(--color-surface);
  overflow-x: auto;
}

.previewCode code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: var(--text-sm);
  color: var(--color-text-2);
  line-height: 1.6;
}

.previewImage {
  width: 100%;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-1);
}

.previewImageAlt {
  font-size: var(--text-sm);
  color: var(--color-text-5);
  text-align: center;
  margin-top: var(--sp-2);
  font-style: italic;
}

.previewList {
  padding-left: var(--sp-6);
}

.previewList li {
  margin-bottom: var(--sp-2);
}

.previewHr {
  border: none;
  height: 1px;
  background: var(--color-border-2);
  margin: var(--sp-4) 0;
}

.previewQuestion {
  padding: var(--sp-5);
  border-radius: var(--radius-lg);
  background: var(--color-surface-3);
  border-left: 3px solid var(--color-navy-accent);
}

.previewQuestionBadge {
  display: inline-flex;
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  margin-bottom: var(--sp-3);
}

.previewQuestionBadge.exercicio {
  background: var(--color-navy-accent-muted);
  color: var(--color-navy-accent);
}

.previewQuestionBadge.teorica {
  background: var(--color-surface-4);
  color: var(--color-text-3);
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

.error-banner-enter-active {
  transition: all 0.3s var(--ease-spring);
}

.error-banner-leave-active {
  transition: all 0.2s var(--ease-out);
}

.error-banner-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.error-banner-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.field-error-enter-active {
  transition: all 0.25s var(--ease-spring);
}

.field-error-leave-active {
  transition: all 0.15s var(--ease-out);
}

.field-error-enter-from {
  opacity: 0;
  transform: translateY(-4px);
  max-height: 0;
}

.field-error-leave-to {
  opacity: 0;
  max-height: 0;
}

.block-enter-active {
  transition: all 0.4s var(--ease-spring);
}

.block-leave-active {
  transition: all 0.25s var(--ease-out);
}

.block-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

.block-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.block-move {
  transition: transform 0.3s var(--ease-spring);
}

@media (max-width: 768px) {
  .createHeader {
    flex-wrap: wrap;
  }

  .headerActions {
    width: 100%;
    justify-content: flex-end;
  }

  .formMeta {
    grid-template-columns: 1fr;
  }

  .blockActions {
    left: -4px;
    top: -4px;
    transform: none;
    flex-direction: row;
    opacity: 1;
  }

  .previewBody {
    padding: var(--sp-5);
  }

  .formFooter {
    flex-direction: column;
    gap: var(--sp-4);
    align-items: stretch;
  }

  .formStats {
    justify-content: center;
  }

  .formFooterActions {
    justify-content: stretch;
  }

  .saveBtnBottom {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .pageTitle {
    font-size: var(--text-xl);
  }

  .previewTitle {
    font-size: var(--text-2xl);
  }
}
</style>
