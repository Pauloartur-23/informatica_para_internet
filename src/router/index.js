import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/anos',
      name: 'anos',
      component: () => import('../views/AnosView.vue'),
    },
    {
      path: '/ano/:anoId',
      name: 'ano',
      component: () => import('../views/AnoView.vue'),
      props: true,
    },
    {
      path: '/disciplina/:anoId/:disciplinaId',
      name: 'disciplina',
      component: () => import('../views/DisciplinaView.vue'),
      props: true,
    },
    {
      path: '/atividade/:disciplinaId/:atividadeId',
      name: 'atividade',
      component: () => import('../views/AtividadeView.vue'),
      props: true,
    },
    {
      path: '/buscar',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
    },
    {
      path: '/criar-atividade',
      name: 'create-activity',
      component: () => import('../views/CreateActivityView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/editar-atividade/:disciplinaId/:atividadeId',
      name: 'edit-activity',
      component: () => import('../views/CreateActivityView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/perfil',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    if (!auth.isLoggedIn) {
      return { name: 'profile', query: { redirect: to.fullPath } }
    }
  }
})

export default router
