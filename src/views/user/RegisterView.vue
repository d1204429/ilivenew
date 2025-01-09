<template>
  <div class="register-view">
    <div class="register-container">
      <div class="back-link">
        <a @click="handleBack">
          <i class="fas fa-arrow-left"></i> 返回
        </a>
      </div>

      <h2 class="register-title">會員註冊</h2>

      <div v-if="globalError" class="error-message">
        {{ globalError }}
      </div>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
        <div class="countdown">{{ countdown }} 秒後自動跳轉到登入頁面</div>
      </div>

      <form class="register-form" @submit.prevent="handleRegister">
        <div class="form-group" v-for="field in formFields" :key="field.id">
          <label :for="field.id">{{ field.label }}</label>
          <BaseInput
              :id="field.id"
              v-model="formData[field.id]"
              :type="showPassword[field.id] ? 'text' : field.type || 'text'"
              :placeholder="field.placeholder"
              :error="validationErrors[field.id]"
              @blur="validateField(field.id)"
          >
            <template v-if="field.id === 'password' || field.id === 'confirmPassword'" #append>
              <i
                  class="password-toggle"
                  :class="showPassword[field.id] ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  @click="() => togglePasswordVisibility(field.id)"
              ></i>
            </template>
          </BaseInput>
          <div v-if="field.id === 'password'" class="password-strength">
            <div class="strength-bar">
              <div
                  :style="{ width: `${passwordStrength}%` }"
                  :class="getStrengthClass(passwordStrength)"
              ></div>
            </div>
            <span>密碼強度: {{ getStrengthText(passwordStrength) }}</span>
          </div>
        </div>

        <BaseButton
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="register-button"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? '註冊中...' : '註冊' }}
        </BaseButton>

        <div class="login-link">
          已有帳號？
          <router-link to="/login">立即登入</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import * as validators from '@/utils/validators'
import { register } from '@/services/users'

const router = useRouter()
const isLoading = ref(false)
const showPassword = reactive({
  password: false,
  confirmPassword: false
})
const globalError = ref('')
const countdown = ref(5)
const successMessage = ref('')
const validationErrors = reactive({})
const passwordStrength = ref(0)

const formFields = [
  { id: 'username', label: '用戶名', placeholder: '請輸入用戶名' },
  { id: 'email', label: '電子郵件', type: 'email', placeholder: '請輸入電子郵件' },
  { id: 'fullName', label: '全名', placeholder: '請輸入全名' },
  { id: 'phoneNumber', label: '手機號碼', type: 'tel', placeholder: '請輸入手機號碼' },
  { id: 'address', label: '地址', placeholder: '請輸入地址' },
  { id: 'password', label: '密碼', type: 'password', placeholder: '請輸入密碼' },
  { id: 'confirmPassword', label: '確認密碼', type: 'password', placeholder: '請再次輸入密碼' }
]

const formData = reactive({
  username: '',
  email: '',
  fullName: '',
  phoneNumber: '',
  address: '',
  password: '',
  confirmPassword: ''
})

// 監聽密碼變化，更新密碼強度
watch(() => formData.password, (newValue) => {
  passwordStrength.value = validators.calculatePasswordStrength(newValue)
})

const validateField = (fieldName) => {
  const value = formData[fieldName]
  let result

  switch (fieldName) {
    case 'username':
      result = validators.username(value)
      break
    case 'email':
      result = validators.email(value)
      break
    case 'fullName':
      result = validators.fullName(value)
      break
    case 'phoneNumber':
      result = validators.phoneNumber(value)
      break
    case 'address':
      result = validators.address(value)
      break
    case 'password':
      result = validators.password(value)
      break
    case 'confirmPassword':
      result = validators.confirmPassword(formData.password)(value)
      break
    default:
      result = true
  }

  if (result === true) {
    delete validationErrors[fieldName]
  } else {
    validationErrors[fieldName] = result
  }

  return result === true
}

const validateForm = () => {
  let isValid = true
  formFields.forEach(field => {
    if (!validateField(field.id)) {
      isValid = false
    }
  })
  return isValid
}

const isFormValid = computed(() => {
  return Object.keys(formData).every(field => !!formData[field]) &&
      Object.keys(validationErrors).length === 0
})

const togglePasswordVisibility = (fieldId) => {
  showPassword[fieldId] = !showPassword[fieldId]
}

const getStrengthClass = (strength) => {
  if (strength < 40) return 'weak'
  if (strength < 70) return 'medium'
  return 'strong'
}

const getStrengthText = (strength) => {
  if (strength < 40) return '弱'
  if (strength < 70) return '中'
  return '強'
}

const startCountdown = () => {
  successMessage.value = `註冊成功！${countdown.value}秒後自動跳轉到登入頁面...`
  const timer = setInterval(() => {
    countdown.value--
    successMessage.value = `註冊成功！${countdown.value}秒後自動跳轉到登入頁面...`
    if (countdown.value <= 0) {
      clearInterval(timer)
      router.push('/login')
    }
  }, 1000)
}

const handleRegistrationError = (error) => {
  const errorMessage = error.response?.data?.message || error.message
  console.error('註冊失敗:', error)

  const errorMap = {
    'username': '此用戶名已被使用',
    'email': '此電子郵件已被註冊',
    'phoneNumber': '此手機號碼已被註冊'
  }

  let foundSpecificError = false
  for (const [field, message] of Object.entries(errorMap)) {
    if (errorMessage.toLowerCase().includes(field.toLowerCase())) {
      validationErrors[field] = message
      foundSpecificError = true
      break
    }
  }

  if (!foundSpecificError) {
    globalError.value = errorMessage || '註冊失敗，請稍後再試'
  }
}

const handleBack = () => {
  if (window.history.length > 2) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const handleRegister = async () => {
  if (!validateForm()) return

  try {
    isLoading.value = true
    globalError.value = ''

    const userData = {
      username: formData.username.trim(),
      password: formData.password,
      email: formData.email.trim(),
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      address: formData.address.trim()
    }

    await register(userData)
    startCountdown()

  } catch (error) {
    handleRegistrationError(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 1rem;
}

.register-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.password-toggle {
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #4299e1;
}

.error-message {
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.875rem;
}

.register-button {
  width: 100%;
  margin-top: 1rem;
}

.loading-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #fff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.login-link a {
  color: #4299e1;
  text-decoration: none;
  transition: color 0.3s ease;
}

.login-link a:hover {
  color: #3182ce;
  text-decoration: underline;
}

.success-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #48bb78;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  z-index: 1000;
}

.countdown {
  font-size: 0.875rem;
  margin-top: 0.5rem;
  opacity: 0.9;
}

.password-strength {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.strength-bar {
  height: 4px;
  background-color: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.strength-bar > div {
  height: 100%;
  transition: width 0.3s ease;
}

.strength-bar > div.weak {
  background-color: #f56565;
}

.strength-bar > div.medium {
  background-color: #ed8936;
}

.strength-bar > div.strong {
  background-color: #48bb78;
}

.back-link {
  margin-bottom: 1rem;
}

.back-link a {
  display: inline-flex;
  align-items: center;
  color: #666;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;
}

.back-link a:hover {
  color: #4299e1;
}

.back-link i {
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .register-container {
    margin: 1rem;
    padding: 1.5rem;
  }

  .register-title {
    font-size: 1.5rem;
  }
}
</style>
