<template>
  <div class="contribution-trends">
    <h1 class="pixel-title">贡献趋势</h1>

    <div class="trends-container">
      <div v-if="loading" class="loading">
        加载中...
      </div>
      <div v-else-if="showError" class="error-message">
        {{ errorMessage }}
        <div class="guide-action">
          <router-link to="/share" class="guide-button">
            查看我的年度总结海报
          </router-link>
        </div>
      </div>
      <div v-else class="story-container">
        <div class="story-text">
          <div class="text-block" v-show="showBlock1">
            在2024年，你的贡献之路如同一场精彩的冒险。
            <span class="highlight">{{ getTotalContributions() }}</span> 次贡献，
            平均每月 <span class="highlight">{{ getMonthlyAverage() }}</span> 次，
            展现了你持续不断的探索精神。
          </div>

          <div class="text-block" v-show="showBlock2">
            你最活跃的月份是 <span class="highlight">{{ getMostActiveMonth() }}</span>，
            贡献了 <span class="highlight">{{ getMaxContributions() }}</span> 次，
            这个月你简直就是开源世界的超级英雄！
          </div>
        </div>

        <div class="chart-container" v-show="showBlock3" ref="chartRef"></div>

        <!-- 详情弹窗 -->
        <div v-if="showDetail" class="detail-modal" @click.self="showDetail = false">
          <div class="detail-content pixel-box">
            <div class="detail-header">
              <h3>{{ selectedMonth }}详情</h3>
              <button class="close-btn" @click="showDetail = false">×</button>
            </div>
            <div class="detail-body">
              <div class="detail-item">
                <div class="detail-label">Issues</div>
                <div class="detail-value">{{ selectedData.issues }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">PRs</div>
                <div class="detail-value">{{ selectedData.prs }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Merges</div>
                <div class="detail-value">{{ selectedData.merges }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">总贡献</div>
                <div class="detail-value">{{ selectedData.total }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <page-navigation />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import PageNavigation from '../components/PageNavigation.vue'
import * as echarts from 'echarts'
import Papa from 'papaparse'
import { useUserStore } from '../store/userStore'

export default {
  name: 'ContributionTrends',
  components: {
    PageNavigation
  },
  setup() {
    const { githubId, hasSearched } = useUserStore()
    const loading = ref(false)
    const showError = ref(false)
    const errorMessage = ref('')
    const chartRef = ref(null)
    const chart = ref(null)
    const showBlock1 = ref(false)
    const showBlock2 = ref(false)
    const showBlock3 = ref(false)
    const userData = ref([])
    const showDetail = ref(false)
    const selectedMonth = ref('')
    const selectedData = ref({
      issues: 0,
      prs: 0,
      merges: 0,
      total: 0
    })

    const getTotalContributions = () => {
      if (!userData.value.length) return 0
      return userData.value.reduce((total, item) => {
        return total + (parseInt(item.Issues) || 0) + 
               (parseInt(item.PRs) || 0) + 
               (parseInt(item.Merges) || 0)
      }, 0)
    }

    const getMonthlyAverage = () => {
      const total = getTotalContributions()
      return Math.round(total / 12)
    }

    const getMostActiveMonth = () => {
      if (!userData.value.length) return '1月'
      let maxMonth = '1'
      let maxValue = 0

      userData.value.forEach(item => {
        const total = (parseInt(item.Issues) || 0) + 
                     (parseInt(item.PRs) || 0) + 
                     (parseInt(item.Merges) || 0)
        if (total > maxValue) {
          maxValue = total
          maxMonth = item.Month
        }
      })

      return `${maxMonth}月`
    }

    const getMaxContributions = () => {
      if (!userData.value.length) return 0
      return userData.value.reduce((max, item) => {
        const total = (parseInt(item.Issues) || 0) + 
                     (parseInt(item.PRs) || 0) + 
                     (parseInt(item.Merges) || 0)
        return Math.max(max, total)
      }, 0)
    }

    const loadData = async () => {
      if (!githubId.value || !hasSearched.value) {
        showError.value = true
        errorMessage.value = '请先在个人成就墙页面输入 GitHub ID'
        return
      }

      loading.value = true
      showError.value = false
      showBlock1.value = false
      showBlock2.value = false
      showBlock3.value = false

      try {
        console.log('Loading data for user:', githubId.value)
        const response = await fetch('/userpaddle_monthly_contributions_2024.csv')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const csvText = await response.text()
        
        const results = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true
        })
        
        if (results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors)
          throw new Error('CSV parsing failed')
        }

        userData.value = results.data.filter(item => item.User === githubId.value)
        console.log('Filtered user data:', userData.value)
        
        if (userData.value.length > 0) {
          createChart()
          
          setTimeout(() => { showBlock1.value = true }, 500)
          setTimeout(() => { showBlock2.value = true }, 1500)
          setTimeout(() => { showBlock3.value = true }, 2500)
        } else {
          showError.value = true
          errorMessage.value = '未找到该用户的贡献数据'
        }
      } catch (error) {
        console.error('Error loading data:', error)
        showError.value = true
        errorMessage.value = '数据加载失败，请稍后重试'
      } finally {
        loading.value = false
      }
    }

    const handleChartClick = (params) => {
      if (params.componentType === 'series') {
        const monthIndex = params.dataIndex
        const monthData = userData.value[monthIndex]
        if (monthData) {
          selectedMonth.value = `${monthData.Month}月`
          selectedData.value = {
            issues: parseInt(monthData.Issues) || 0,
            prs: parseInt(monthData.PRs) || 0,
            merges: parseInt(monthData.Merges) || 0,
            total: (parseInt(monthData.Issues) || 0) + 
                   (parseInt(monthData.PRs) || 0) + 
                   (parseInt(monthData.Merges) || 0)
          }
          showDetail.value = true
        }
      }
    }

    const createChart = () => {
      if (chart.value) {
        chart.value.dispose()
      }

      if (!chartRef.value) {
        console.error('Chart container not found')
        return
      }

      const container = chartRef.value
      chart.value = echarts.init(container, null, {
        renderer: 'canvas',
        width: 'auto',
        height: 'auto'
      })
      
      const processMonthlyData = (data) => {
        // 按月份排序数据
        const sortedData = [...data].sort((a, b) => parseInt(a.Month) - parseInt(b.Month))
        
        const months = sortedData.map(item => `${item.Month}月`)
        const prs = sortedData.map(item => parseInt(item.PRs) || 0)
        const issues = sortedData.map(item => parseInt(item.Issues) || 0)
        const merges = sortedData.map(item => parseInt(item.Merges) || 0)
        
        return {
          months,
          pr: prs,
          issue: issues,
          merge: merges
        }
      }

      const chartData = processMonthlyData(userData.value)

      console.log('Chart data:', chartData)

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            let result = `${params[0].axisValue}<br/>`
            params.forEach(param => {
              result += `${param.seriesName}: ${param.value}<br/>`
            })
            return result
          }
        },
        legend: {
          data: ['Issues', 'PRs', 'Merges'],
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          top: 10,
          icon: 'roundRect'
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: chartData.months,
          axisLine: {
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          axisLabel: {
            color: '#fff',
            fontSize: 12,
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          axisLabel: {
            color: '#fff',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: 'Issues',
            type: 'line',
            data: chartData.issue,
            smooth: true,
            symbol: 'circle',
            symbolSize: 10,
            itemStyle: {
              color: '#FF6B6B',
              borderWidth: 2,
              borderColor: '#fff'
            },
            lineStyle: {
              width: 3
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
                { offset: 1, color: 'rgba(255, 107, 107, 0.1)' }
              ])
            }
          },
          {
            name: 'PRs',
            type: 'line',
            data: chartData.pr,
            smooth: true,
            symbol: 'circle',
            symbolSize: 10,
            itemStyle: {
              color: '#4ECDC4',
              borderWidth: 2,
              borderColor: '#fff'
            },
            lineStyle: {
              width: 3
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(78, 205, 196, 0.3)' },
                { offset: 1, color: 'rgba(78, 205, 196, 0.1)' }
              ])
            }
          },
          {
            name: 'Merges',
            type: 'line',
            data: chartData.merge,
            smooth: true,
            symbol: 'circle',
            symbolSize: 10,
            itemStyle: {
              color: '#FFD93D',
              borderWidth: 2,
              borderColor: '#fff'
            },
            lineStyle: {
              width: 3
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 217, 61, 0.3)' },
                { offset: 1, color: 'rgba(255, 217, 61, 0.1)' }
              ])
            }
          }
        ]
      }

      try {
        chart.value.setOption(option)
        chart.value.on('click', handleChartClick)
        
        // 自适应处理
        const resizeObserver = new ResizeObserver(() => {
          chart.value.resize()
        })
        resizeObserver.observe(container)
        
      } catch (error) {
        console.error('Error setting chart option:', error)
      }
    }

    // 监听窗口大小变化
    const handleResize = () => {
      if (chart.value) {
        try {
          chart.value.resize()
        } catch (error) {
          console.error('Error resizing chart:', error)
        }
      }
    }

    // 确保在组件挂载后初始化图表
    onMounted(() => {
      console.log('Component mounted, githubId:', githubId.value, 'hasSearched:', hasSearched.value)
      if (githubId.value && hasSearched.value) {
        loadData()
      }
      window.addEventListener('resize', handleResize)
    })

    // 确保在组件更新后重新调整图表大小
    const resizeChart = () => {
      if (chart.value && chartRef.value) {
        nextTick(() => {
          chart.value.resize()
        })
      }
    }

    watch([showBlock3], () => {
      if (showBlock3.value) {
        nextTick(() => {
          createChart()
        })
      }
    })

    watch(githubId, (newId) => {
      if (newId && hasSearched.value) {
        loadData()
      }
    })

    onUnmounted(() => {
      if (chart.value) {
        chart.value.dispose()
      }
      window.removeEventListener('resize', handleResize)
    })

    return {
      loading,
      showError,
      errorMessage,
      chartRef,
      showBlock1,
      showBlock2,
      showBlock3,
      getTotalContributions,
      getMonthlyAverage,
      getMostActiveMonth,
      getMaxContributions,
      showDetail,
      selectedMonth,
      selectedData
    }
  }
}
</script>

<style scoped>
.contribution-trends {
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

.trends-container {
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

.chart-container {
  height: 500px;
  background: rgba(0, 0, 0, 0.2);
  border: 4px solid var(--accent-color);
  border-radius: 8px;
  padding: 20px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s ease forwards;
}

.highlight {
  color: var(--accent-color);
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
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

  .chart-container {
    height: 400px;
    padding: 10px;
  }
}

.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.detail-content {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 0;
  min-width: 300px;
  position: relative;
}

.pixel-box {
  border: 4px solid var(--accent-color);
  box-shadow: 0 0 0 4px #000;
  position: relative;
  background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
}

.pixel-box::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid var(--accent-color);
  pointer-events: none;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--accent-color);
}

.detail-header h3 {
  color: var(--accent-color);
  font-size: 20px;
  margin: 0;
  text-shadow: 2px 2px 0 #000;
}

.close-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.detail-body {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.detail-item {
  text-align: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border: 2px solid var(--accent-color);
}

.detail-label {
  color: var(--text-color);
  font-size: 14px;
  margin-bottom: 5px;
}

.detail-value {
  color: var(--accent-color);
  font-size: 24px;
  font-weight: bold;
  text-shadow: 1px 1px 0 #000;
}

@media (max-width: 768px) {
  .detail-content {
    width: 90%;
    margin: 0 20px;
  }

  .detail-body {
    grid-template-columns: 1fr;
  }
}

.guide-action {
  margin-top: 20px;
  text-align: center;
}

.guide-button {
  display: inline-block;
  background: rgba(124, 77, 255, 0.2);
  border: 2px solid var(--accent-color);
  color: var(--text-color);
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  transition: all 0.3s ease;
}

.guide-button:hover {
  background: rgba(124, 77, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style> 