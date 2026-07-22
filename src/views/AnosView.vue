<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { anos, getAtividades } from '../data/disciplinas.js'

const router = useRouter()

const anosList = computed(() =>
  Object.entries(anos).map(([id, ano]) => {
    let totalAtiv = 0
    for (const disc of ano.disciplinas) {
      totalAtiv += getAtividades(disc.id).length
    }
    return { id, ...ano, totalAtiv }
  }),
)
</script>

<template>
  <div class="anosView">
    <div class="anosHeader animate-fade-in-up">
      <button class="backBtn" @click="router.back()">
        <i class="mdi mdi-arrow-left"></i>
      </button>
      <div class="anosHeaderText">
        <h1 class="anosTitle">Atividades por Ano</h1>
        <p class="anosDesc">Selecione um ano para ver todas as atividades e disciplinas do curso técnico.</p>
      </div>
    </div>

    <div class="anosList">
      <RouterLink
        v-for="(item, idx) in anosList"
        :key="item.id"
        :to="`/ano/${item.id}`"
        class="anoCard animate-fade-in-up"
        :class="`delay-${Math.min(idx + 1, 5)}`"
      >
        <div class="anoLeft">
          <div class="anoNumber">{{ item.id }}º</div>
          <div class="anoAccent"></div>
        </div>

        <div class="anoContent">
          <h2 class="anoLabel">{{ item.label }}</h2>
          <p class="anoDesc">{{ item.desc }}</p>
          <div class="anoMeta">
            <span class="anoMetaItem">
              <i class="mdi mdi-bookshelf"></i>
              {{ item.disciplinas.length }} disciplina{{ item.disciplinas.length > 1 ? 's' : '' }}
            </span>
            <span class="anoMetaItem">
              <i class="mdi mdi-file-document-outline"></i>
              {{ item.totalAtiv }} atividade{{ item.totalAtiv > 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <div class="anoRight">
          <div class="anoArrow">
            <i class="mdi mdi-arrow-right"></i>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.anosView {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: var(--sp-8) var(--sp-6);
}

.anosHeader {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-4);
  margin-bottom: var(--sp-10);
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

.anosHeaderText {
  flex: 1;
}

.anosTitle {
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-text-1);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--sp-2);
}

.anosDesc {
  font-size: var(--text-base);
  color: var(--color-text-4);
  line-height: var(--leading-relaxed);
}

.anosList {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
}

.anoCard {
  display: flex;
  align-items: stretch;
  gap: var(--sp-6);
  padding: var(--sp-6);
  border-radius: var(--radius-xl);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-1);
  text-decoration: none;
  transition: all var(--duration-normal) var(--ease-spring);
  overflow: hidden;
}

.anoCard:hover {
  transform: translateX(6px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-2);
}

.anoLeft {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
  flex-shrink: 0;
}

.anoNumber {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-xl);
  background: var(--color-navy-accent-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-2xl);
  font-weight: 900;
  color: var(--color-navy-accent);
  transition: all var(--duration-fast) var(--ease-spring);
}

.anoCard:hover .anoNumber {
  background: var(--color-navy-accent);
  color: #ffffff;
  transform: scale(1.08) rotate(-3deg);
}

.anoAccent {
  width: 4px;
  flex: 1;
  border-radius: 2px;
  background: var(--color-navy-accent-muted);
  opacity: 0.5;
}

.anoContent {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.anoLabel {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text-1);
}

.anoDesc {
  font-size: var(--text-sm);
  color: var(--color-text-4);
  line-height: var(--leading-relaxed);
}

.anoMeta {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  margin-top: var(--sp-1);
}

.anoMetaItem {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
  font-size: var(--text-xs);
  color: var(--color-text-5);
}

.anoMetaItem i {
  font-size: 1rem;
  color: var(--color-navy-accent);
}

.anoRight {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.anoArrow {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--color-surface-3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-5);
  transition: all var(--duration-fast) var(--ease-spring);
}

.anoCard:hover .anoArrow {
  background: var(--color-navy-accent);
  color: #ffffff;
  transform: translateX(4px);
}

@media (max-width: 480px) {
  .anosTitle {
    font-size: var(--text-2xl);
  }

  .anoCard {
    padding: var(--sp-5);
    gap: var(--sp-4);
  }

  .anoNumber {
    width: 56px;
    height: 56px;
    font-size: var(--text-xl);
  }

  .anoMeta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--sp-1);
  }
}
</style>
