<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { searchAtividades } from '../data/disciplinas.js'

const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.query.q || '')
const results = computed(() => searchAtividades(searchQuery.value))
const hasSearched = computed(() => searchQuery.value.trim().length >= 2)

function doSearch() {
  const q = searchQuery.value.trim()
  if (q.length >= 2) {
    router.replace({ query: { q } })
  } else {
    router.replace({ query: {} })
  }
}

watch(
  () => route.query.q,
  (val) => {
    if (val && val !== searchQuery.value) {
      searchQuery.value = val
    }
  },
)

onMounted(() => {
  if (searchQuery.value.trim().length >= 2) {
    doSearch()
  }
})
</script>

<template>
  <div class="searchView">
    <div class="searchHeader animate-fade-in-up">
      <h1 class="searchTitle">Buscar Atividades</h1>
      <p class="searchSubtitle">Encontre atividades e conteúdos rapidamente.</p>
    </div>

    <form class="searchBar animate-fade-in-up delay-1" @submit.prevent="doSearch">
      <div class="searchInputWrap">
        <i class="mdi mdi-magnify searchIcon"></i>
        <input
          v-model="searchQuery"
          type="text"
          class="searchInput"
          placeholder="Buscar por título, descrição ou conteúdo..."
          autofocus
        />
        <button
          v-if="searchQuery"
          type="button"
          class="clearBtn"
          @click="searchQuery = ''; router.replace({ query: {} })"
        >
          <i class="mdi mdi-close"></i>
        </button>
      </div>
    </form>

    <div v-if="hasSearched" class="searchResults animate-fade-in-up delay-2">
      <p class="resultCount">
        {{ results.length }} resultado{{ results.length !== 1 ? 's' : '' }} encontrado{{ results.length !== 1 ? 's' : '' }}
      </p>

      <div v-if="results.length" class="resultsList">
        <RouterLink
          v-for="(r, idx) in results"
          :key="`${r.disciplina.id}-${r.atividade.id}`"
          :to="`/atividade/${r.disciplina.id}/${r.atividade.id}`"
          class="resultCard animate-fade-in-up"
          :class="`delay-${Math.min(idx + 1, 5)}`"
        >
          <div class="resultMeta">
            <span class="resultAno">{{ r.anoLabel }}</span>
            <i class="mdi mdi-chevron-right"></i>
            <span class="resultDisc">{{ r.disciplina.name }}</span>
          </div>
          <h3 class="resultTitle">{{ r.atividade.title }}</h3>
          <p class="resultDesc">{{ r.atividade.desc }}</p>
          <div class="resultFooter">
            <span class="resultQuestions">
              <i class="mdi mdi-help-circle-outline"></i>
              {{ r.atividade.questoes.length }} questão{{ r.atividade.questoes.length > 1 ? 's' : '' }}
            </span>
            <span class="resultLink">
              Ver atividade
              <i class="mdi mdi-arrow-right"></i>
            </span>
          </div>
        </RouterLink>
      </div>

      <div v-else class="noResults">
        <i class="mdi mdi-magnify-close"></i>
        <h3>Nenhum resultado encontrado</h3>
        <p>Tente buscar com outros termos ou verifique a ortografia.</p>
      </div>
    </div>

    <div v-else class="searchEmpty animate-fade-in-up delay-2">
      <i class="mdi mdi-magnify"></i>
      <h3>Digite pelo menos 2 caracteres para buscar</h3>
      <p>Pesquise por títulos de atividades, descrições ou conteúdo das questões.</p>
    </div>
  </div>
</template>

<style scoped>
.searchView {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: var(--sp-8) var(--sp-6);
}

.searchHeader {
  text-align: center;
  margin-bottom: var(--sp-8);
}

.searchTitle {
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-text-1);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--sp-2);
}

.searchSubtitle {
  font-size: var(--text-base);
  color: var(--color-text-4);
}

.searchBar {
  margin-bottom: var(--sp-8);
}

.searchInputWrap {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-4) var(--sp-5);
  border-radius: var(--radius-lg);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-2);
  transition: all var(--duration-fast) var(--ease-out);
}

.searchInputWrap:focus-within {
  border-color: var(--color-navy-accent);
  box-shadow: 0 0 0 3px var(--color-navy-accent-muted);
}

.searchIcon {
  font-size: 1.3rem;
  color: var(--color-text-5);
  flex-shrink: 0;
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
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--color-surface-4);
  border: none;
  color: var(--color-text-4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  flex-shrink: 0;
}

.clearBtn:hover {
  background: var(--color-surface-4);
  color: var(--color-text-1);
}

.resultCount {
  font-size: var(--text-sm);
  color: var(--color-text-4);
  margin-bottom: var(--sp-4);
}

.resultsList {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.resultCard {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-5) var(--sp-6);
  border-radius: var(--radius-lg);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-spring);
}

.resultCard:hover {
  background: var(--color-surface-3);
  border-color: var(--color-navy-accent);
  transform: translateY(-3px) scale(1.01);
  box-shadow: var(--shadow-md);
}

.resultMeta {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--text-xs);
  color: var(--color-text-5);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
}

.resultAno {
  color: var(--color-navy-accent);
  font-weight: 600;
}

.resultMeta i {
  font-size: 0.7rem;
}

.resultDisc {
  font-weight: 600;
}

.resultTitle {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-text-1);
}

.resultDesc {
  font-size: var(--text-sm);
  color: var(--color-text-4);
  line-height: var(--leading-normal);
}

.resultFooter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--sp-2);
}

.resultQuestions {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  font-size: var(--text-xs);
  color: var(--color-text-5);
}

.resultQuestions i {
  color: var(--color-navy-accent);
}

.resultLink {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-navy-accent);
  transition: all var(--duration-fast) var(--ease-out);
}

.resultCard:hover .resultLink i {
  transform: translateX(4px);
}

.noResults,
.searchEmpty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
  text-align: center;
  padding: var(--sp-16) var(--sp-6);
}

.noResults i,
.searchEmpty i {
  font-size: 3rem;
  color: var(--color-text-5);
}

.noResults h3,
.searchEmpty h3 {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-1);
}

.noResults p,
.searchEmpty p {
  font-size: var(--text-sm);
  color: var(--color-text-4);
}

@media (max-width: 480px) {
  .searchTitle {
    font-size: var(--text-2xl);
  }

  .resultCard {
    padding: var(--sp-4);
  }
}
</style>
