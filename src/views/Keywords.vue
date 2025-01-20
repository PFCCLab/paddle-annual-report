<template>
  <div class="keywords">
    <h1 class="pixel-title">年度关键词</h1>

    <div v-if="loading" class="loading">
      加载中...
    </div>
    <div v-else-if="showError" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-else class="story-container">
      <div class="story-text">
        <div class="text-block" v-show="showBlock1">
          2024年，你在PaddlePaddle社区留下了独特的印记。
          让我们一起来看看你的专属关键词：
        </div>

        <div class="text-block" v-show="showBlock2">
          <template v-if="userData.most_active_repo">
            你经常出现在 <span class="highlight">{{ userData.most_active_repo }}</span> 项目中，
            <template v-if="userData.most_active_repo === 'Paddle'">
              为深度学习框架的发展添砖加瓦。
            </template>
            <template v-else-if="userData.most_active_repo === 'PaddleNLP'">
              推动自然语言处理技术的进步。
            </template>
            <template v-else-if="userData.most_active_repo === 'PaddleClas'">
              提升图像分类的精准度。
            </template>
            <template v-else-if="userData.most_active_repo === 'PaddleDetection'">
              优化目标检测的性能。
            </template>
            <template v-else-if="userData.most_active_repo === 'PaddleSeg'">
              完善图像分割的能力。
            </template>
            <template v-else-if="userData.most_active_repo === 'PaddleOCR'">
              提升文字识别的准确性。
            </template>
            <template v-else-if="userData.most_active_repo === 'PaddleGAN'">
              探索图像生成的可能。
            </template>
            <template v-else-if="userData.most_active_repo === 'PaddleRec'">
              优化推荐系统的效果。
            </template>
            <template v-else-if="userData.most_active_repo === 'PaddleVideo'">
              提升视频处理的能力。
            </template>
            <template v-else-if="userData.most_active_repo === 'FastDeploy'">
              加速模型部署的效率。
            </template>
            <template v-else>
              展现了你的专业能力。
            </template>
          </template>
        </div>

        <div class="text-block" v-show="showBlock3">
          你的年度关键词：
          <div class="keywords-cloud">
            <span v-for="(keyword, index) in keywords" 
                  :key="index" 
                  class="keyword-tag"
                  :style="{ animationDelay: index * 0.2 + 's' }">
              {{ keyword }}
            </span>
          </div>
        </div>

        <div class="text-block" v-show="showBlock4">
          这些关键词，记录着你在开源社区的成长轨迹。
          期待在2024年，继续与你一起在PaddlePaddle的开源星图上，
          描绘更精彩的篇章！
        </div>
      </div>
    </div>

    <page-navigation />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import PageNavigation from '../components/PageNavigation.vue'
import Papa from 'papaparse'
import { useUserStore } from '../store/userStore'

export default {
  name: 'Keywords',
  components: {
    PageNavigation
  },
  setup() {
    const { githubId } = useUserStore()
    const userData = ref({})
    const loading = ref(false)
    const showError = ref(false)
    const errorMessage = ref('')
    const showBlock1 = ref(false)
    const showBlock2 = ref(false)
    const showBlock3 = ref(false)
    const showBlock4 = ref(false)
    const keywords = ref([])

    const determineKeywords = (userRecord) => {
      if (!userRecord) return []
      
      const repos = userRecord.repos?.split(',') || []
      const keywords = []
      
      // 基于仓库参与情况添加关键词
      if (repos.includes('Paddle')) {
        keywords.push('深度学习框架')
      }
      if (repos.includes('PaddleNLP')) {
        keywords.push('自然语言处理')
      }
      if (repos.includes('PaddleClas')) {
        keywords.push('图像分类')
      }
      if (repos.includes('PaddleDetection')) {
        keywords.push('目标检测')
      }
      if (repos.includes('PaddleSeg')) {
        keywords.push('图像分割')
      }
      if (repos.includes('PaddleOCR')) {
        keywords.push('文字识别')
      }
      if (repos.includes('PaddleGAN')) {
        keywords.push('图像生成')
      }
      if (repos.includes('PaddleRec')) {
        keywords.push('推荐系统')
      }
      if (repos.includes('PaddleVideo')) {
        keywords.push('视频处理')
      }
      if (repos.includes('FastDeploy')) {
        keywords.push('模型部署')
      }
      
      // 基于参与仓库数量添加身份关键词
      const repoCount = repos.length
      if (repoCount >= 5) {
        keywords.push('全栈开发者')
        keywords.push('技术领袖')
      } else if (repoCount >= 3) {
        keywords.push('多领域专家')
        keywords.push('深度参与者')
      } else if (repoCount >= 1) {
        keywords.push('领域专家')
        keywords.push('核心贡献者')
      }
      
      // 基于PR和Issue数量添加特质关键词
      const prCount = parseInt(userRecord.pr_count) || 0
      const issueCount = parseInt(userRecord.issue_count) || 0
      
      if (prCount >= 20) {
        keywords.push('代码达人')
        keywords.push('项目先锋')
      } else if (prCount >= 10) {
        keywords.push('活跃贡献者')
        keywords.push('技术能手')
      } else if (prCount >= 5) {
        keywords.push('代码新星')
      }
      
      if (issueCount >= 10) {
        keywords.push('问题解决者')
        keywords.push('社区引导者')
      } else if (issueCount >= 5) {
        keywords.push('积极反馈者')
      }
      
      // 如果有凌晨提交记录
      if (parseInt(userRecord.midnight_pr_count) > 0) {
        keywords.push('夜间开发者')
        keywords.push('极客精神')
      }
      
      // 如果代码量较大
      const additions = parseInt(userRecord.total_additions) || 0
      const deletions = parseInt(userRecord.total_deletions) || 0
      if (additions + deletions > 10000) {
        keywords.push('代码工匠')
        keywords.push('精益求精')
      } else if (additions + deletions > 5000) {
        keywords.push('质量保证者')
      }
      
      // 随机选择6-8个关键词
      const minKeywords = Math.min(6, keywords.length)
      const maxKeywords = Math.min(8, keywords.length)
      const numKeywords = Math.floor(Math.random() * (maxKeywords - minKeywords + 1)) + minKeywords
      
      return shuffleArray(keywords).slice(0, numKeywords)
    }
    
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
      }
      return array
    }

    const getMostActiveRepo = (repos) => {
      if (!repos) return 'Paddle'
      const repoList = repos.split(',')
      // 统计每个仓库出现的次数
      const repoCount = {}
      repoList.forEach(repo => {
        repoCount[repo] = (repoCount[repo] || 0) + 1
      })
      // 找出出现次数最多的仓库
      let maxCount = 0
      let mostActiveRepo = 'Paddle'
      Object.entries(repoCount).forEach(([repo, count]) => {
        if (count > maxCount) {
          maxCount = count
          mostActiveRepo = repo
        }
      })
      return mostActiveRepo
    }

    const loadData = async () => {
      if (!githubId.value) {
        showError.value = true
        errorMessage.value = '请先在首页输入 GitHub ID'
        return
      }

      loading.value = true
      showError.value = false
      try {
        const response = await fetch('/userpaddle_summary_2024.csv')
        const csvText = await response.text()
        const results = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true
        })
        
        const userRecord = results.data.find(item => item.author === githubId.value)
        if (userRecord) {
          userData.value = {
            most_active_repo: getMostActiveRepo(userRecord.repos)
          }
          keywords.value = determineKeywords(userRecord)
          setTimeout(() => { showBlock1.value = true }, 500)
          setTimeout(() => { showBlock2.value = true }, 1500)
          setTimeout(() => { showBlock3.value = true }, 2500)
          setTimeout(() => { showBlock4.value = true }, 3500)
        } else {
          showError.value = true
          errorMessage.value = '未找到该用户的贡献记录'
        }
      } catch (error) {
        console.error('Error loading data:', error)
        showError.value = true
        errorMessage.value = '数据加载失败，请稍后重试'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      userData,
      loading,
      showError,
      errorMessage,
      showBlock1,
      showBlock2,
      showBlock3,
      showBlock4,
      keywords
    }
  }
}
</script>

<style scoped>
.keywords {
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

.keywords-content {
  max-width: 1200px;
  margin: 0 auto;
}

.github-input {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

.pixel-input {
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 4px solid var(--accent-color);
  color: var(--text-color);
  font-size: 16px;
}

.pixel-button {
  background: rgba(0, 0, 0, 0.3);
  border: 4px solid var(--accent-color);
  padding: 15px 30px;
  color: var(--text-color);
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.pixel-button:hover {
  transform: translateY(-2px);
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  background: rgba(0, 0, 0, 0.3);
  border: 4px solid var(--accent-color);
  padding: 20px;
  border-radius: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid var(--accent-color);
}

.user-details h2 {
  color: var(--text-color);
  font-size: 24px;
  margin-bottom: 5px;
}

.user-details p {
  color: var(--accent-color);
  font-size: 16px;
}

.reset-button {
  background: rgba(124, 77, 255, 0.2);
  border: 2px solid var(--accent-color);
  padding: 10px 20px;
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 4px;
}

.reset-button:hover {
  background: rgba(124, 77, 255, 0.3);
}

.loading {
  text-align: center;
  color: var(--text-color);
  font-size: 18px;
  margin: 40px 0;
}

.error-message {
  text-align: center;
  color: #ff6b6b;
  font-size: 16px;
  margin: 20px 0;
  padding: 15px;
  background: rgba(255, 107, 107, 0.1);
  border: 2px solid #ff6b6b;
  border-radius: 4px;
}

.keywords-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.keyword-card {
  background: rgba(0, 0, 0, 0.3);
  border: 4px solid var(--accent-color);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.keyword-icon {
  width: 48px;
  height: 48px;
  background-color: var(--accent-color);
}

.type-icon { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
.project-icon { clip-path: circle(50% at 50% 50%); }
.activity-icon { clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%); }
.focus-icon { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); }

.keyword-info {
  flex-grow: 1;
}

.keyword-label {
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 5px;
}

.keyword-value {
  font-size: 24px;
  color: var(--accent-color);
}

.badges-section {
  margin-top: 60px;
}

.badges-section h2 {
  text-align: center;
  color: var(--text-color);
  font-size: 20px;
  margin-bottom: 30px;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.badge-card {
  background: rgba(0, 0, 0, 0.3);
  border: 4px solid var(--accent-color);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.badge-icon {
  width: 64px;
  height: 64px;
  background-color: var(--accent-color);
}

.master-icon { clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%); }
.solver-icon { clip-path: circle(50% at 50% 50%); }
.night-icon { clip-path: polygon(50% 0%, 100% 100%, 0% 100%); }
.elite-icon { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); }

.badge-info {
  flex-grow: 1;
}

.badge-name {
  font-size: 20px;
  color: var(--accent-color);
  margin-bottom: 5px;
}

.badge-description {
  font-size: 14px;
  color: var(--text-color);
}

@media (max-width: 768px) {
  .user-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .user-info {
    flex-direction: column;
  }

  .keywords-grid {
    grid-template-columns: 1fr;
  }

  .badges-grid {
    grid-template-columns: 1fr;
  }

  .keyword-card,
  .badge-card {
    padding: 15px;
  }

  .keyword-icon {
    width: 36px;
    height: 36px;
  }

  .badge-icon {
    width: 48px;
    height: 48px;
  }

  .keyword-value {
    font-size: 20px;
  }

  .badge-name {
    font-size: 18px;
  }
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
  margin-bottom: 40px;
  text-align: center;
}

.text-block {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s ease forwards;
  margin-bottom: 30px;
}

.highlight {
  color: var(--accent-color);
  font-weight: bold;
}

.badges-container {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s ease forwards;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 60px;
}

.badge {
  background: rgba(0, 0, 0, 0.3);
  border: 4px solid var(--accent-color);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease;
}

.badge:hover {
  transform: translateY(-5px);
}

.badge-icon {
  width: 64px;
  height: 64px;
  background-color: var(--accent-color);
  margin: 0 auto 15px;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.badge-name {
  color: var(--text-color);
  font-size: 18px;
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

@media (max-width: 768px) {
  .story-text {
    font-size: 18px;
  }

  .badge {
    padding: 15px;
  }

  .badge-icon {
    width: 48px;
    height: 48px;
  }

  .badge-name {
    font-size: 16px;
  }
}

.keywords-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
}

.keyword-tag {
  background: rgba(124, 77, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid var(--accent-color);
  color: var(--text-color);
  font-size: 18px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease forwards;
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
</style> 