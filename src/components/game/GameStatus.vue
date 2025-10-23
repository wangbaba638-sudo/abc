<template>
  <div class="game-status">
    <div class="status-content">
      <h3>游戏进度</h3>
      <div class="progress-steps">
        <div class="step" :class="{ 'completed': gameState.hasClue }">
          <span class="step-number">{{ gameState.hasClue ? '✓' : '1' }}</span>
          <span class="step-text">找到线索</span>
        </div>
        <div class="step-connector" :class="{ 'completed': gameState.hasDecoded }"></div>
        <div class="step" :class="{ 'completed': gameState.hasDecoded }">
          <span class="step-number">{{ gameState.hasDecoded ? '✓' : '2' }}</span>
          <span class="step-text">解码线索</span>
        </div>
        <div class="step-connector" :class="{ 'completed': gameState.hasFoundBox }"></div>
        <div class="step" :class="{ 'completed': gameState.hasFoundBox }">
          <span class="step-number">{{ gameState.hasFoundBox ? '✓' : '3' }}</span>
          <span class="step-text">找到宝箱</span>
        </div>
        <div class="step-connector" :class="{ 'completed': gameState.hasFoundTreasure }"></div>
        <div class="step" :class="{ 'completed': gameState.hasFoundTreasure }">
          <span class="step-number">{{ gameState.hasFoundTreasure ? '✓' : '4' }}</span>
          <span class="step-text">获取宝藏</span>
        </div>
      </div>
      <div v-if="gameState.lastMessage" class="last-message">
        <p>{{ gameState.lastMessage }}</p>
      </div>
      <div v-if="gameState.errorMessage" class="error-message">
        <p>{{ gameState.errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 接收props
const props = defineProps({
  gameState: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.game-status {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 90%;
}

.status-content h3 {
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #666;
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

.step-text {
  font-size: 12px;
  color: #666;
}

.step.completed .step-number {
  background-color: #4CAF50;
  color: white;
}

.step.completed .step-text {
  color: #4CAF50;
  font-weight: bold;
}

.step-connector {
  flex: 1;
  height: 4px;
  background-color: #e0e0e0;
  margin: 0 10px;
  transition: all 0.3s ease;
}

.step-connector.completed {
  background-color: #4CAF50;
}

.last-message, .error-message {
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}

.last-message {
  background-color: #e3f2fd;
  color: #1976d2;
}

.error-message {
  background-color: #ffebee;
  color: #d32f2f;
}

.last-message p, .error-message p {
  margin: 0;
  font-size: 14px;
}
</style>