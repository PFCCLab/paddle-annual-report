<template>
  <div class="time-records">
    <h1 class="pixel-title">时间记录</h1>

    <div v-if="loading" class="loading">
      加载中...
    </div>
    <div v-else-if="showError" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-else class="story-container">
      <div class="story-text">
        <div class="text-block" v-show="showBlock1">
          在2024年，你创造了一些令人印象深刻的时间记录。
          <template v-if="userData.max_additions">
            <span class="highlight">{{ formatNumber(userData.max_additions) }}</span> 行代码是你单次提交的最高记录，
            发生在 <span class="highlight">{{ formatDate(userData.max_additions_time) }}</span>，
          </template>
          <template v-else>
            期待你在PaddlePaddle社区的第一个贡献！
          </template>
        </div>

        <div class="text-block" v-show="showBlock2">
          <template v-if="userData.fastest_merge_time">
            你最快的一次PR合入用时 <span class="highlight">{{ formatMergeTime(userData.fastest_merge_time) }}</span>，
            展现了高效的协作能力。
          </template>
          <template v-else>
            你还没有合入记录，期待你的第一个高效PR！
            在PaddlePaddle社区，我们重视代码质量和高效协作。
          </template>
        </div>

        <div class="text-block" v-show="showBlock3">
          <template v-if="userData.latest_night_submission_time">
            你在 <span class="highlight">{{ formatDate(userData.latest_night_submission_time) }}</span> 
            还在为PaddlePaddle默默耕耘，这份热情让人敬佩。
          </template>
          <template v-else>
            你没有凌晨提交记录，是一位作息规律的优秀开发者。
            保持健康的工作节奏，让开源之路走得更远！
          </template>
        </div>

        <div class="text-block" v-show="showBlock4">
          你的最大代码删除是 <span class="highlight">{{ formatNumber(userData.max_deletions) }}</span> 行，
          发生在 <span class="highlight">{{ formatDate(userData.max_deletions_time) }}</span>
        </div>
      </div>

      <div class="records-grid" v-show="showBlock4">
        <div class="record-card" v-if="userData.max_additions">
          <div class="record-icon max-additions"></div>
          <div class="record-content">
            <div class="record-title">最大代码提交</div>
            <div class="record-value">{{ formatNumber(userData.max_additions) }} 行</div>
            <div class="record-time">{{ formatDate(userData.max_additions_time) }}</div>
            <div class="record-link">
              <a :href="userData.max_additions_pr_link" target="_blank">查看PR</a>
            </div>
          </div>
        </div>

        <div class="record-card" v-if="userData.max_deletions">
          <div class="record-icon max-deletions"></div>
          <div class="record-content">
            <div class="record-title">最大代码删除</div>
            <div class="record-value">{{ formatNumber(userData.max_deletions) }} 行</div>
            <div class="record-time">{{ formatDate(userData.max_deletions_time) }}</div>
            <div class="record-link">
              <a :href="userData.max_deletions_pr_link" target="_blank">查看PR</a>
            </div>
          </div>
        </div>

        <div class="record-card" v-if="userData.fastest_merge_time">
          <div class="record-icon merge-time"></div>
          <div class="record-content">
            <div class="record-title">最快合入时间</div>
            <div class="record-value">{{ formatMergeTime(userData.fastest_merge_time) }}</div>
            <div class="record-link">
              <a :href="getFastestMergePRLink()" target="_blank">查看PR</a>
            </div>
          </div>
        </div>

        <div class="record-card" v-if="userData.latest_night_submission_time">
          <div class="record-icon latest-time"></div>
          <div class="record-content">
            <div class="record-title">凌晨提交</div>
            <div class="record-value">{{ formatDate(userData.latest_night_submission_time) }}</div>
            <div class="record-link">
              <a :href="getLatestNightSubmissionLink()" target="_blank">查看提交</a>
            </div>
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
import Papa from 'papaparse'
import { useUserStore } from '../store/userStore'

export default {
  name: 'TimeRecords',
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

    const loadData = async () => {
      if (!githubId.value) {
        showError.value = true
        errorMessage.value = '请先输入 GitHub ID'
        return
      }

      loading.value = true
      showError.value = false
      try {
        const response = await fetch('/userpaddle_timerecord_contributions_2024.csv')
        const csvText = await response.text()
        const results = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true
        })
        
        const userRecord = results.data.find(item => item.author === githubId.value)
        if (userRecord) {
          userData.value = {
            max_additions: parseInt(userRecord.max_additions) || 0,
            max_additions_time: userRecord.max_additions_time || '',
            max_additions_pr_link: userRecord.max_additions_pr_link || '#',
            max_deletions: parseInt(userRecord.max_deletions) || 0,
            max_deletions_time: userRecord.max_deletions_time || '',
            max_deletions_pr_link: userRecord.max_deletions_pr_link || '#',
            fastest_merge_time: userRecord.fastest_merge_time || '',
            fastest_merge_pr_link: userRecord.fastest_merge_pr_link || '#',
            latest_night_submission_time: userRecord.latest_night_submission_time || '',
            latest_night_submission_link: userRecord.latest_night_submission_link || '#'
          }
          
          setTimeout(() => { showBlock1.value = true }, 500)
          setTimeout(() => { showBlock2.value = true }, 1500)
          setTimeout(() => { showBlock3.value = true }, 2500)
          setTimeout(() => { showBlock4.value = true }, 3500)
        } else {
          showError.value = true
          errorMessage.value = '未找到该用户的时间记录数据'
        }
      } catch (error) {
        console.error('Error loading data:', error)
        showError.value = true
        errorMessage.value = '数据加载失败，请稍后重试'
      } finally {
        loading.value = false
      }
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return '暂无记录'
      const date = new Date(dateStr)
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
    }

    const formatMergeTime = (timeStr) => {
      if (!timeStr) return '暂无记录'
      // 解析类似 "0 days 22:30:36" 的格式
      const match = timeStr.match(/(\d+) days (\d+):(\d+):(\d+)/)
      if (!match) return timeStr
      
      const [_, days, hours, minutes, seconds] = match
      const daysNum = parseInt(days)
      const hoursNum = parseInt(hours)
      const minutesNum = parseInt(minutes)
      const secondsNum = parseInt(seconds)
      
      if (daysNum > 0) {
        return `${daysNum}天${hoursNum}小时${minutesNum}分${secondsNum}秒`
      } else if (hoursNum > 0) {
        return `${hoursNum}小时${minutesNum}分${secondsNum}秒`
      } else if (minutesNum > 0) {
        return `${minutesNum}分${secondsNum}秒`
      } else {
        return `${secondsNum}秒`
      }
    }

    const formatNumber = (num) => {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num
    }

    const getMaxAdditions = () => {
      return userData.value?.max_additions || 0
    }

    const getMaxAdditionsTime = () => {
      return formatDate(userData.value?.max_additions_time)
    }

    const getMaxAdditionsLink = () => {
      return userData.value?.max_additions_pr_link || '#'
    }

    const getMaxDeletions = () => {
      return userData.value?.max_deletions || 0
    }

    const getMaxDeletionsTime = () => {
      return formatDate(userData.value?.max_deletions_time)
    }

    const getMaxDeletionsLink = () => {
      return userData.value?.max_deletions_pr_link || '#'
    }

    const getFastestMergeTime = () => {
      return formatMergeTime(userData.value?.fastest_merge_time)
    }

    const getFastestMergePRLink = () => {
      return userData.value?.fastest_merge_pr_link || '#'
    }

    const getLatestNightSubmission = () => {
      return formatDate(userData.value?.latest_night_submission_time)
    }

    const getLatestNightSubmissionLink = () => {
      return userData.value?.latest_night_submission_link || '#'
    }

    onMounted(() => {
      loadData()
    })

    return {
      loading,
      showError,
      errorMessage,
      showBlock1,
      showBlock2,
      showBlock3,
      showBlock4,
      userData,
      getMaxAdditions,
      getMaxAdditionsTime,
      getMaxAdditionsLink,
      getMaxDeletions,
      getMaxDeletionsTime,
      getMaxDeletionsLink,
      getFastestMergeTime,
      getFastestMergePRLink,
      getLatestNightSubmission,
      getLatestNightSubmissionLink,
      formatDate,
      formatMergeTime,
      formatNumber
    }
  }
}
</script>

<style scoped>
.time-records {
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

.records-grid {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s ease forwards;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin: 40px 0;
}

.record-card {
  background: rgba(0, 0, 0, 0.3);
  border: 4px solid var(--accent-color);
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease;
}

.record-card:hover {
  transform: translateY(-5px);
}

.record-icon {
  width: 48px;
  height: 48px;
  background-color: var(--accent-color);
  flex-shrink: 0;
}

.max-additions {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.max-deletions {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

.merge-time {
  clip-path: circle(50% at 50% 50%);
}

.latest-time {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.record-content {
  flex-grow: 1;
}

.record-title {
  color: var(--text-color);
  font-size: 16px;
  margin-bottom: 10px;
}

.record-value {
  color: var(--accent-color);
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.record-time {
  color: var(--text-color);
  font-size: 14px;
  opacity: 0.8;
}

.record-link {
  margin-top: 10px;
}

.record-link a {
  color: var(--accent-color);
  text-decoration: none;
  font-size: 14px;
  transition: opacity 0.3s ease;
}

.record-link a:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .story-text {
    font-size: 18px;
  }

  .records-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .record-card {
    padding: 15px;
  }

  .record-icon {
    width: 40px;
    height: 40px;
  }

  .record-value {
    font-size: 20px;
  }
}
</style> 