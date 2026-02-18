import { createRouter, createWebHashHistory } from 'vue-router'

import ProgressDemo from '../pages/ProgressDemo.vue'
import PieDemo from '../pages/PieDemo.vue'

const routes = [
  { path: '/', redirect: '/progress' },
  { path: '/progress', component: ProgressDemo },
  { path: '/pie', component: PieDemo },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
