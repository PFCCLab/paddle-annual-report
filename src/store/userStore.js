import { ref } from 'vue'

const githubId = ref('')
const hasSearched = ref(false)

export const useUserStore = () => {
  const setGithubId = (id) => {
    githubId.value = id
    hasSearched.value = true
  }

  const clearGithubId = () => {
    githubId.value = ''
    hasSearched.value = false
  }

  return {
    githubId,
    hasSearched,
    setGithubId,
    clearGithubId
  }
} 