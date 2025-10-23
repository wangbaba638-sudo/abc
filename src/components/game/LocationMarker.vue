<template>
  <div 
    class="location-marker"
    :style="location.position"
    :class="{ 
      'active': isActive,
      'completed': isCompleted,
      'locked': isLocked 
    }"
    @click="handleClick"
  >
    <div class="location-icon">📍</div>
    <div class="location-name">{{ location.name }}</div>
    <div v-if="isCompleted" class="completion-indicator">✓</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 接收props
const props = defineProps({
  location: {
    type: Object,
    required: true
  },
  gameState: {
    type: Object,
    required: true
  }
})

// 计算标记状态
const isActive = computed(() => {
  // 根据游戏状态判断位置是否可访问
  if (props.location.id === 'library') {
    return true
  } else if (props.location.id === 'temple') {
    return props.gameState.hasDecoded
  } else if (props.location.id === 'cave') {
    return props.gameState.hasFoundBox
  }
  return false
})

const isCompleted = computed(() => {
  // 判断位置是否已完成所有任务
  if (props.location.id === 'library') {
    return props.gameState.hasDecoded
  } else if (props.location.id === 'temple') {
    return props.gameState.hasFoundBox
  } else if (props.location.id === 'cave') {
    return props.gameState.hasFoundTreasure
  }
  return false
})

const isLocked = computed(() => {
  return !isActive.value && !isCompleted.value
})

// 处理点击事件
const handleClick = () => {
  if (!isLocked.value) {
    emit('click')
  }
}

// 定义事件
const emit = defineEmits(['click'])
</script>

<style scoped>
.location-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.location-marker:hover:not(.locked) {
  transform: translate(-50%, -50%) scale(1.1);
}

.location-marker.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.location-marker.active {
  animation: pulse 2s infinite;
}

.location-marker.completed {
  filter: hue-rotate(90deg);
}

.location-icon {
  font-size: 40px;
}

.location-name {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  white-space: nowrap;
  font-size: 14px;
}

.completion-indicator {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #4CAF50;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

@keyframes pulse {
  0% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.2);
  }
  100% {
    filter: brightness(1);
  }
}
</style>