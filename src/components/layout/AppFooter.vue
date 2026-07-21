<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footerTop">
      <div class="footerInner">
        <div class="footerBrand">
          <div class="footerBrandMark"><span>I</span></div>
          <span class="footerBrandName">Info<span class="footerBrandAccent">Internet</span></span>
        </div>
        <p class="copy">
          &copy; {{ year }} Informática para Internet. Todos os direitos reservados.
        </p>
      </div>

    </div>

  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border-1);
  background: var(--color-surface);
}

.footerTop {
  padding: var(--sp-10) var(--sp-6);
}

.footerInner {
  max-width: var(--max-w);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
}

.footerBrand {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.footerBrandMark {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-xs);
  background: var(--color-navy-accent);
  border: 1px solid var(--color-border-2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-xs);
}

.footerBrandMark span {
  font-size: 0.75rem;
  font-weight: 800;
  color: #ffffff;
}

.footerBrandName {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-1);
}

.footerBrandAccent {
  color: var(--color-text-4);
  font-weight: 500;
}

.footerDesc {
  font-size: var(--text-sm);
  color: var(--color-text-4);
  text-align: center;
  max-width: 380px;
}

.footerBottom {
  border-top: 1px solid var(--color-border-1);
  padding: var(--sp-5) var(--sp-6);
}

.footerBottomInner {
  max-width: var(--max-w);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.copy {
  font-size: var(--text-xs);
  color: var(--color-text-5);
  letter-spacing: var(--tracking-wide);
}

.madeWith {
  font-size: var(--text-xs);
  color: var(--color-text-5);
  display: flex;
  align-items: center;
  gap: var(--sp-1);
}

.madeWith i {
  color: var(--color-danger);
  font-size: 0.85rem;
}

@media (max-width: 480px) {
  .footerBottomInner {
    flex-direction: column;
    gap: var(--sp-2);
    text-align: center;
  }
}
</style>
