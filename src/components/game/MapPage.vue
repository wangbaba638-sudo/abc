<template>
  <div class="map-page">
    <div class="background" :style="{ backgroundImage: `url('${backgroundImage}')` }"></div>
    
    <h1 class="title">寻宝冒险地图</h1>
    
    <div class="locations-container">
      <LocationMarker 
        v-for="location in locations" 
        :key="location.id"
        :location="location"
        :game-state="gameState"
        @click="handleLocationClick(location)"
      />
    </div>
    
    <GameStatus :game-state="gameState" />
    
    <AudioPlayer :location="'map'" :audio-url="mapAudioUrl" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LocationMarker from './LocationMarker.vue'
import GameStatus from './GameStatus.vue'
import AudioPlayer from './AudioPlayer.vue'

// 定义地图背景和音频
const backgroundImage = 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3'
const mapAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

// 定义可探索位置
const locations = ref([
  {
    id: 'library',
    name: '古老图书馆',
    position: { top: '30%', left: '20%' },
    description: '这里藏着第一条线索...',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    backgroundImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3',
    actions: [
      { id: 'find_clue', name: '寻找线索', condition: (state) => !state.hasClue },
      { id: 'decode_script', name: '解码文字', condition: (state) => state.hasClue && !state.hasDecoded }
    ]
  },
  {
    id: 'temple',
    name: '神秘神庙',
    position: { top: '60%', left: '50%' },
    description: '这里可能藏有宝藏，但要小心守卫...',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    backgroundImage: 'https://images.unsplash.com/photo-1570126688311-91720515f1dc?ixlib=rb-4.0.3',
    actions: [
      { id: 'search_temple', name: '搜索神庙', condition: (state) => state.hasDecoded && !state.hasFoundBox }
    ]
  },
  {
    id: 'cave',
    name: '隐秘洞穴',
    position: { top: '40%', left: '80%' },
    description: '你发现了一个神秘的箱子...',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    backgroundImage: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3',
    actions: [
      { id: 'open_box', name: '打开宝箱', condition: (state) => state.hasFoundBox && !state.hasFoundTreasure },
      { id: 'restart', name: '重新开始', condition: (state) => state.hasFoundTreasure }
    ]
  }
])

// 从父组件接收游戏状态
const props = defineProps({
  gameState: {
    type: Object,
    required: true
  }
})

// 处理位置点击
const handleLocationClick = (location) => {
  // 检查是否满足访问条件
  if (location.id === 'temple' && !props.gameState.hasDecoded) {
    props.gameState.errorMessage = '你需要先在图书馆解码线索才能进入神庙'
    setTimeout(() => { props.gameState.errorMessage = '' }, 3000)
    return
  }
  if (location.id === 'cave' && !props.gameState.hasFoundBox) {
    props.gameState.errorMessage = '你需要先在神庙找到宝箱才能进入洞穴'
    setTimeout(() => { props.gameState.errorMessage = '' }, 3000)
    return
  }
  
  emit('location-click', location)
}

// 定义事件
const emit = defineEmits(['location-click'])
</script>

<style scoped>
.map-page {
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

.title {
  color: white;
  text-align: center;
  padding-top: 20px;
  text-shadow: 2px 2px 4px #000000;
  font-size: 2.5rem;
}

.locations-container {
  position: relative;
  width: 100%;
  height: calc(100% - 100px);
}
</style>