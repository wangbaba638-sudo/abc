<template>
  <div class="audio-player">
    <audio ref="audioElement" :src="audioUrl" loop></audio>
    <button class="audio-toggle" @click="toggleAudio">
      {{ isPlaying ? '🔇' : '🔊' }}
    </button>
    <div v-if="!audioUnlocked" class="audio-hint">
      点击页面任意位置开始播放背景音乐
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

// 接收props
const props = defineProps({
  location: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  }
})

// 音频状态
const audioElement = ref(null)
const isPlaying = ref(false)
const audioUnlocked = ref(false)

// 切换音频播放状态
const toggleAudio = () => {
  if (!audioUnlocked.value) {
    unlockAudio()
  }
  
  if (isPlaying.value) {
    pauseAudio()
  } else {
    playAudio()
  }
}

// 播放音频
const playAudio = async () => {
  if (!audioElement.value || !audioUnlocked.value) return
  
  try {
    await audioElement.value.play()
    isPlaying.value = true
  } catch (error) {
    console.error('音频播放失败:', error)
  }
}

// 暂停音频
const pauseAudio = () => {
  if (audioElement.value) {
    audioElement.value.pause()
    isPlaying.value = false
  }
}

// 解锁音频
const unlockAudio = () => {
  audioUnlocked.value = true
  playAudio()
  localStorage.setItem('treasureHuntAudioUnlocked', 'true')
}

// 监听位置变化，切换音频
watch(() => props.location, (newLocation) => {
  if (audioElement.value) {
    // 重置音频元素
    audioElement.value.pause()
    audioElement.value.currentTime = 0
    isPlaying.value = false
    
    // 如果音频已解锁且新位置有音频，则播放
    if (audioUnlocked.value && props.audioUrl) {
      playAudio()
    }
  }
})

// 处理页面点击以解锁音频
const handlePageClick = () => {
  if (!audioUnlocked.value) {
    unlockAudio()
  }
}

// 组件挂载时的处理
onMounted(() => {
  // 检查是否已经解锁过音频
  const savedUnlocked = localStorage.getItem('treasureHuntAudioUnlocked')
  if (savedUnlocked === 'true') {
    audioUnlocked.value = true
    playAudio()
  } else {
    // 添加点击监听器以解锁音频
    document.addEventListener('click', handlePageClick)
  }
})

// 组件卸载时清理
onUnmounted(() => {
  pauseAudio()
  document.removeEventListener('click', handlePageClick)
})
</script>

<style scoped>
.audio-player {
  position: relative;
}

.audio-toggle {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: all 0.3s ease;
}

.audio-toggle:hover {
  background-color: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.audio-hint {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  animation: fadeInOut 5s ease-in-out;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}
</style>