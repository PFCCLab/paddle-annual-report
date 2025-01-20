import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Opening',
    component: () => import('../views/Opening.vue')
  },
  {
    path: '/community-summary',
    name: 'CommunitySummary',
    component: () => import('../views/CommunitySummary.vue')
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('../views/Leaderboard.vue')
  },
  {
    path: '/personal-achievements',
    name: 'PersonalAchievements',
    component: () => import('../views/PersonalAchievements.vue')
  },
  {
    path: '/project-map',
    name: 'ProjectMap',
    component: () => import('../views/ProjectMap.vue')
  },
  {
    path: '/contribution-trends',
    name: 'ContributionTrends',
    component: () => import('../views/ContributionTrends.vue')
  },
  {
    path: '/time-records',
    name: 'TimeRecords',
    component: () => import('../views/TimeRecords.vue')
  },
  {
    path: '/keywords',
    name: 'Keywords',
    component: () => import('../views/Keywords.vue')
  },
  {
    path: '/share',
    name: 'Share',
    component: () => import('../views/Share.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 