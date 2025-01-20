import Papa from 'papaparse'

const processData = {
  loadCSVData(csvText) {
    const results = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    })
    return results.data
  },

  filterDataByUser(data, username) {
    return data.filter(item => item.author === username)
  },

  async loadUserData(username) {
    try {
      const response = await fetch('/userpaddle_summary_2024.csv')
      const csvText = await response.text()
      const data = this.loadCSVData(csvText)
      return this.filterDataByUser(data, username)
    } catch (error) {
      console.error('Error loading user data:', error)
      return []
    }
  },

  async loadProjectData() {
    try {
      const response = await fetch('/project_2024.csv')
      const csvText = await response.text()
      const data = this.loadCSVData(csvText)
      return data[0] // 返回第一行数据，因为只有一行总结数据
    } catch (error) {
      console.error('Error loading project data:', error)
      return null
    }
  }
}

export default processData 