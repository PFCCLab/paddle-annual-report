<template>
  <div class="app-container pixel-theme">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

:root {
  --primary-color: #1a237e;
  --secondary-color: #7c4dff;
  --accent-color: #ffd700;
  --success-color: #4caf50;
  --text-color: #ffffff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Press Start 2P', cursive;
  background-color: var(--primary-color);
  color: var(--text-color);
}

.app-container {
  min-height: 100vh;
  padding: 20px;
}

.pixel-theme {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pixel-button {
  font-family: 'Press Start 2P', cursive;
  padding: 10px 20px;
  background-color: var(--secondary-color);
  border: 4px solid var(--accent-color);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.pixel-button:hover {
  transform: scale(1.05);
  background-color: var(--accent-color);
  color: var(--primary-color);
}
</style>
