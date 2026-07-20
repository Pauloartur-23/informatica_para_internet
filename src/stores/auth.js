import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('sio-user') || 'null'))
  const isLoggedIn = computed(() => !!user.value)

  function login(email, password) {
    if (email && password) {
      user.value = {
        nome: email.split('@')[0],
        email,
        avatar: email.charAt(0).toUpperCase(),
      }
      localStorage.setItem('sio-user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  function quickLogin() {
    const id = Math.random().toString(36).slice(2, 8)
    const email = `monitoria@ifc.edu.br`
    user.value = {
      nome: 'Monitoria',
      email,
      avatar: 'M',
    }
    localStorage.setItem('sio-user', JSON.stringify(user.value))
  }

  function logout() {
    user.value = null
    localStorage.removeItem('sio-user')
  }

  return { user, isLoggedIn, login, quickLogin, logout }
})
