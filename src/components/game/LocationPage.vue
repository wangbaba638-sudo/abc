<template>
  <div class="location-page">
    <div class="background" :style="{ backgroundImage: `url('${location.backgroundImage}')` }"></div>
    
    <button class="back-btn" @click="handleBack">返回地图</button>
    
    <div class="status-display">
      <h2>{{ location.name }}</h2>
      <p v-if="!isLoading" class="location-status">{{ currentStatus }}</p>
      <div v-else class="loading-container">
        <div class="loading"></div>
        <p>正在处理...</p>
      </div>
      
      <div class="actions-container">
        <button 
          v-for="action in availableActions" 
          :key="action.id"
          class="action-btn"
          @click="handleAction(action)"
          :disabled="isLoading"
        >
          {{ action.name }}
        </button>
      </div>
    </div>
    
    <AudioPlayer :location="location.id" :audio-url="location.audioUrl" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AudioPlayer from './AudioPlayer.vue'
import TreasureMapAPI from '../../services/TreasureMapAPI.js'

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

// 状态管理
const isLoading = ref(false)
const currentStatus = ref(props.location.description)

// 使用从父组件传入的gameState
// 初始化时更新状态显示
onMounted(() => {
  updateStatusBasedOnState()
})

// 计算可用操作
const availableActions = computed(() => {
  return props.location.actions.filter(action => action.condition(props.gameState))
})

// 根据游戏状态更新显示
const updateStatusBasedOnState = () => {
  if (props.location.id === 'library') {
    if (props.gameState.hasDecoded) {
      currentStatus.value = '你已经成功解码了线索，去神庙看看吧！'
    } else if (props.gameState.hasClue) {
      currentStatus.value = '你发现了古老的文字，需要解码它...'
    }
  } else if (props.location.id === 'temple') {
    if (props.gameState.hasFoundBox) {
      currentStatus.value = '你已经在这里找到了神秘箱子，快去洞穴打开它！'
    }
  } else if (props.location.id === 'cave') {
    if (props.gameState.hasFoundTreasure) {
      currentStatus.value = '恭喜！你找到了传说中的宝藏！'
    } else if (props.gameState.hasFoundBox) {
      currentStatus.value = '你发现了一个神秘的箱子，准备好打开它了吗？'
    }
  }
  
  if (props.gameState.lastMessage) {
    currentStatus.value = props.gameState.lastMessage
  }
}

// 处理返回地图
const handleBack = () => {
  emit('back')
}

// 处理操作
const handleAction = async (action) => {
  isLoading.value = true
  
  try {
    let result = ''
    
    switch (action.id) {
      case 'find_clue':
        result = await TreasureMapAPI.getInitialClue()
        props.gameState.hasClue = true
        props.gameState.lastMessage = result
        break
      
      case 'decode_script':
        result = await TreasureMapAPI.decodeAncientScript(props.gameState.lastMessage)
        props.gameState.hasDecoded = true
        props.gameState.lastMessage = result
        setTimeout(() => {
          navigateToLocation('temple')
        }, 2000)
        break
      
      case 'search_temple':
        try {
          result = await TreasureMapAPI.searchTemple(props.gameState.lastMessage)
          props.gameState.hasFoundBox = true
          props.gameState.lastMessage = result
          setTimeout(() => {
            navigateToLocation('cave')
          }, 2000)
        } catch (error) {
          result = error.message
          props.gameState.lastMessage = result
        }
        break
      
      case 'open_box':
        result = await TreasureMapAPI.openTreasureBox()
        props.gameState.hasFoundTreasure = true
        props.gameState.lastMessage = result
        
        // 获取当前用户信息
        const userJson = localStorage.getItem('treasureHuntUser')
        if (userJson) {
          const user = JSON.parse(userJson)
          emit('game-complete', user)
        }
        break
      
      case 'restart':
        props.gameState.reset()
        emit('back')
        return
    }
    
    currentStatus.value = result
    props.gameState.save()
  } catch (error) {
    currentStatus.value = '任务失败: ' + error.message
  } finally {
    isLoading.value = false
  }
}

// 导航到指定位置
const navigateToLocation = (locationId) => {
  // 这里可以通过事件通知父组件进行导航
  // 暂时先更新状态
  updateStatusBasedOnState()
}

// 使用父组件gameState的reset方法（假设父组件已实现）

// 定义事件
const emit = defineEmits(['back', 'game-complete'])
</script>

<style scoped>
.location-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  z-index: 100;
}

.back-btn:hover {
  opacity: 0.8;
}

.status-display {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 10px;
  max-width: 600px;
  margin: 50px auto;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.status-display h2 {
  margin-bottom: 20px;
  color: #333;
}

.location-status {
  font-size: 18px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 30px;
  min-height: 60px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
}

.actions-container {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.action-btn {
  padding: 12px 24px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.action-btn:hover:not(:disabled) {
  background-color: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.action-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>