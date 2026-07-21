import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'sio-user'

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(loadUser())
  const isLoggedIn = computed(() => !!user.value)

  function login(email, password) {
    if (!email || !password) return false

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!validEmail) return false

    user.value = {
      nome: email.split('@')[0],
      email,
      avatar: email.charAt(0).toUpperCase(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
    return true
  }

  function quickLogin() {
    user.value = {
      nome: 'Monitoria',
      email: 'monitoria@ifc.edu.br',
      avatar: 'M',
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
  }

  function logout() {
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { user, isLoggedIn, login, quickLogin, logout }
})
