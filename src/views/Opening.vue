<template>
  <div class="opening-container">
    <div class="castle" :class="{ 'castle-appear': showCastle }">
      <div class="castle-body"></div>
      <div class="castle-text" v-if="showText">PaddlePaddle 2024</div>
    </div>
    <div class="adventurer" :class="{ 'adventurer-appear': showAdventurer }">
      <div class="adventurer-sprite"></div>
    </div>
    <div class="start-text" v-if="showStartText" @click="startJourney">
      点击开始你的 PaddlePaddle 之旅
    </div>
  </div>
</template>

<script>
export default {
  name: 'Opening',
  data() {
    return {
      showCastle: false,
      showAdventurer: false,
      showText: false,
      showStartText: false
    }
  },
  mounted() {
    this.startAnimation()
  },
  methods: {
    async startAnimation() {
      setTimeout(() => {
        this.showCastle = true
      }, 500)

      setTimeout(() => {
        this.showText = true
      }, 2000)

      setTimeout(() => {
        this.showAdventurer = true
      }, 3000)

      setTimeout(() => {
        this.showStartText = true
      }, 4000)
    },
    startJourney() {
      this.$router.push('/community-summary')
    }
  }
}
</script>

<style scoped>
.opening-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #000033, #000066);
  position: relative;
  overflow: hidden;
}

.castle {
  width: 300px;
  height: 400px;
  position: relative;
  opacity: 0;
  transform: translateY(50px);
}

.castle-appear {
  animation: castleAppear 1s forwards;
}

.castle-body {
  width: 100%;
  height: 100%;
  background-color: #333;
  clip-path: polygon(20% 100%, 80% 100%, 80% 30%, 100% 30%, 50% 0%, 0% 30%, 20% 30%);
}

.castle-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--accent-color);
  text-align: center;
  font-size: 24px;
  animation: textGlow 2s infinite;
}

.adventurer {
  position: absolute;
  bottom: 100px;
  left: -50px;
  width: 32px;
  height: 48px;
  opacity: 0;
}

.adventurer-appear {
  animation: adventurerWalk 2s forwards;
}

.adventurer-sprite {
  width: 100%;
  height: 100%;
  background-color: var(--accent-color);
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

.start-text {
  position: absolute;
  bottom: 100px;
  color: var(--accent-color);
  cursor: pointer;
  animation: pulse 1.5s infinite;
  text-align: center;
}

@keyframes castleAppear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 5px var(--accent-color);
  }
  50% {
    text-shadow: 0 0 20px var(--accent-color);
  }
}

@keyframes adventurerWalk {
  0% {
    opacity: 0;
    left: -50px;
  }
  100% {
    opacity: 1;
    left: calc(50% - 16px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style> 