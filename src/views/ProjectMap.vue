<template>
  <div class="project-map">
    <h1 class="pixel-title">项目地图</h1>

    <div class="map-container">
      <div v-if="loading" class="loading">
        加载中...
      </div>
      <div v-else-if="showError" class="error-message">
        {{ errorMessage }}
        <div class="guide-text" v-if="errorMessage === '未找到项目数据'">
          <p>还没有参与过PaddlePaddle的项目开发？现在就开始你的开源之旅吧！</p>
          <div class="guide-steps">
            <div class="guide-step">
              1. 访问 <a href="https://github.com/PaddlePaddle" target="_blank" class="highlight-link">PaddlePaddle GitHub</a> 浏览感兴趣的项目
            </div>
            <div class="guide-step">
              2. 在 <a href="https://github.com/PaddlePaddle/Paddle/issues" target="_blank" class="highlight-link">Issues</a> 中寻找适合入门的任务
            </div>
            <div class="guide-step">
              3. 加入 <a href="https://github.com/PaddlePaddle/Paddle/blob/develop/docs/design/community/community_guide_cn.md" target="_blank" class="highlight-link">PaddlePaddle 开发者社区</a>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="story-container">
        <div class="story-text">
          <div class="text-block" v-show="showBlock1">
            在2024年，你一共参与了 <span class="highlight">{{ projectCount }}</span> 个项目。
            每个项目都是一座独特的小岛，记录着你的开源足迹。
          </div>
        </div>

        <div class="islands-container" v-show="showBlock2">
          <div 
            v-for="(project, index) in projectList" 
            :key="index"
            class="island"
            @click="showProjectDetails(project)"
          >
            <div class="island-content">
              <div class="island-name">{{ project }}</div>
            </div>
          </div>
        </div>

        <div v-if="selectedProject" class="project-details">
          <h3>项目详情</h3>
          <p>{{ selectedProject }}</p>
          <button class="close-button" @click="selectedProject = null">关闭</button>
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
  name: 'ProjectMap',
  components: {
    PageNavigation
  },
  setup() {
    const { githubId } = useUserStore()
    const loading = ref(false)
    const showError = ref(false)
    const errorMessage = ref('')
    const projectCount = ref(0)
    const projectList = ref([])
    const selectedProject = ref(null)
    const showBlock1 = ref(false)
    const showBlock2 = ref(false)

    const loadData = async () => {
      loading.value = true
      showError.value = false
      try {
        const response = await fetch('/project_2024.csv')
        const csvText = await response.text()
        const results = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true
        })
        
        const userRecord = results.data.find(item => item.User === githubId.value)
        if (userRecord) {
          projectCount.value = parseInt(userRecord['Project Count']) || 0
          projectList.value = userRecord['Project Names']?.split(',').map(p => p.trim()) || []
          
          setTimeout(() => { showBlock1.value = true }, 500)
          setTimeout(() => { showBlock2.value = true }, 1500)
        } else {
          showError.value = true
          errorMessage.value = '未找到项目数据'
        }
      } catch (error) {
        console.error('Error loading data:', error)
        showError.value = true
        errorMessage.value = '数据加载失败，请稍后重试'
      } finally {
        loading.value = false
      }
    }

    const showProjectDetails = (project) => {
      selectedProject.value = project
    }

    onMounted(() => {
      if (githubId.value) {
        loadData()
      }
    })

    return {
      loading,
      showError,
      errorMessage,
      projectCount,
      projectList,
      selectedProject,
      showBlock1,
      showBlock2,
      showProjectDetails
    }
  }
}
</script>

<style scoped>
.project-map {
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

.map-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.islands-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s ease forwards;
}

.island {
  background: rgba(0, 0, 0, 0.3);
  border: 4px solid var(--accent-color);
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.island:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(124, 77, 255, 0.3);
}

.island-content {
  color: var(--text-color);
}

.island-name {
  font-size: 16px;
  word-break: break-word;
}

.project-details {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(26, 35, 126, 0.95);
  border: 4px solid var(--accent-color);
  padding: 30px;
  border-radius: 8px;
  max-width: 80%;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
  color: var(--text-color);
}

.project-details h3 {
  color: var(--accent-color);
  margin-bottom: 20px;
  font-size: 24px;
}

.close-button {
  background: rgba(124, 77, 255, 0.2);
  border: 2px solid var(--accent-color);
  padding: 10px 20px;
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.2s ease;
  border-radius: 4px;
}

.close-button:hover {
  background: rgba(124, 77, 255, 0.3);
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

.guide-text {
  margin-top: 20px;
  text-align: center;
  color: var(--text-color);
  font-size: 18px;
  line-height: 1.6;
}

.guide-steps {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.guide-step {
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid var(--accent-color);
  padding: 15px;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.guide-step:hover {
  transform: translateY(-2px);
}

.highlight-link {
  color: var(--accent-color);
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.highlight-link:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .islands-container {
    grid-template-columns: 1fr;
  }

  .story-text {
    font-size: 18px;
  }

  .project-details {
    width: 90%;
    max-height: 70vh;
  }

  .guide-text {
    font-size: 16px;
  }

  .guide-steps {
    padding: 0 20px;
  }
}
</style> 
