<template>
  <div class="leaderboard">
    <div class="container">
      <div class="header">
        <h2 class="title">寻宝冒险排行榜</h2>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      
      <div v-if="isLoading" class="loading-container">
        <div class="loading"></div>
        <p>加载排行榜数据中...</p>
      </div>
      
      <div v-else-if="leaderboardData.length === 0" class="empty-state">
        <p>还没有人完成寻宝冒险！成为第一个完成的人吧！</p>
      </div>
      
      <div v-else class="leaderboard-table-container">
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>玩家</th>
              <th>完成时间</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(record, index) in leaderboardData" 
              :key="index"
              :class="{ 'current-user': isCurrentUser(record.username) }"
            >
              <td class="rank">
                <span class="rank-number">{{ index + 1 }}</span>
                <span v-if="index < 3" class="medal" :class="getMedalClass(index)">
                  {{ getMedalEmoji(index) }}
                </span>
              </td>
              <td class="username">{{ record.username }}</td>
              <td class="time">{{ formatTime(record.completionTime) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="actions">
        <button class="refresh-btn" @click="loadLeaderboard" :disabled="isLoading">
          {{ isLoading ? '刷新中...' : '刷新排行榜' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TreasureMapAPI from '../../services/TreasureMapAPI.js'

// 定义事件
const emit = defineEmits(['refresh', 'close'])

// 处理关闭
const handleClose = () => {
  emit('close')
}

// 状态管理
const leaderboardData = ref([])
const isLoading = ref(false)

// 获取当前登录用户
const getCurrentUser = () => {
  const userJson = localStorage.getItem('treasureHuntUser')
  return userJson ? JSON.parse(userJson) : null
}

// 判断是否为当前用户
const isCurrentUser = (username) => {
  const currentUser = getCurrentUser()
  return currentUser && currentUser.username === username
}

// 格式化时间显示
const formatTime = (timeString) => {
  const date = new Date(timeString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 获取奖牌样式
const getMedalClass = (index) => {
  switch (index) {
    case 0: return 'gold'
    case 1: return 'silver'
    case 2: return 'bronze'
    default: return ''
  }
}

// 获取奖牌表情
const getMedalEmoji = (index) => {
  switch (index) {
    case 0: return '🥇'
    case 1: return '🥈'
    case 2: return '🥉'
    default: return ''
  }
}

// 加载排行榜数据
const loadLeaderboard = async () => {
  isLoading.value = true
  
  try {
    const data = await TreasureMapAPI.getLeaderboard()
    leaderboardData.value = data
  } catch (error) {
    console.error('加载排行榜失败', error)
  } finally {
    isLoading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadLeaderboard()
})
</script>

<style scoped>
.leaderboard {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.title {
  color: #333;
  font-size: 2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 0;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
}

.leaderboard-table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table th,
.leaderboard-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.leaderboard-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
}

.leaderboard-table tr:hover {
  background-color: #f5f5f5;
}

.leaderboard-table tr.current-user {
  background-color: #e3f2fd;
  font-weight: bold;
}

.rank {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rank-number {
  font-weight: bold;
  font-size: 1.2rem;
}

.medal {
  font-size: 1.5rem;
}

.actions {
  text-align: center;
  margin-top: 20px;
}

.refresh-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.refresh-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>