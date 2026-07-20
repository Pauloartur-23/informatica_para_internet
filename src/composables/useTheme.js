import { ref, watchEffect } from 'vue'

const theme = ref(localStorage.getItem('sio-theme') || 'dark')
const isDark = ref(theme.value === 'dark')

function applyTheme() {
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('sio-theme', theme.value)
  isDark.value = theme.value === 'dark'
}

applyTheme()

watchEffect(applyTheme)

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, isDark, toggleTheme }
}
