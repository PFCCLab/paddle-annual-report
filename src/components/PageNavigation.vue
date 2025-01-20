<template>
  <div class="navigation-container">
    <button 
      class="pixel-button nav-button" 
      :class="{ disabled: !hasPrevious }"
      @click="goToPrevious"
      v-if="hasPrevious"
    >
      上一页
    </button>
    <div class="page-indicator">{{ currentPage }}/{{ totalPages }}</div>
    <button 
      class="pixel-button nav-button" 
      :class="{ disabled: !hasNext }"
      @click="goToNext"
      v-if="hasNext"
    >
      下一页
    </button>
  </div>
</template>

<script>
const routes = [
  '/',
  '/community-summary',
  '/leaderboard',
  '/personal-achievements',
  '/project-map',
  '/contribution-trends',
  '/time-records',
  '/keywords',
  '/share'
]

export default {
  name: 'PageNavigation',
  computed: {
    currentRouteIndex() {
      return routes.indexOf(this.$route.path)
    },
    hasPrevious() {
      return this.currentRouteIndex > 0
    },
    hasNext() {
      return this.currentRouteIndex < routes.length - 1
    },
    currentPage() {
      return this.currentRouteIndex + 1
    },
    totalPages() {
      return routes.length
    }
  },
  methods: {
    goToPrevious() {
      if (this.hasPrevious) {
        this.$router.push(routes[this.currentRouteIndex - 1])
      }
    },
    goToNext() {
      if (this.hasNext) {
        this.$router.push(routes[this.currentRouteIndex + 1])
      }
    }
  }
}
</script>

<style scoped>
.navigation-container {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 10px;
  z-index: 1000;
}

.nav-button {
  min-width: 120px;
  padding: 10px 20px;
  font-size: 14px;
}

.nav-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-indicator {
  font-family: 'Press Start 2P', cursive;
  color: var(--accent-color);
  font-size: 14px;
  min-width: 80px;
  text-align: center;
}

@media (max-width: 768px) {
  .nav-button {
    min-width: 100px;
    font-size: 12px;
  }

  .page-indicator {
    font-size: 12px;
  }
}
</style> 