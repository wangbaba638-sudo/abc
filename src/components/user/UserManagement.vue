<template>
  <div class="user-management">
    <div class="container">
      <h2 class="title">{{ isRegistering ? '用户注册' : '用户登录' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="formData.username" 
            required 
            placeholder="请输入用户名"
          >
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="formData.password" 
            required 
            placeholder="请输入密码"
          >
        </div>
        
        <div v-if="isRegistering" class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="formData.confirmPassword" 
            required 
            placeholder="请再次输入密码"
          >
        </div>
        
        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? '处理中...' : (isRegistering ? '注册' : '登录') }}
          </button>
          
          <button type="button" class="toggle-btn" @click="toggleAuthMode">
            {{ isRegistering ? '已有账号？去登录' : '还没有账号？去注册' }}
          </button>
        </div>
      </form>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import TreasureMapAPI from '../../services/TreasureMapAPI.js'

// 状态管理
const isRegistering = ref(true)
const isLoading = ref(false)
const errorMessage = ref('')

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

// 切换登录/注册模式
const toggleAuthMode = () => {
  isRegistering.value = !isRegistering.value
  errorMessage.value = ''
  resetForm()
}

// 重置表单
const resetForm = () => {
  formData.username = ''
  formData.password = ''
  formData.confirmPassword = ''
}

// 处理表单提交
const handleSubmit = async () => {
  // 清除之前的错误信息
  errorMessage.value = ''
  
  // 表单验证
  if (!formData.username.trim()) {
    errorMessage.value = '请输入用户名'
    return
  }
  
  if (!formData.password.trim()) {
    errorMessage.value = '请输入密码'
    return
  }
  
  if (isRegistering.value && formData.password !== formData.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }
  
  isLoading.value = true
  
  try {
    let result
    
    if (isRegistering.value) {
      // 注册用户
      result = await TreasureMapAPI.registerUser(formData.username, formData.password)
      emit('auth-success', {
        username: result.username,
        token: btoa(formData.username + ':' + Date.now())
      })
    } else {
      // 登录用户
      result = await TreasureMapAPI.loginUser(formData.username, formData.password)
      emit('auth-success', {
        username: result.user.username,
        token: result.token
      })
    }
    
    // 成功后保存用户信息到本地存储
    localStorage.setItem('treasureHuntUser', JSON.stringify({
      username: formData.username,
      token: result.token || btoa(formData.username + ':' + Date.now())
    }))
    
  } catch (error) {
    errorMessage.value = error.message || '操作失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 定义事件
const emit = defineEmits(['auth-success'])
</script>

<style scoped>
.user-management {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.container {
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: bold;
  color: #555;
}

.form-group input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.form-group input:focus {
  outline: none;
  border-color: #2196F3;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
}

.submit-btn {
  padding: 12px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1976d2;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.toggle-btn {
  padding: 10px;
  background-color: transparent;
  border: none;
  color: #2196F3;
  cursor: pointer;
  font-size: 14px;
}

.toggle-btn:hover {
  text-decoration: underline;
}

.error-message {
  margin-top: 20px;
  padding: 10px;
  background-color: #ffebee;
  color: #d32f2f;
  border-radius: 5px;
  text-align: center;
}
</style>