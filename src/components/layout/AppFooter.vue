<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footerInner">
      <div class="footerTop">
        <div class="footerBrand">
          <div class="brand">
            <div class="brandMark"><span>I</span></div>
            <span class="brandName">Informática para Internet</span>
          </div>
        </div>
      </div>

      <div class="footerMiddle">
        <p class="footerDesc">
          Plataforma de atividades escolares criada pela
          <strong>Monitoria de Informática</strong> para o curso
          <strong>Técnico em Informática</strong> do
          <strong>Instituto Federal Catarinense — Campus Araquari</strong>.
        </p>
      </div>

      <div class="footerBottom">
        <p class="copy">&copy; {{ year }} Informática para Internet. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border-1);
  background: var(--color-surface);
}

.footerInner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: var(--sp-10) var(--sp-6) var(--sp-6);
}

.footerTop {
  display: flex;
  justify-content: center;
  margin-bottom: var(--sp-6);
}

.footerBrand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-3);
  text-align: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.brandMark {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-xs);
  background: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brandMark span {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--color-text-on-accent);
}

.brandName {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text-1);
}

.footerMiddle {
  text-align: center;
  margin-bottom: var(--sp-8);
}

.footerDesc {
  font-size: var(--text-sm);
  color: var(--color-text-4);
  max-width: 480px;
  line-height: var(--leading-relaxed);
  margin: 0 auto;
}

.footerDesc strong {
  color: var(--color-text-2);
  font-weight: 600;
}

.footerBottom {
  text-align: center;
  padding-top: var(--sp-6);
  border-top: 1px solid var(--color-border-1);
}

.copy {
  font-size: var(--text-xs);
  color: var(--color-text-5);
  letter-spacing: var(--tracking-wide);
}
</style>
