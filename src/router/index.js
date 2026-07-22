import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
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

export default router
