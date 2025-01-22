<template>
  <div class="leaderboard">
    <h1 class="pixel-title">开源之星</h1>

    <div class="stars-content">
      <div class="period-section">
        <h2 class="period-title">2024 年上半年开源之星</h2>
        <div class="stars-grid">
          <div 
            v-for="(contributor, index) in firstHalfContributors" 
            :key="index"
            class="star-card"
            @mouseover="showDetails(contributor)"
            @mouseleave="hideDetails"
            @click="contributor.status !== '???' && goToGitHub(contributor.author)"
          >
            <div class="star-avatar">
              <img v-if="contributor.status !== '???'" :src="'https://github.com/' + contributor.author + '.png'" :alt="contributor.author">
              <div v-else class="mystery-avatar">???</div>
            </div>
            <div class="star-info">
              <div class="star-name">{{ contributor.status !== '???' ? contributor.author : '???' }}</div>
              <div class="star-title">{{ contributor.title }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="period-section">
        <h2 class="period-title">2024 年下半年开源之星</h2>
        <div class="stars-grid">
          <div 
            v-for="(contributor, index) in secondHalfContributors" 
            :key="index"
            class="star-card"
            @mouseover="showDetails(contributor)"
            @mouseleave="hideDetails"
            @click="contributor.status !== '???' && goToGitHub(contributor.author)"
          >
            <div class="star-avatar">
              <img v-if="contributor.status !== '???'" :src="'https://github.com/' + contributor.author + '.png'" :alt="contributor.author">
              <div v-else class="mystery-avatar">???</div>
            </div>
            <div class="star-info">
              <div class="star-name">{{ contributor.status !== '???' ? contributor.author : '???' }}</div>
              <div class="star-title">{{ contributor.title }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="details-popup" v-if="selectedContributor && selectedContributor.status !== '???'" :style="popupStyle">
        <div class="popup-content">
          <h3>{{ selectedContributor.author }}</h3>
          <div class="contribution-stats">
            <div class="stat-item">
              <div class="stat-icon pr-icon"></div>
              <div class="stat-info">
                <div class="stat-label">PR数量</div>
                <div class="stat-value">{{ getPRCount(selectedContributor) }}</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon issue-icon"></div>
              <div class="stat-info">
                <div class="stat-label">Issue数量</div>
                <div class="stat-value">{{ getIssueCount(selectedContributor) }}</div>
              </div>
            </div>
          </div>
          <div class="projects-involved">
            <h4>参与项目</h4>
            <div class="project-tags">
              <span 
                v-for="(project, index) in getProjects(selectedContributor)" 
                :key="index" 
                class="project-tag"
              >
                {{ project }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <page-navigation />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import PageNavigation from '../components/PageNavigation.vue'
import Papa from 'papaparse'

export default {
  name: 'Leaderboard',
  components: {
    PageNavigation
  },
  setup() {
    const contributors = ref([])
    const selectedContributor = ref(null)
    const popupStyle = ref({})

    const firstHalfContributors = computed(() => {
      return contributors.value.filter(c => c.period === '上半年')
    })

    const secondHalfContributors = computed(() => {
      return contributors.value.filter(c => c.period === '下半年')
    })

    const loadData = async () => {
      try {
        const response = await fetch('/Open Source Star.csv')
        const csvText = await response.text()
        const results = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true
        })
        
        contributors.value = results.data.map(item => ({
          author: item.author,
          title: item.title || '开源贡献者',
          period: item.period,
          status: item.status || 'show',
          contributions: [{
            pr_count: parseFloat(item.pr_count) || 0,
            issue_count: parseFloat(item.issue_count) || 0,
            merge_count: parseFloat(item.merge_count) || 0,
            repos: item.repos?.split(',').map(repo => repo.trim()) || []
          }]
        }))
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    const getPRCount = (contributor) => 
      contributor.contributions[0].pr_count

    const getIssueCount = (contributor) => 
      contributor.contributions[0].issue_count

    const getProjects = (contributor) => 
      contributor.contributions[0].repos || []

    const showDetails = (contributor) => {
      selectedContributor.value = contributor
      const event = window.event
      const rect = event.target.getBoundingClientRect()
      popupStyle.value = {
        position: 'fixed',
        top: `${rect.bottom + 10}px`,
        left: `${rect.left}px`
      }
    }

    const hideDetails = () => {
      selectedContributor.value = null
    }

    const goToGitHub = (username) => {
      window.open(`https://github.com/${username}`, '_blank')
    }

    onMounted(() => {
      loadData()
    })

    return {
      contributors,
      firstHalfContributors,
      secondHalfContributors,
      selectedContributor,
      popupStyle,
      getPRCount,
      getIssueCount,
      getProjects,
      showDetails,
      hideDetails,
      goToGitHub
    }
  }
}
</script>

<style scoped>
.leaderboard {
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

.period-section {
  margin-bottom: 60px;
}

.period-title {
  text-align: center;
  color: var(--accent-color);
  font-size: 20px;
  margin-bottom: 30px;
  text-shadow: 1px 1px 0 #000;
}

.stars-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.stars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.star-card {
  background: rgba(0, 0, 0, 0.3);
  border: 4px solid var(--accent-color);
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.star-card:hover {
  transform: translateY(-5px);
}

.star-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--accent-color);
}

.star-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.star-info {
  text-align: center;
  width: 100%;
  overflow: hidden;
}

.star-name {
  color: var(--text-color);
  font-size: clamp(10px, 2.5vw, 16px);
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 5px;
}

.star-title {
  color: var(--accent-color);
  font-size: clamp(8px, 2vw, 14px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 5px;
}

.details-popup {
  position: fixed;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.95);
  border: 4px solid var(--accent-color);
  padding: 20px;
  min-width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.popup-content h3 {
  color: var(--accent-color);
  font-size: 18px;
  margin-bottom: 15px;
  text-align: center;
}

.contribution-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-icon {
  width: 32px;
  height: 32px;
  margin: 0 auto 5px;
  background-color: var(--accent-color);
}

.pr-icon { clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%); }
.issue-icon { clip-path: circle(50% at 50% 50%); }

.stat-info {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: var(--text-color);
  margin-bottom: 3px;
}

.stat-value {
  font-size: 16px;
  color: var(--accent-color);
}

.projects-involved h4 {
  color: var(--text-color);
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.project-tag {
  background: rgba(124, 77, 255, 0.2);
  color: var(--text-color);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid var(--accent-color);
}

.mystery-avatar {
  width: 100%;
  height: 100%;
  background: rgba(124, 77, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--accent-color);
  font-weight: bold;
}

.star-card[data-status="???"] {
  cursor: default;
}

@media (max-width: 768px) {
  .stars-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .star-avatar {
    width: 60px;
    height: 60px;
  }

  .star-name {
    font-size: clamp(8px, 3vw, 14px);
  }

  .star-title {
    font-size: clamp(6px, 2.5vw, 12px);
  }

  .details-popup {
    position: fixed;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 300px;
  }
}
</style> 