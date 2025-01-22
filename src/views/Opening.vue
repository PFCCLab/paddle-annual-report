<template>
  <div class="opening-container">
    <div class="shooting-star"></div>
    <div class="shooting-star"></div>
    <div class="shooting-star"></div>
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

.opening-container::before {
  content: '';
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  box-shadow: 
    10vw 10vh 1px white,
    20vw 20vh 1px white,
    30vw 30vh 1px white,
    40vw 40vh 1px white,
    50vw 50vh 1px white,
    60vw 60vh 1px white,
    70vw 70vh 1px white,
    80vw 80vh 1px white,
    90vw 90vh 1px white,
    15vw 15vh 1px white,
    25vw 25vh 1px white,
    35vw 35vh 1px white,
    45vw 45vh 1px white,
    55vw 55vh 1px white,
    65vw 65vh 1px white,
    75vw 75vh 1px white,
    85vw 85vh 1px white,
    95vw 95vh 1px white;
  animation: twinkle 5s infinite;
}

.shooting-star {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 4px;
  background: linear-gradient(to right, white, transparent);
  animation: shootingStar 2s linear infinite;
}

.shooting-star:nth-child(2) {
  top: 30%;
  animation-delay: 1s;
}

.shooting-star:nth-child(3) {
  top: 60%;
  animation-delay: 0.5s;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes shootingStar {
  0% {
    transform: translateX(-100%) translateY(0) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: translateX(200vw) translateY(200vh) rotate(-45deg);
    opacity: 0;
  }
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
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  transform: scale(0.8);
  animation: rotate 3s linear infinite;
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

@keyframes rotate {
  from {
    transform: scale(0.8) rotate(0deg);
  }
  to {
    transform: scale(0.8) rotate(360deg);
  }
}
</style> 