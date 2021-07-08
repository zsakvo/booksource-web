import { createRouter, createWebHistory } from 'vue-router'
import { clearPending } from '@/plugins/request'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/page/Home.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  clearPending()
  next()
})

export default router
