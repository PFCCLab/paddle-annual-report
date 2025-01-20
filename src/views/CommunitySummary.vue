<template>
  <div class="community-summary">
    <h1 class="pixel-title">社区年度总结</h1>

    <div class="story-container">
      <div class="story-text">
        <div class="text-block" v-show="showBlock1">
          PaddlePaddle 社区今年共收获 <span class="highlight">5954</span> 个 PR 贡献
        </div>
        
        <div class="text-block" v-show="showBlock2">
          开启了 <span class="highlight">4630</span> 个 Issue 
        </div>
        
        <div class="text-block" v-show="showBlock3">
          平均每天有 <span class="highlight">16.36</span> 个 PR 贡献，
          <span class="highlight">社区活力持续增长</span>
        </div>

        <div class="text-block" v-show="showBlock4">
          今年共有 <span class="highlight">590</span> 位贡献者参与了 PR 贡献，
          平均每位贡献者参与了 <span class="highlight">10.09</span> 次 PR 贡献
        </div>

        <div class="text-block" v-show="showBlock5">
          其中 <span class="highlight">338</span> 位贡献者是首次加入。
          <span class="highlight">新鲜血液不断注入，社区生机勃勃</span>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card" v-show="showBlock1">
          <div class="stat-icon pr-icon"></div>
          <div class="stat-info">
            <h3>PR 贡献</h3>
            <p class="stat-value">5954</p>
          </div>
        </div>

        <div class="stat-card" v-show="showBlock2">
          <div class="stat-icon issue-icon"></div>
          <div class="stat-info">
            <h3>Issue 数量</h3>
            <p class="stat-value">4630</p>
          </div>
        </div>

        <div class="stat-card" v-show="showBlock4">
          <div class="stat-icon contributor-icon"></div>
          <div class="stat-info">
            <h3>贡献者数量</h3>
            <p class="stat-value">590</p>
          </div>
        </div>
      </div>
    </div>

    <page-navigation />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import PageNavigation from '../components/PageNavigation.vue'

export default {
  name: 'CommunitySummary',
  components: {
    PageNavigation
  },
  setup() {
    const showBlock1 = ref(false)
    const showBlock2 = ref(false)
    const showBlock3 = ref(false)
    const showBlock4 = ref(false)
    const showBlock5 = ref(false)

    onMounted(() => {
      // 依次显示文本块
      setTimeout(() => { showBlock1.value = true }, 500)
      setTimeout(() => { showBlock2.value = true }, 1500)
      setTimeout(() => { showBlock3.value = true }, 2500)
      setTimeout(() => { showBlock4.value = true }, 3500)
      setTimeout(() => { showBlock5.value = true }, 4500)
    })

    return {
      showBlock1,
      showBlock2,
      showBlock3,
      showBlock4,
      showBlock5
    }
  }
}
</script>

<style scoped>
.community-summary {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(to bottom, #1a237e, #311b92);
}

.pixel-title {
  text-align: center;
  color: var(--accent-color);
  font-size: 24px;
  margin-bottom: 40px;
  text-shadow: 2px 2px 0 #000;
}

.story-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.story-text {
  color: var(--text-color);
  font-size: 24px;
  line-height: 1.8;
  margin-bottom: 60px;
}

.text-block {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s ease forwards;
  margin-bottom: 40px;
  text-align: center;
}

.highlight {
  color: var(--accent-color);
  font-weight: bold;
  font-size: 32px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 60px;
}

.stat-card {
  background: rgba(0, 0, 0, 0.3);
  border: 4px solid var(--accent-color);
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s ease forwards;
}

.stat-icon {
  width: 64px;
  height: 64px;
  background-color: var(--accent-color);
  flex-shrink: 0;
}

.pr-icon { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
.issue-icon { clip-path: circle(50% at 50% 50%); }
.contributor-icon { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); }

.stat-info {
  flex-grow: 1;
}

.stat-info h3 {
  color: var(--text-color);
  font-size: 18px;
  margin-bottom: 10px;
}

.stat-value {
  color: var(--accent-color);
  font-size: 36px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .story-text {
    font-size: 18px;
  }

  .highlight {
    font-size: 24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
  }

  .stat-value {
    font-size: 28px;
  }
}
</style> 