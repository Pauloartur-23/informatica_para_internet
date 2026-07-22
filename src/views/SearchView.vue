<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { searchAtividades, anos } from '../data/disciplinas.js'

const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.query.q || '')
const results = computed(() => searchAtividades(searchQuery.value))
const hasSearched = computed(() => searchQuery.value.trim().length >= 2)
const isFocused = ref(false)

function doSearch() {
  const q = searchQuery.value.trim()
  if (q.length >= 2) {
    router.replace({ query: { q } })
  } else {
    router.replace({ query: {} })
  }
}

function clearSearch() {
  searchQuery.value = ''
  router.replace({ query: {} })
}

watch(
  () => route.query.q,
  (val) => {
    if (val && val !== searchQuery.value) {
      searchQuery.value = val
    }
  },
)

const anosList = Object.entries(anos).map(([id, ano]) => ({
  id,
  label: ano.label,
  desc: ano.desc,
  icon: id === '1' ? 'mdi-numeric-1-box' : id === '2' ? 'mdi-numeric-2-box' : 'mdi-numeric-3-box',
  disciplinas: ano.disciplinas,
}))
</script>

<template>
  <div class="searchView">
    <div class="pageDeco">
      <div class="pageDecoOrb pageDecoOrb1"></div>
      <div class="pageDecoOrb pageDecoOrb2"></div>
      <div class="pageDecoOrb pageDecoOrb3"></div>
      <div class="pageDecoDots"></div>
      <div class="pageDecoGrid"></div>
    </div>

    <div class="searchContent">
      <div class="searchHero animate-fade-in-up">
        <div class="heroIcon" :class="{ focused: isFocused }">
          <i class="mdi mdi-magnify"></i>
        </div>
        <h1 class="heroTitle">Buscar</h1>
        <p class="heroDesc">Pesquise por disciplinas ou navegue pelos anos do curso.</p>
      </div>

      <form class="searchBar animate-fade-in-up delay-1" @submit.prevent="doSearch">
        <div class="searchInputWrap" :class="{ focused: isFocused }">
          <i class="mdi mdi-magnify searchIcon"></i>
          <input
            v-model="searchQuery"
            type="text"
            class="searchInput"
            placeholder="Buscar atividades..."
            autofocus
            @focus="isFocused = true"
            @blur="isFocused = false"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="clearBtn"
            @click="clearSearch"
          >
            <i class="mdi mdi-close"></i>
          </button>
        </div>
      </form>

      <div v-if="hasSearched" class="searchResults animate-fade-in-up delay-2">
        <div class="resultsHeader">
          <span class="resultsCount">
            {{ results.length }} resultado{{ results.length !== 1 ? 's' : '' }}
          </span>
        </div>

        <div v-if="results.length" class="resultsList">
          <RouterLink
            v-for="(r, idx) in results"
            :key="`${r.disciplina.id}-${r.atividade.id}`"
            :to="`/atividade/${r.disciplina.id}/${r.atividade.id}`"
            class="resultItem"
          >
            <div class="resultLeft">
              <div class="resultIcon">
                <i :class="`mdi ${r.disciplina.icon}`"></i>
              </div>
              <div class="resultInfo">
                <span class="resultBreadcrumb">{{ r.anoLabel }} / {{ r.disciplina.name }}</span>
                <h3 class="resultTitle">{{ r.atividade.title }}</h3>
                <p class="resultDesc">{{ r.atividade.desc }}</p>
              </div>
            </div>
            <i class="mdi mdi-chevron-right resultArrow"></i>
          </RouterLink>
        </div>

        <div v-else class="emptyResult">
          <div class="emptyIcon">
            <i class="mdi mdi-text-search"></i>
          </div>
          <h3>Nenhum resultado</h3>
          <p>Não encontramos nada para "<strong>{{ searchQuery }}</strong>". Tente outros termos.</p>
        </div>
      </div>

      <div v-else class="browseSection animate-fade-in-up delay-2">
        <h2 class="sectionTitle">Navegar por Ano</h2>

        <div class="anosGrid">
          <div
            v-for="(ano, idx) in anosList"
            :key="ano.id"
            class="anoBlock"
          >
            <RouterLink :to="`/ano/${ano.id}`" class="anoHeader">
              <div class="anoIcon">
                <i :class="`mdi ${ano.icon}`"></i>
              </div>
              <div class="anoInfo">
                <h3 class="anoLabel">{{ ano.label }}</h3>
                <p class="anoDesc">{{ ano.desc }}</p>
              </div>
              <i class="mdi mdi-chevron-right anoArrow"></i>
            </RouterLink>

            <div class="disciplinasList">
              <RouterLink
                v-for="disc in ano.disciplinas"
                :key="disc.id"
                :to="`/disciplina/${ano.id}/${disc.id}`"
                class="discLink"
              >
                <i :class="`mdi ${disc.icon}`"></i>
                <span>{{ disc.name }}</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.searchView {
  position: relative;
  min-height: calc(100vh - var(--header-h));
}

.searchContent {
  position: relative;
  z-index: 1;
  max-width: var(--max-w);
  margin: 0 auto;
  padding: var(--sp-10) var(--sp-6);
}

.searchHero {
  text-align: center;
  margin-bottom: var(--sp-8);
}

.heroIcon {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-xl);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--sp-6);
  transition: all var(--duration-normal) var(--ease-spring);
}

.heroIcon.focused {
  background: var(--color-navy-accent);
  border-color: var(--color-navy-accent);
  box-shadow: 0 0 32px rgba(74, 111, 165, 0.3);
  transform: scale(1.08);
}

.heroIcon i {
  font-size: 2rem;
  color: var(--color-navy-accent);
  transition: all var(--duration-normal) var(--ease-spring);
}

.heroIcon.focused i {
  color: #ffffff;
  transform: scale(1.1);
}

.heroTitle {
  font-size: var(--text-4xl);
  font-weight: 800;
  color: var(--color-text-1);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--sp-3);
}

.heroDesc {
  font-size: var(--text-base);
  color: var(--color-text-4);
  max-width: 400px;
  margin: 0 auto;
}

.searchBar {
  max-width: 600px;
  margin: 0 auto var(--sp-10);
}

.searchInputWrap {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-4) var(--sp-5);
  border-radius: var(--radius-xl);
  background: var(--color-surface-2);
  border: 2px solid var(--color-border-1);
  transition: all var(--duration-normal) var(--ease-spring);
}

.searchInputWrap.focused {
  border-color: var(--color-navy-accent);
  background: var(--color-surface);
  box-shadow: 0 0 0 4px var(--color-navy-accent-muted), var(--shadow-lg);
}

.searchIcon {
  font-size: 1.3rem;
  color: var(--color-text-5);
  flex-shrink: 0;
  transition: color var(--duration-fast) var(--ease-out);
}

.searchInputWrap.focused .searchIcon {
  color: var(--color-navy-accent);
}

.searchInput {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: var(--text-base);
  color: var(--color-text-1);
  font-family: var(--font-sans);
}

.searchInput::placeholder {
  color: var(--color-text-5);
}

.clearBtn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--color-surface-4);
  border: none;
  color: var(--color-text-4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-spring);
  flex-shrink: 0;
}

.clearBtn:hover {
  background: var(--color-danger-muted);
  color: var(--color-danger);
  transform: scale(1.1);
}

.resultsHeader {
  margin-bottom: var(--sp-4);
}

.resultsCount {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-4);
}

.resultsList {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.resultItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
  padding: var(--sp-5) var(--sp-6);
  border-radius: var(--radius-lg);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  text-decoration: none;
  transition: all var(--duration-normal) var(--ease-spring);
}

.resultItem:hover {
  background: var(--color-surface-3);
  border-color: var(--color-border-2);
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

.resultLeft {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-4);
  min-width: 0;
  flex: 1;
}

.resultIcon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--color-navy-accent-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--duration-normal) var(--ease-spring);
}

.resultIcon i {
  font-size: 1.1rem;
  color: var(--color-navy-accent);
}

.resultItem:hover .resultIcon {
  background: var(--color-navy-accent);
  transform: scale(1.08) rotate(-3deg);
  box-shadow: 0 0 16px rgba(74, 111, 165, 0.3);
}

.resultItem:hover .resultIcon i {
  color: #ffffff;
}

.resultInfo {
  min-width: 0;
  flex: 1;
}

.resultBreadcrumb {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-navy-accent);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  display: block;
  margin-bottom: var(--sp-1);
}

.resultTitle {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-text-1);
  margin-bottom: var(--sp-1);
}

.resultDesc {
  font-size: var(--text-sm);
  color: var(--color-text-4);
  line-height: var(--leading-normal);
}

.resultArrow {
  font-size: 1.2rem;
  color: var(--color-text-5);
  flex-shrink: 0;
  transition: all var(--duration-normal) var(--ease-spring);
}

.resultItem:hover .resultArrow {
  color: var(--color-navy-accent);
  transform: translateX(4px);
}

.emptyResult {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
  text-align: center;
  padding: var(--sp-16) var(--sp-6);
}

.emptyIcon {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background: var(--color-surface-3);
  border: 1px dashed var(--color-border-2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.emptyIcon i {
  font-size: 2rem;
  color: var(--color-text-5);
}

.emptyResult h3 {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-1);
}

.emptyResult p {
  font-size: var(--text-sm);
  color: var(--color-text-4);
}

.browseSection {
  max-width: 700px;
  margin: 0 auto;
}

.sectionTitle {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-1);
  margin-bottom: var(--sp-6);
  text-align: center;
}

.anosGrid {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}

.anoBlock {
  border-radius: var(--radius-xl);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-spring);
}

.anoBlock:hover {
  border-color: var(--color-border-2);
  box-shadow: var(--shadow-md);
}

.anoHeader {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-5) var(--sp-6);
  text-decoration: none;
  transition: background var(--duration-fast) var(--ease-out);
}

.anoHeader:hover {
  background: var(--color-surface-3);
}

.anoIcon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--color-navy-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--duration-normal) var(--ease-spring);
}

.anoIcon i {
  font-size: 1.4rem;
  color: #ffffff;
}

.anoHeader:hover .anoIcon {
  transform: scale(1.08) rotate(-3deg);
  box-shadow: 0 0 20px rgba(74, 111, 165, 0.4);
}

.anoInfo {
  flex: 1;
  min-width: 0;
}

.anoLabel {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-1);
  margin-bottom: var(--sp-1);
}

.anoDesc {
  font-size: var(--text-sm);
  color: var(--color-text-4);
  line-height: var(--leading-normal);
}

.anoArrow {
  font-size: 1.3rem;
  color: var(--color-text-5);
  flex-shrink: 0;
  transition: all var(--duration-normal) var(--ease-spring);
}

.anoHeader:hover .anoArrow {
  color: var(--color-navy-accent);
  transform: translateX(4px);
}

.disciplinasList {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1px;
  background: var(--color-border-1);
  border-top: 1px solid var(--color-border-1);
}

.discLink {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-6);
  background: var(--color-surface-2);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-3);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out);
}

.discLink:hover {
  background: var(--color-navy-accent-muted);
  color: var(--color-navy-accent);
}

.discLink i {
  font-size: 1.1rem;
  color: var(--color-text-5);
  transition: color var(--duration-fast) var(--ease-out);
}

.discLink:hover i {
  color: var(--color-navy-accent);
}

@media (max-width: 480px) {
  .heroTitle {
    font-size: var(--text-3xl);
  }

  .anoHeader {
    padding: var(--sp-4);
  }

  .anoIcon {
    width: 40px;
    height: 40px;
  }

  .anoIcon i {
    font-size: 1.2rem;
  }

  .disciplinasList {
    grid-template-columns: 1fr;
  }

  .resultItem {
    padding: var(--sp-4);
  }
}
</style>
