import { createRouter, createWebHistory } from 'vue-router'
import MapView from '../views/MapView.vue'
import GuideView from '../views/GuideView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'map', component: MapView },
    { path: '/guide', name: 'guide', component: GuideView },
  ],
})
