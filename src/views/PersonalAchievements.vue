<template>
  <div class="personal-achievements">
    <h1 class="pixel-title">个人成就墙</h1>

    <div class="achievements-content">
      <div v-if="!hasSearched" class="github-input">
        <input
          v-model="inputGithubId"
          class="pixel-input"
          type="text"
          placeholder="输入你的 GitHub ID"
          @keyup.enter="searchUser"
        >
        <button class="pixel-button" @click="searchUser">开始冒险</button>
      </div>

      <div v-else>
        <div class="user-header">
          <div class="user-info">
            <img :src="'https://github.com/' + githubId + '.png'" :alt="githubId" class="user-avatar">
            <div class="user-details">
              <h2>{{ githubId }}</h2>
              <p>{{ userTitle }}</p>
            </div>
          </div>
          <button class="reset-button" @click="resetSearch">重新输入</button>
        </div>

        <div v-if="loading" class="loading">
          加载中...
        </div>
        <div v-else-if="showError" class="error-message">
          {{ errorMessage }}
          <div v-if="errorMessage === '未找到该用户的贡献记录'" class="github-stats">
            <div class="stats-header">
              <img :src="'https://github.com/' + inputGithubId + '.png'" :alt="inputGithubId" class="user-avatar">
              <h3>{{ inputGithubId }} 的 GitHub 数据</h3>
            </div>
            <div v-if="githubData.loading" class="loading">正在获取 GitHub 数据...</div>
            <div v-else-if="githubData.error" class="error-text">{{ githubData.error }}</div>
            <div v-else class="stats-content">
              <div class="stats-row">
                <div class="stat-item">
                  <div class="stat-value">{{ githubData.pr_count }}</div>
                  <div class="stat-label">2024年PR数</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ githubData.issue_count }}</div>
                  <div class="stat-label">2024年Issue数</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ githubData.merge_count }}</div>
                  <div class="stat-label">2024年合并PR数</div>
                </div>
              </div>
              <div class="stats-row">
                <div class="stat-item">
                  <div class="stat-value">{{ githubData.following }}</div>
                  <div class="stat-label">Following</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ githubData.followers }}</div>
                  <div class="stat-label">Followers</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ githubData.stars }}</div>
                  <div class="stat-label">Stars</div>
                </div>
              </div>
              <div class="paddle-status">
                <span class="status-icon" :class="{ 'starred': githubData.starred_paddle }">
                  {{ githubData.starred_paddle ? '⭐' : '☆' }}
                </span>
                {{ githubData.starred_paddle ? '已关注 PaddlePaddle' : '未关注 PaddlePaddle' }}
              </div>
            </div>
            <div class="community-guide">
              <h3>🎮 开启你的 PaddlePaddle 开源之旅</h3>
              <div class="guide-steps">
                <div class="guide-step">
                  1. Star <a href="https://github.com/PaddlePaddle/Paddle" target="_blank">PaddlePaddle</a> 项目，关注最新动态
                </div>
                <div class="guide-step">
                  2. 浏览 <a href="https://github.com/PaddlePaddle/Paddle/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22" target="_blank">Good First Issues</a>，寻找适合入门的任务
                </div>
                <div class="guide-step">
                  3. 阅读<a href="https://www.paddlepaddle.org.cn/documentation/docs/zh/develop/dev_guides/git_guides/local_dev_guide_cn.html" target="_blank">本地开发指南</a>，了解开发流程
                </div>
                <div class="guide-step">
                  4. 加入 <a href="https://github.com/PaddlePaddle/Paddle/blob/develop/docs/design/community/community_guide_cn.md" target="_blank">开发者社区</a>，与其他开发者交流
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="story-container">
          <div class="story-text">
            <div class="text-block" v-show="showBlock1">
              恭喜你，冒险者！在2024年，你为PaddlePaddle社区贡献了
              <span class="highlight">{{ userData.pr_count }}</span> 个PR，
              开启了 <span class="highlight">{{ userData.issue_count }}</span> 个issue，
              成功合入了 <span class="highlight">{{ userData.merge_count }}</span> 次代码。
            </div>

            <div class="text-block" v-show="showBlock2">
              你的代码贡献总计
              <span class="highlight">{{ formatNumber(userData.code_additions) }}</span> 行新增，
              <span class="highlight">{{ formatNumber(userData.code_deletions) }}</span> 行优化，
              展现了对代码质量的不懈追求。
            </div>

            <div class="text-block" v-show="showBlock3">
              你活跃在 <span class="highlight">{{ userData.repo_count }}</span> 个仓库中，
              成为了一名 <span class="highlight">{{ userData.contributor_type }}</span>，
              以专业的态度推动项目进展。
            </div>

            <div class="text-block" v-show="showBlock4">
              你的第一个PR是在 <span class="highlight">{{ formatDate(userData.first_pr_time) }}</span>，
              距今已有 <span class="highlight">{{ getDaysSinceFirstPR() }}</span> 天。
              <template v-if="userData.midnight_pr_count > 0">
                你在 <span class="highlight">{{ formatDate(userData.latest_pr_time) }}</span> 提交了深夜pr，
                展现了你的开发热情。
              </template>
              <template v-else>
                你在2024年没有提交过深夜pr，
                你是一个作息规律健康的程序员。
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <page-navigation />
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import PageNavigation from '../components/PageNavigation.vue'
import Papa from 'papaparse'
import { useUserStore } from '../store/userStore'

export default {
  name: 'PersonalAchievements',
  components: {
    PageNavigation
  },
  setup() {
    const { githubId, hasSearched, setGithubId, clearGithubId } = useUserStore()
    const inputGithubId = ref('')
    const userData = ref({})
    const loading = ref(false)
    const showError = ref(false)
    const errorMessage = ref('')
    const userTitle = ref('')
    const showBlock1 = ref(false)
    const showBlock2 = ref(false)
    const showBlock3 = ref(false)
    const showBlock4 = ref(false)
    const githubData = ref({
      loading: false,
      error: null,
      pr_count: 0,
      issue_count: 0,
      merge_count: 0,
      following: 0,
      followers: 0,
      stars: 0,
      starred_paddle: false
    })

    const loadData = async (id) => {
      if (!id) return
      
      loading.value = true
      showError.value = false
      try {
        const response = await fetch('/userpaddle_summary_2024.csv')
        const csvText = await response.text()
        const results = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true
        })
        
        const userRecord = results.data.find(item => item.author === id)
        if (userRecord) {
          userData.value = {
            pr_count: parseInt(userRecord.pr_count) || 0,
            issue_count: parseInt(userRecord.issue_count) || 0,
            merge_count: parseInt(userRecord.merge_count) || 0,
            code_additions: parseInt(userRecord.total_additions) || 0,
            code_deletions: parseInt(userRecord.total_deletions) || 0,
            repo_count: (userRecord.repos?.split(',') || []).length,
            contributor_type: getContributorType(userRecord),
            first_pr_time: userRecord.first_pr_time || '',
            latest_pr_time: userRecord.latest_pr_time || '',
            midnight_pr_count: parseInt(userRecord.midnight_pr_count) || 0
          }
          determineUserTitle(userRecord)
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

    const getContributorType = (record) => {
      const prCount = parseInt(record.pr_count) || 0
      const issueCount = parseInt(record.issue_count) || 0
      const repoCount = (record.repos?.split(',') || []).length
      
      if (prCount >= 20 && repoCount >= 5) return '全能王者'
      if (prCount >= 10 && repoCount >= 3) return '资深贡献者'
      if (prCount >= 5) return '活跃开发者'
      if (issueCount >= 5) return '问题探索者'
      return '开源新星'
    }

    const determineUserTitle = (record) => {
      const prCount = parseInt(record.pr_count) || 0
      const issueCount = parseInt(record.issue_count) || 0
      const repoCount = (record.repos?.split(',') || []).length
      const hasMidnightPR = parseInt(record.midnight_pr_count) > 0

      if (hasMidnightPR) {
        userTitle.value = '深夜代码人'
      } else if (prCount >= 20 && repoCount >= 5) {
        userTitle.value = '开源领袖'
      } else if (prCount >= 10) {
        userTitle.value = '代码大师'
      } else if (prCount >= 5) {
        userTitle.value = '活跃贡献者'
      } else if (issueCount >= 5) {
        userTitle.value = '社区先锋'
      } else {
        userTitle.value = '开源探索者'
      }
    }

    const fetchGitHubData = async (username) => {
      githubData.value.loading = true
      githubData.value.error = null
      
      try {
        // 获取用户基本信息
        const userResponse = await fetch(`https://api.github.com/users/${username}`)
        if (!userResponse.ok) {
          throw new Error('未找到该 GitHub 用户')
        }
        const userData = await userResponse.json()
        
        // 获取2024年的PR数据
        const prResponse = await fetch(
          `https://api.github.com/search/issues?q=author:${username}+type:pr+created:2024-01-01..2024-12-31`
        )
        const prData = await prResponse.json()
        
        // 获取2024年的Issue数据
        const issueResponse = await fetch(
          `https://api.github.com/search/issues?q=author:${username}+type:issue+created:2024-01-01..2024-12-31`
        )
        const issueData = await issueResponse.json()
        
        // 获取是否star了Paddle
        const starResponse = await fetch(
          `https://api.github.com/users/${username}/starred/PaddlePaddle/Paddle`
        )
        
        githubData.value = {
          loading: false,
          error: null,
          pr_count: prData.total_count || 0,
          issue_count: issueData.total_count || 0,
          merge_count: 0, // 需要单独计算merged的PR
          following: userData.following || 0,
          followers: userData.followers || 0,
          stars: userData.public_repos || 0,
          starred_paddle: starResponse.status === 204
        }
      } catch (error) {
        console.error('Error fetching GitHub data:', error)
        githubData.value.loading = false
        githubData.value.error = '获取 GitHub 数据失败'
      }
    }

    const searchUser = () => {
      if (!inputGithubId.value.trim()) {
        showError.value = true
        errorMessage.value = '请输入 GitHub ID'
        return
      }
      
      const id = inputGithubId.value.trim()
      setGithubId(id) // 设置 githubId
      
      // 先尝试加载 PaddlePaddle 贡献数据
      loadData(id).then(() => {
        // 如果显示错误且是未找到记录，则获取 GitHub 数据
        if (showError.value && errorMessage.value === '未找到该用户的贡献记录') {
          fetchGitHubData(id)
        }
      })
    }

    const resetSearch = () => {
      clearGithubId()
      inputGithubId.value = ''
      userData.value = {}
      showError.value = false
      errorMessage.value = ''
      userTitle.value = ''
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return '暂无记录'
      const date = new Date(dateStr)
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
    }

    const getDaysSinceFirstPR = () => {
      if (!userData.value?.first_pr_time) return 0
      const firstPRDate = new Date(userData.value.first_pr_time)
      const today = new Date()
      const diffTime = Math.abs(today - firstPRDate)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const formatNumber = (num) => {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num
    }

    // 监听 githubId 的变化
    watch(githubId, (newId) => {
      if (newId && hasSearched.value) {
        loadData(newId)
      }
    })

    onMounted(() => {
      if (githubId.value && hasSearched.value) {
        loadData(githubId.value)
      } else if (githubId.value) {
        // 如果有 ID 但没有搜索状态，重新加载数据
        loadData(githubId.value)
      }
    })

    return {
      githubId,
      hasSearched,
      inputGithubId,
      userData,
      loading,
      showError,
      errorMessage,
      userTitle,
      searchUser,
      resetSearch,
      formatDate,
      showBlock1,
      showBlock2,
      showBlock3,
      showBlock4,
      getDaysSinceFirstPR,
      githubData,
      formatNumber
    }
  }
}
</script>

<style scoped>
.personal-achievements {
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

.achievements-content {
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
  .user-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .user-info {
    flex-direction: column;
  }

  .story-container {
    grid-template-columns: 1fr;
  }

  .story-text {
    font-size: 18px;
  }
}

.highlight {
  color: var(--accent-color);
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.github-stats {
  margin-top: 30px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
  border: 2px solid var(--accent-color);
}

.stats-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.stats-header img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid var(--accent-color);
}

.stats-header h3 {
  color: var(--accent-color);
  margin: 0;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.stat-item {
  text-align: center;
  flex: 1;
  background: rgba(124, 77, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(124, 77, 255, 0.3);
}

.stat-value {
  font-size: 24px;
  color: var(--accent-color);
  font-weight: bold;
}

.stat-label {
  font-size: 14px;
  color: #fff;
  opacity: 0.8;
  margin-top: 5px;
}

.paddle-status {
  text-align: center;
  padding: 10px;
  background: rgba(124, 77, 255, 0.1);
  border-radius: 8px;
  margin-top: 10px;
}

.status-icon {
  font-size: 20px;
  margin-right: 8px;
}

.status-icon.starred {
  color: #FFD700;
}

.community-guide {
  margin-top: 30px;
  text-align: left;
}

.community-guide h3 {
  color: var(--accent-color);
  margin-bottom: 20px;
  text-align: center;
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.guide-step {
  background: rgba(124, 77, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(124, 77, 255, 0.3);
  transition: transform 0.3s ease;
}

.guide-step:hover {
  transform: translateX(5px);
}

.guide-step a {
  color: var(--accent-color);
  text-decoration: none;
}

.guide-step a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .stats-row {
    flex-direction: column;
  }
  
  .stat-item {
    margin-bottom: 10px;
  }
}
</style> 