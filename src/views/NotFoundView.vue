<template>
  <div class="notFoundPage">
    <div class="notFoundContent">
      <div class="notFoundCode animate-fade-in-up">404</div>
      <h1 class="notFoundTitle animate-fade-in-up delay-1">Página não encontrada</h1>
      <p class="notFoundDesc animate-fade-in-up delay-2">
        O endereço que você acessou não existe ou foi movido.
      </p>
      <RouterLink to="/" class="btn btnPrimary animate-fade-in-up delay-3">
        <i class="mdi mdi-home-outline"></i>
        Voltar ao início
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.notFoundPage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--header-h) - 200px);
  padding: var(--sp-6);
}

.notFoundContent {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
}

.notFoundCode {
  font-size: 7rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-text-5) 0%, var(--color-text-4) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  letter-spacing: var(--tracking-tight);
}

.notFoundTitle {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-1);
}

.notFoundDesc {
  font-size: var(--text-md);
  color: var(--color-text-4);
  max-width: 400px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-6);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  margin-top: var(--sp-4);
}

.btnPrimary {
  background: var(--color-navy);
  color: #ffffff;
}

.btnPrimary:hover {
  background: var(--color-navy-light);
  box-shadow: var(--shadow-glow-sm);
  transform: translateY(-2px);
}

.btnPrimary:active {
  transform: translateY(0);
}
</style>
