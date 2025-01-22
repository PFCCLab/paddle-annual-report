<template>
    <div class="share">
      <h1 class="pixel-title">分享你的年度总结</h1>
  
      <div class="poster-container">
        <div ref="posterRef" class="poster">
          <div class="poster-background"></div>
          <div class="poster-content-wrapper">
            <div class="poster-header">
              <div class="avatar-container">
                <img 
                  ref="avatarRef"
                  :src="avatarUrl" 
                  class="user-avatar" 
                  alt="用户头像"
                  @error="handleAvatarError"
                  crossorigin="anonymous"
                >
              </div>
              <div class="header-text">
                <h2>2024 PaddlePaddle 开源之旅</h2>
                <p class="subtitle">{{ githubId }} 的年度成就</p>
              </div>
            </div>
  
            <div class="poster-content">
              <template v-if="posterData.isContributor">
                <div class="achievement-section">
                  <h3>年度贡献</h3>
                  <div class="contribution-stats">
                    <div class="stat-item">
                      <div class="stat-value">{{ formatNumber(userData.pr_count) }}</div>
                      <div class="stat-label">PR 提交</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-value">{{ formatNumber(userData.issue_count) }}</div>
                      <div class="stat-label">Issue 创建</div>
                    </div>
                  </div>
                </div>
  
                <div class="keywords-section">
                  <h3>年度关键词</h3>
                  <div class="keywords">
                    <div v-for="(keyword, index) in userData.keywords" 
                         :key="index" 
                         class="keyword">
                      {{ keyword }}
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="achievement-section">
                  <h3>GitHub 数据</h3>
                  <div class="stats">
                    <div class="stat-item">
                      <div class="stat-value">{{ formatNumber(posterData.following) }}</div>
                      <div class="stat-label">Following</div>
                    </div>
                  </div>
                  <div class="stats" style="margin-top: 20px;">
                    <div class="stat-item">
                      <div class="stat-value">{{ formatNumber(posterData.followers) }}</div>
                      <div class="stat-label">Followers</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-value">{{ formatNumber(posterData.stars) }}</div>
                      <div class="stat-label">Stars</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-value">{{ posterData.starredPaddle ? '⭐' : '☆' }}</div>
                      <div class="stat-label">Paddle Star</div>
                    </div>
                  </div>
                </div>
  
                <div class="code-section">
                  <h3>开启你的 PaddlePaddle 之旅</h3>
                  <div class="guide-text">
                    在2025年，让我们一起参与 PaddlePaddle 开源社区的建设！
                    <br>
                    从一个 Star 开始，到提交第一个 PR，
                    <br>
                    你将在这里遇见更多志同道合的开发者。
                  </div>
                </div>
  
                <div class="keywords-section">
                  <h3>参与方式</h3>
                  <div class="guide-steps">
                    <a href="https://github.com/PaddlePaddle/Paddle" target="_blank" class="guide-step">1. Star PaddlePaddle 项目，持续关注最新动态</a>
                    <a href="https://github.com/PaddlePaddle/Paddle/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22" target="_blank" class="guide-step">2. 浏览 Good First Issues，寻找适合入门的任务</a>
                    <a href="https://github.com/PaddlePaddle/Paddle/blob/develop/CONTRIBUTING_CN.md" target="_blank" class="guide-step">3. 阅读贡献指南，了解参与社区的方法</a>
                    <a href="https://github.com/PaddlePaddle/Paddle/discussions" target="_blank" class="guide-step">4. 加入开发者社区，与其他贡献者交流</a>
                  </div>
                </div>
              </template>
  
              <div class="footer">
                <p>感谢你对开源社区的关注！</p>
                <p>让我们在 2025 年继续携手前行！</p>
                <img 
                  src="/paddle-logo.png" 
                  class="paddle-logo" 
                  alt="PaddlePaddle Logo"
                  crossorigin="anonymous"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="action-buttons">
        <button class="pixel-button" @click="generatePoster">生成海报</button>
        <button class="pixel-button share-wechat" @click="shareToWeChat">
          <i class="fab fa-weixin"></i> 分享到微信
        </button>
        <button class="pixel-button share-weibo" @click="shareToWeibo">
          <i class="fab fa-weibo"></i> 分享到微博
        </button>
        <button class="pixel-button share-x" @click="shareToX">
          <i class="fab fa-x-twitter"></i> 分享到 X
        </button>
      </div>
  
      <page-navigation />
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed, nextTick } from 'vue'
  import PageNavigation from '../components/PageNavigation.vue'
  import html2canvas from 'html2canvas'
  import { useUserStore } from '../store/userStore'
  import Papa from 'papaparse'
  
  export default {
    name: 'Share',
    components: {
      PageNavigation
    },
    setup() {
      const { githubId, setGithubId, clearGithubId } = useUserStore()
      const posterRef = ref(null)
      const avatarRef = ref(null)
      const userData = ref({})
      const loading = ref(false)
      const useDefaultAvatar = ref(false)
      const avatarLoaded = ref(false)
      const showError = ref(false)
      const errorMessage = ref('')
      const posterData = ref({})
  
      const avatarUrl = computed(() => {
        if (useDefaultAvatar.value) {
          return '/default-avatar.png'
        }
        return `https://avatars.githubusercontent.com/${githubId.value}?size=200`
      })
  
      const handleAvatarError = () => {
        useDefaultAvatar.value = true
      }
  
      const preloadAvatar = async () => {
        return new Promise((resolve) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            avatarLoaded.value = true
            resolve()
          }
          img.onerror = () => {
            useDefaultAvatar.value = true
            resolve()
          }
          img.src = avatarUrl.value
        })
      }
  
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
  
      const formatNumber = (num) => {
        if (num >= 1000) {
          return (num / 1000).toFixed(1) + 'k'
        }
        return num
      }
  
      const loadData = async () => {
        if (!githubId.value) {
          showError.value = true
          errorMessage.value = '请先输入 GitHub ID'
          return
        }
  
        loading.value = true
        showError.value = false
        try {
          await preloadAvatar()
          const response = await fetch('/userpaddle_summary_2024.csv')
          const csvText = await response.text()
          const results = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true
          })
          
          const userRecord = results.data.find(item => item.author === githubId.value)
          if (userRecord) {
            const keywords = determineKeywords(userRecord)
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
              midnight_pr_count: parseInt(userRecord.midnight_pr_count) || 0,
              most_active_repo: userRecord.most_active_repo || 'Paddle',
              keywords: keywords
            }
            
            // 生成海报数据
            posterData.value = {
              githubId: githubId.value,
              avatar: avatarUrl.value,
              prCount: userData.value.pr_count,
              issueCount: userData.value.issue_count,
              reviewCount: userData.value.merge_count,
              codeAdditions: userData.value.code_additions,
              codeDeletions: userData.value.code_deletions,
              repoCount: userData.value.repo_count,
              contributorType: userData.value.contributor_type,
              keywords: keywords,
              mostActiveRepo: userData.value.most_active_repo,
              isContributor: true
            }
          } else {
            // 获取 GitHub 数据
            const [userResponse, prResponse, issueResponse, starResponse] = await Promise.all([
              fetch(`https://api.github.com/users/${githubId.value}`),
              fetch(`https://api.github.com/search/issues?q=author:${githubId.value}+type:pr+created:2024-01-01..2024-12-31`),
              fetch(`https://api.github.com/search/issues?q=author:${githubId.value}+type:issue+created:2024-01-01..2024-12-31`),
              fetch(`https://api.github.com/users/${githubId.value}/starred/PaddlePaddle/Paddle`)
            ])

            if (!userResponse.ok) {
              throw new Error('未找到该 GitHub 用户')
            }

            const userData = await userResponse.json()
            const prData = await prResponse.json()
            const issueData = await issueResponse.json()
            
            posterData.value = {
              githubId: githubId.value,
              avatar: avatarUrl.value,
              prCount: prData.total_count || 0,
              issueCount: issueData.total_count || 0,
              following: userData.following || 0,
              followers: userData.followers || 0,
              stars: userData.public_repos || 0,
              starredPaddle: starResponse.status === 204,
              isContributor: false
            }
          }
          
          setGithubId(githubId.value)
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
  
      const generatePoster = async () => {
        if (!posterRef.value) return
        
        try {
          // 确保所有图片加载完成
          await Promise.all([
            ...Array.from(posterRef.value.getElementsByTagName('img')).map(img => {
              if (img.complete) return Promise.resolve()
              return new Promise(resolve => {
                img.onload = resolve
                img.onerror = resolve
              })
            }),
            avatarLoaded.value ? Promise.resolve() : preloadAvatar()
          ])
  
          const canvas = await html2canvas(posterRef.value, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#1a237e',
            logging: false,
            imageTimeout: 0,
            onclone: (clonedDoc) => {
              const clonedImages = clonedDoc.getElementsByTagName('img')
              Array.from(clonedImages).forEach(img => {
                img.crossOrigin = 'anonymous'
              })
            }
          })
          
          const link = document.createElement('a')
          link.download = `paddle-annual-2024-${githubId.value}.jpg`
          link.href = canvas.toDataURL('image/jpeg', 0.9)
          link.click()
        } catch (error) {
          console.error('Error generating poster:', error)
          alert('生成海报失败，请重试')
        }
      }
  
      const shareToWeChat = () => {
        alert('请截图后分享到微信')
      }
  
      const shareToWeibo = () => {
        const text = encodeURIComponent(`我在2024年为PaddlePaddle社区贡献了${userData.value.pr_count}个PR、${userData.value.issue_count}个Issue，成为了一名${userData.value.primary_tag}！让我们在2025年继续携手前行！`)
        const url = `https://service.weibo.com/share/share.php?text=${text}`
        window.open(url, '_blank')
      }
  
      const shareToX = () => {
        const text = encodeURIComponent(`我在2024年为PaddlePaddle社区贡献了${userData.value.pr_count}个PR、${userData.value.issue_count}个Issue，成为了一名${userData.value.primary_tag}！让我们在2025年继续携手前行！`)
        const url = `https://twitter.com/intent/tweet?text=${text}`
        window.open(url, '_blank')
      }
  
      onMounted(() => {
        if (githubId.value) {
          loadData()
        }
      })
  
      return {
        githubId,
        posterRef,
        avatarRef,
        userData,
        loading,
        avatarUrl,
        handleAvatarError,
        generatePoster,
        shareToWeChat,
        shareToWeibo,
        shareToX,
        useDefaultAvatar,
        avatarLoaded,
        showError,
        errorMessage,
        posterData,
        formatNumber,
      }
    }
  }
  </script>
  
  <style scoped>
  .guide-text {
    text-align: center;
  }
  .share {
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
  
  .poster-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0px;
  }
  
  .poster {
    position: relative;
    background: #1a237e;
    border: 4px solid var(--accent-color);
    padding: 20px;
    border-radius: 8px;
    color: var(--text-color);
    overflow: hidden;
  }
  
  .poster-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(26, 35, 126, 0.9), rgba(49, 27, 146, 0.9));
    z-index: 1;
  }
  
  .poster-content-wrapper {
    position: relative;
    z-index: 2;
  }
  
  .poster-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .avatar-container {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid var(--accent-color);
    box-shadow: 0 0 20px rgba(124, 77, 255, 0.5);
  }
  
  .user-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid var(--accent-color);
    margin: 0 auto 15px;
  }
  
  .header-text {
    text-align: center;
    width: 100%;
  }
  
  .header-text h2 {
    font-size: 24px;
    color: var(--accent-color);
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    font-family: 'Press Start 2P', system-ui, -apple-system, sans-serif;
  }
  
  .subtitle {
    font-size: 16px;
    opacity: 0.8;
    text-align: center;
    font-family: 'Press Start 2P', system-ui, -apple-system, sans-serif;
  }
  
  .achievement-section {
    margin-bottom: 40px;
    background: rgba(0, 0, 0, 0.2);
    padding: 20px;
    border-radius: 8px;
    border: 2px solid rgba(124, 77, 255, 0.3);
  }
  
  .achievement-section h3 {
    font-size: 24px;
    color: var(--accent-color);
    margin-bottom: 20px;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  .contribution-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin: 20px 0;
  }
  
  .stat-item {
    background: rgba(0, 0, 0, 0.3);
    border: 2px solid var(--accent-color);
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    transition: transform 0.3s ease;
  }
  
  .stat-item:hover {
    transform: translateY(-5px);
  }
  
  .stat-value {
    font-size: 20px;
    color: var(--accent-color);
    margin-bottom: 10px;
  }
  
  .stat-label {
    font-size: 14px;
    color: var(--text-color);
  }
  
  .code-section {
    margin-bottom: 40px;
    background: rgba(0, 0, 0, 0.2);
    padding: 20px;
    border-radius: 8px;
    border: 2px solid rgba(124, 77, 255, 0.3);
  }
  
  .code-section h3 {
    font-size: 24px;
    color: var(--accent-color);
    margin-bottom: 20px;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  .code-stats {
    display: flex;
    justify-content: center;
    gap: 40px;
  }
  
  .code-stat {
    font-size: 20px;
    background: rgba(124, 77, 255, 0.1);
    padding: 15px;
    border-radius: 8px;
    border: 1px solid rgba(124, 77, 255, 0.2);
  }
  
  .keywords-section {
    margin: 30px 0;
  }
  
  .keywords-section h3 {
    font-size: 24px;
    color: var(--accent-color);
    margin-bottom: 20px;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  .keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    margin-top: 15px;
  }
  
  .keyword {
    background: rgba(124, 77, 255, 0.3);
    padding: 8px 16px;
    border-radius: 20px;
    border: 2px solid var(--accent-color);
    color: var(--accent-color);
    font-size: 16px;
    font-family: 'Press Start 2P', system-ui, -apple-system, sans-serif;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
    animation: fadeIn 0.5s ease forwards;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(124, 77, 255, 0.3);
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .footer {
    text-align: center;
    margin-top: 40px;
    font-size: 18px;
    line-height: 1.6;
    background: rgba(0, 0, 0, 0.2);
    padding: 20px;
    border-radius: 8px;
    border: 2px solid rgba(124, 77, 255, 0.3);
  }
  
  .paddle-logo {
    width: 200px;
    height: auto;
    margin: 0 auto 20px;
  }
  
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 40px 0;
    flex-wrap: wrap;
  }
  
  .pixel-button {
    background: rgba(0, 0, 0, 0.3);
    border: 4px solid var(--accent-color);
    padding: 15px 30px;
    color: var(--text-color);
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 180px;
    justify-content: center;
  }
  
  .pixel-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .share-wechat {
    border-color: #07c160;
  }
  
  .share-weibo {
    border-color: #e6162d;
  }
  
  .share-x {
    border-color: #1da1f2;
  }
  
  .highlight {
    color: var(--accent-color);
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
  
  @media (max-width: 768px) {
    .poster {
      padding: 20px;
    }
  
    .avatar-container {
      width: 80px;
      height: 80px;
    }
  
    .header-text h2 {
      font-size: 24px;
    }
  
    .subtitle {
      font-size: 16px;
    }
  
    .contribution-stats {
      grid-template-columns: 1fr;
      gap: 15px;
    }
  
    .stat-item {
      padding: 15px;
    }
  
    .stat-value {
      font-size: 20px;
    }
  
    .stat-label {
      font-size: 12px;
    }
  
    .code-stats {
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
  
    .keyword {
      font-size: 16px;
    }
  
    .action-buttons {
      flex-direction: column;
      align-items: center;
    }
  
    .pixel-button {
      width: 100%;
      max-width: 300px;
    }
  
    .paddle-logo {
      width: 80px;
    }
  }
  
  .guide-steps {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .guide-step {
    background: rgba(124, 77, 255, 0.1);
    padding: 12px 20px;
    border-radius: 8px;
    border: 1px solid rgba(124, 77, 255, 0.2);
    color: var(--text-color);
    text-decoration: none;
    transition: all 0.2s ease;
  }
  
  .guide-step:hover {
    background: rgba(124, 77, 255, 0.2);
    transform: translateX(5px);
  }
  
  .poster-content {
    font-family: 'Press Start 2P', system-ui, -apple-system, sans-serif;
  }
  
  .user-name {
    font-size: 24px;
    color: var(--accent-color);
    text-align: center;
    margin-bottom: 10px;
    font-family: 'Press Start 2P', system-ui, -apple-system, sans-serif;
    text-shadow: 2px 2px 0 #000;
  }
  
  .contribution-title {
    font-size: 20px;
    color: var(--text-color);
    text-align: center;
    margin-bottom: 20px;
    font-family: 'Press Start 2P', system-ui, -apple-system, sans-serif;
    text-shadow: 1px 1px 0 #000;
  }
  
  .stats-value {
    font-size: 18px;
    color: var(--accent-color);
    font-family: 'Press Start 2P', system-ui, -apple-system, sans-serif;
    text-shadow: 1px 1px 0 #000;
  }
  
  .stats-label {
    font-size: 14px;
    color: var(--text-color);
    font-family: 'Press Start 2P', system-ui, -apple-system, sans-serif;
  }
  
  .keywords-section {
    text-align: center;
    margin-top: 20px;
  }
  
  .keywords-title {
    font-size: 16px;
    color: var(--text-color);
    margin-bottom: 15px;
    font-family: 'Press Start 2P', system-ui, -apple-system, sans-serif;
    text-shadow: 1px 1px 0 #000;
  }
  
  .keyword-tag {
    font-family: 'Press Start 2P', system-ui, -apple-system, sans-serif;
    font-size: 12px;
  }
  </style>