<template>
  <div class="app-container">
    <!-- 优先显示游戏内容 -->
    <GameRouterView v-if="showGame" />
    <!-- 用户管理组件 -->
    <UserManagement v-if="showUserManagement" @auth-success="handleLoginSuccess" />
    <!-- 用户相关按钮 -->
    <button v-if="currentUser && showGame" class="user-btn" @click="showLeaderboard = true">{{ currentUser.username }} - 排行榜</button>
    <button v-if="currentUser && showGame" class="logout-btn" @click="handleLogout">退出登录</button>
    <!-- 排行榜 -->
    <Leaderboard v-if="showLeaderboard" @close="showLeaderboard = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import UserManagement from './components/user/UserManagement.vue'
import Leaderboard from './components/leaderboard/Leaderboard.vue'
import GameRouterView from './components/game/GameRouterView.vue'

// 游戏状态
const showGame = ref(false)
const showUserManagement = ref(true)
const showLeaderboard = ref(false)
const currentUser = ref(null)

// 处理登录成功
const handleLoginSuccess = (user) => {
  currentUser.value = user
  showUserManagement.value = false
  showGame.value = true
  showLeaderboard.value = false
  saveUserToLocalStorage(user)
  console.log('登录成功，显示游戏内容')
}

// 处理退出登录
const handleLogout = () => {
  currentUser.value = null
  showGame.value = false
  showUserManagement.value = true
  localStorage.removeItem('treasureHuntUser')
}

// 保存用户到本地存储
const saveUserToLocalStorage = (user) => {
  localStorage.setItem('treasureHuntUser', JSON.stringify(user))
}

// 从本地存储加载用户
const loadUserFromLocalStorage = () => {
  const saved = localStorage.getItem('treasureHuntUser')
  if (saved) {
    try {
      const user = JSON.parse(saved)
      handleLoginSuccess(user)
      console.log('从本地存储加载用户成功')
    } catch (e) {
      console.error('加载用户数据失败', e)
      localStorage.removeItem('treasureHuntUser') // 清除损坏的数据
    }
  } else {
    console.log('没有找到保存的用户数据')
  }
}

// 组件挂载时加载用户
onMounted(() => {
  loadUserFromLocalStorage()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  overflow-x: hidden;
}

.app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.user-btn, .logout-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  z-index: 1000;
}

.logout-btn {
  right: 180px;
  background-color: #f44336;
}

.user-btn:hover, .logout-btn:hover {
  opacity: 0.9;
}
</style>