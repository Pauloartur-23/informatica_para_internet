import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useIsMobileStore = defineStore('isMobile', () => {
  const mediaQuery = window.matchMedia('(max-width: 900px)')
  const isMobile = ref(mediaQuery.matches)

  mediaQuery.addEventListener('change', (e) => {
    isMobile.value = e.matches
  })

  return {
    isMobile,
  }
})
