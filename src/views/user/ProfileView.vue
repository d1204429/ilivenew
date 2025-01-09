<template>
  <div class="profile-container">
    <div class="profile-card">
      <!-- Header Section -->

      <div class="profile-header">
        <div class="back-link">
        <a @click="handleBack">
          <i class="fas fa-arrow-left"></i> 返回
        </a>
      </div>
        <h2 class="title">個人資料</h2>
        <div class="action-buttons">
          <button
              v-if="!isEditing"
              @click="startEditing"
              class="btn btn-edit"
              :disabled="loading || !isAuthenticated"
          >
            編輯
          </button>
          <template v-else>
            <button
                @click="handleSave"
                class="btn btn-save"
                :disabled="loading || !isFormValid"
            >
              {{ loading ? '儲存中...' : '儲存' }}
            </button>
            <button
                @click="handleCancel"
                class="btn btn-cancel"
                :disabled="loading"
            >
              取消
            </button>
          </template>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="globalError" class="error-banner">
        {{ globalError }}
      </div>

      <!-- Main Content -->
      <div class="profile-content">
        <div v-if="loading" class="loading-wrapper">
          <BaseLoading message="載入中..." />
        </div>
        <form v-else-if="currentUser" class="profile-form" @submit.prevent="handleSave">
          <div class="form-group" v-for="field in formFields" :key="field.name">
            <label>{{ field.label }}</label>
            <div class="input-wrapper">
              <template v-if="isEditing">
                <input
                    v-if="field.type !== 'textarea'"
                    v-model.trim="editedProfile[field.name]"
                    :type="field.type"
                    class="form-input"
                    :class="{ 'has-error': errors[field.name] }"
                    @blur="validateField(field.name)"
                    :disabled="loading"
                />
                <textarea
                    v-else
                    v-model.trim="editedProfile[field.name]"
                    class="form-textarea"
                    :class="{ 'has-error': errors[field.name] }"
                    @blur="validateField(field.name)"
                    :disabled="loading"
                ></textarea>
              </template>
              <span v-else class="form-text">
                {{ currentUser[field.name] || '-' }}
              </span>
            </div>
            <span v-if="errors[field.name]" class="error-text">
              {{ errors[field.name] }}
            </span>
          </div>
        </form>
        <div v-else class="error-message">
          無法載入用戶資料
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BaseLoading from '@/components/common/BaseLoading.vue'
import { fullName, email, phoneNumber, address } from '@/utils/validators'
//import AuthService from '@/services/auth.service'

// Lifecycle Hooks
//onMounted(initializeProfile)

const store = useStore()
    const router = useRouter()

    // Form Fields Configuration
    const formFields = [
      { name: 'username', label: '使用者名稱', type: 'text' },
      { name: 'email', label: '電子信箱', type: 'email' },
      { name: 'fullName', label: '全名', type: 'text' },
      { name: 'phoneNumber', label: '電話號碼', type: 'tel' },
      { name: 'address', label: '地址', type: 'textarea' }
    ]

    // Reactive State
    const isEditing = ref(false)
    const loading = ref(false)
    const editedProfile = ref({})
    const errors = ref({})
    const globalError = ref('')
    const originalProfile = ref({})
    //AuthService.getCurrentUser()
    const currentUser = ref()
    const retryCount = ref(0)
    const MAX_RETRIES = 3
const handleBack = () => {
  if (window.history.length > 2) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
    // Computed Properties
    //AuthService.isAuthenticated()
    const isAuthenticated = computed(() => !!store.state.accessToken)

    const isFormValid = computed(() => {
      return !Object.keys(errors.value).length &&
          Object.keys(editedProfile.value).length > 0 &&
          hasChanges.value
    })

    const hasChanges = computed(() => {
      return Object.keys(editedProfile.value).some(key =>
          editedProfile.value[key] !== originalProfile.value[key]
      )
    })

    // Validation Functions
    const validateField = (fieldName) => {
      const value = editedProfile.value[fieldName]
      let error = null

      switch(fieldName) {
        case 'username':
          error = value?.length >= 3 ? null : '使用者名稱至少需要3個字元'
          break
        case 'email':
          error = email(value) ? null : '請輸入有效的電子郵件'
          break
        case 'fullName':
          error = fullName(value) ? null : '請輸入有效的全名'
          break
        case 'phoneNumber':
          error = phoneNumber(value) ? null : '請輸入有效的電話號碼'
          break
        case 'address':
          error = address(value) ? null : '請輸入有效的地址'
          break
      }

      if (error) {
        errors.value[fieldName] = error
      } else {
        delete errors.value[fieldName]
      }
    }

    const validateForm = () => {
      formFields.forEach(field => validateField(field.name))
      return Object.keys(errors.value).length === 0
    }

    // Form Actions
    const startEditing = () => {
      // editedProfile.value = { ...currentUser.value }
      // originalProfile.value = { ...currentUser.value }
      // isEditing.value = true
      // errors.value = {}
      // globalError.value = ''
    }

    const handleCancel = () => {
      if (hasChanges.value) {
        const confirmed = window.confirm('確定要取消編輯？未儲存的變更將會遺失。')
        if (!confirmed) return
      }
      isEditing.value = false
      editedProfile.value = { ...originalProfile.value }
      errors.value = {}
      globalError.value = ''
    }

    const handleSave = async () => {
      if (!validateForm()) return

      // try {
      //   loading.value = true
      //   globalError.value = ''

      //   const response = await AuthService.updateProfile(editedProfile.value)
      //   if (response) {
      //     isEditing.value = false
      //     originalProfile.value = { ...response }
      //     editedProfile.value = { ...response }
      //     currentUser.value = response
      //     store.commit('auth/SET_SUCCESS_MESSAGE', '個人資料更新成功')
      //   }
      // } catch (error) {
      //   if (error.response?.status === 401) {
      //     try {
      //       await AuthService.refreshAccessToken()
      //       if (retryCount.value < MAX_RETRIES) {
      //         retryCount.value++
      //         return handleSave()
      //       }
      //     } catch (refreshError) {
      //       globalError.value = '登入已過期，請重新登入'
      //       router.push('/login')
      //     }
      //   } else {
      //     globalError.value = error.message || '更新失敗，請稍後再試'
      //   }
      // } finally {
      //   loading.value = false
      // }
    }

    // Initialize Profile Data
    const initializeProfile = async () => {
      // try {
      //   loading.value = true
      //   globalError.value = ''

      //   if (!AuthService.isAuthenticated()) {
      //     router.push({
      //       path: '/login',
      //       query: { redirect: router.currentRoute.value.fullPath }
      //     })
      //     return
      //   }

      //   const userData = AuthService.getCurrentUser()
      //   if (userData) {
      //     currentUser.value = userData
      //     originalProfile.value = { ...userData }
      //     editedProfile.value = { ...userData }
      //     retryCount.value = 0
      //   } else {
      //     // 如果本地沒有資料，則從伺服器獲取
      //     const profileData = await AuthService.getProfile()
      //     if (profileData) {
      //       currentUser.value = profileData
      //       originalProfile.value = { ...profileData }
      //       editedProfile.value = { ...profileData }
      //       retryCount.value = 0
      //     }
      //   }
      // } catch (error) {
      //   console.error('載入個人資料時發生錯誤:', error)
      //   globalError.value = error.message || '無法載入用戶資料'

      //   if (error.response?.status === 401) {
      //     router.push({
      //       path: '/login',
      //       query: {
      //         redirect: router.currentRoute.value.fullPath,
      //         error: 'session_expired'
      //       }
      //     })
      //   }
      // } finally {
      //   loading.value = false
      // }
    }

    // Watchers
    watch(() => editedProfile.value, (newValue, oldValue) => {
      if (isEditing.value && oldValue) {
        Object.keys(newValue).forEach(key => {
          if (newValue[key] !== oldValue[key]) {
            validateField(key)
          }
        })
      }
    }, { deep: true })

    // watch(() => AuthService.getCurrentUser(), (newUser) => {
    //   if (newUser) {
    //     currentUser.value = newUser
    //   }
    // })
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(-45deg, #fff3e0, #ffe0b2, #ffecb3, #fff8e1);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  min-height: 100vh;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.profile-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.profile-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid rgba(52, 152, 219, 0.3);
  background: #ffffff;
}

.error-banner {
  background-color: #fee2e2;
  color: #e53e3e;
  padding: 1rem;
  margin: 0.5rem;
  border-radius: 8px;
  border: 1px solid #fca5a5;
}

.title {
  font-size: 1.75rem;
  font-weight: 500;
  color: #2c3e50;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
}

.title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40px;
  height: 3px;
  background: #3498db;
  border-radius: 3px;
}

.profile-content {
  padding: 1.5rem;
  background: #ffffff;
}

.form-group {
  margin-bottom: 2rem;
  position: relative;
}

.form-group label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.input-wrapper {
  position: relative;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  color: #2c3e50;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #3498db;
  background-color: #fff;
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.15);
  outline: none;
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.form-text {
  display: block;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 1rem;
  color: #2c3e50;
  border: 2px solid transparent;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn:not(:disabled):hover {
  transform: translateY(-2px);
}

.btn-edit {
  background: #3498db;
  color: white;
}

.btn-edit:not(:disabled):hover {
  background: #2980b9;
}

.btn-save {
  background: #2ecc71;
  color: white;
}

.btn-save:not(:disabled):hover {
  background: #27ae60;
}

.btn-cancel {
  background: #e74c3c;
  color: white;
  margin-left: 1rem;
}

.btn-cancel:not(:disabled):hover {
  background: #c0392b;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.has-error {
  border-color: #e74c3c;
}

.error-text {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: block;
}

.back-link {
  margin-bottom: 1.5rem;
}

.back-link a {
  display: inline-flex;
  align-items: center;
  color: #34495e;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.back-link a:hover {
  background: #e9ecef;
  color: #2c3e50;
  transform: translateX(-5px);
}

.back-link i {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }

  .profile-header {
    flex-direction: column;
    gap: 1.25rem;
    text-align: center;
    padding: 1.25rem;
  }

  .title::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .action-buttons {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .btn {
    flex: 1;
    max-width: 140px;
    font-size: 0.95rem;
  }

  .btn-cancel {
    margin-left: 0;
  }

  .title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 1rem;
  }

  .profile-header {
    padding: 1rem;
  }

  .profile-content {
    padding: 1rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-input,
  .form-textarea,
  .form-text {
    padding: 0.625rem 0.875rem;
    font-size: 0.95rem;
  }

  .btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }
}
</style>
