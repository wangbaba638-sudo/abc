<template>
  <div class="game-router-view">
    <Transition name="fade" mode="out-in">
      <MapPage v-if="currentPage === 'map'" :game-state="gameState" @location-click="handleLocationClick" />
      <LocationPage 
        v-else 
        :location="currentLocation" 
        :game-state="gameState"
        @back="handleBack"
        @game-complete="handleGameComplete"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import MapPage from './MapPage.vue'
import LocationPage from './LocationPage.vue'
import TreasureMapAPI from '../../services/TreasureMapAPI.js'

// 页面状态
const currentPage = ref('map')
const currentLocation = ref(null)

// 游戏状态管理 - 提升到父组件以便共享
const gameState = reactive({
  currentLocation: null,
  hasClue: false,
  hasDecoded: false,
  hasFoundBox: false,
  hasFoundTreasure: false,
  lastMessage: "",
  errorMessage: "",
  
  save() {
    localStorage.setItem('treasureGameState', JSON.stringify(this))
  },
  
  load() {
    const saved = localStorage.getItem('treasureGameState')
    if (saved) {
      const parsed = JSON.parse(saved)
      Object.assign(this, parsed)
    }
  },
  
  reset() {
    this.currentLocation = null
    this.hasClue = false
    this.hasDecoded = false
    this.hasFoundBox = false
    this.hasFoundTreasure = false
    this.lastMessage = ""
    this.errorMessage = ""
    this.save()
  }
})

// 初始化时加载游戏状态
gameState.load()

// 处理位置点击
const handleLocationClick = (location) => {
  currentLocation.value = location
  currentPage.value = 'location'
}

// 处理返回地图
const handleBack = () => {
  currentPage.value = 'map'
  currentLocation.value = null
}

// 处理游戏完成
const handleGameComplete = async (user) => {
  // 保存游戏记录到排行榜
  try {
    await TreasureMapAPI.saveToLeaderboard(user)
    await TreasureMapAPI.updateUserGamesCompleted(user.username)
  } catch (error) {
    console.error('保存游戏记录失败', error)
  }
  
  // 重置游戏状态
  currentPage.value = 'map'
  currentLocation.value = null
}
</script>

<style scoped>
.game-router-view {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>