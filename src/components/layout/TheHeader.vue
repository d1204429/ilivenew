<template>
  <header class="header">
    <div class="header-container">
      <!-- 漢堡選單按鈕 -->
      <button
          class="burger-menu"
          :class="{ 'active': isMenuOpen }"
          @click="toggleMenu"
          aria-label="選單"
      >
        <span class="burger-bar"></span>
        <span class="burger-bar"></span>
        <span class="burger-bar"></span>
      </button>

      <!-- 側邊選單 -->
      <aside
          class="side-menu"
          :class="{ 'active': isMenuOpen }"
          role="navigation"
          aria-label="主選單"
      >
        <nav class="menu-items">
          <router-link
              to="/"
              class="menu-item"
              @click="toggleMenu"
          >首頁</router-link>

          <div class="menu-item-dropdown">
            <button
                class="menu-item"
                @click="toggleCategory"
                aria-expanded="isCategoryOpen"
            >
              分類
              <i :class="['fas', isCategoryOpen ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
            </button>
            <div
                class="dropdown-content"
                :class="{ 'show': isCategoryOpen }"
            >
              <router-link
                  v-for="category in categories"
                  :key="category.id"
                  :to="{ name: 'Category', params: { id: category.id } }"
                  class="dropdown-item"
                  @click="toggleMenu"
              >
                {{ category.name }}
              </router-link>
            </div>
          </div>

          <router-link
              to="/about"
              class="menu-item"
              @click="toggleMenu"
          >關於我們</router-link>

          <router-link
              to="/contact"
              class="menu-item"
              @click="toggleMenu"
          >聯絡我們</router-link>
        </nav>
      </aside>

      <!-- 搜尋欄 -->
      <div class="search-box" role="search">
        <input
            type="search"
            v-model="searchKeyword"
            placeholder="搜尋商品"
            aria-label="搜尋"
            @keyup.enter="handleSearch"
        >
        <button
            @click="handleSearch"
            aria-label="搜尋按鈕"
        >
          <i class="fas fa-search"></i>
        </button>
      </div>

      <!-- 用戶操作區 -->
      <nav class="user-nav">
        <template v-if="store.state.isLogIn">
          <div class="user-info">
            <router-link to="/profile" class="nav-link">
              <i class="fas fa-user"></i>
              <span class="username">{{ store.state.currentUserName }}</span>
            </router-link>
            <div class="user-dropdown">
              <router-link to="/profile" class="dropdown-item">個人資料</router-link>
              <router-link to="/orders" class="dropdown-item">訂單記錄</router-link>
              <button
                  class="dropdown-item"
                  @click="handleLogout"
              >登出</button>
              <!--  -->
            </div>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">登入</router-link>
          <router-link to="/register" class="nav-link">註冊</router-link>
        </template>

        <router-link to="/cart" class="cart-link" aria-label="購物車">
          <i class="fas fa-shopping-cart"></i>
          <!-- <span
              v-if="cartItemCount > 0"
              class="cart-count"
              role="status"
          >{{ cartItemCount }}</span> -->
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

// Reactive State
const isMenuOpen = ref(false)
const isCategoryOpen = ref(false)
const searchKeyword = ref('')
const categories = ref([
  { id: 11, name: '冰箱' },
  { id: 12, name: '電視' },
  { id: 13, name: '洗衣機' }
])
const isInitialized = ref(false)

// Computed Properties
watch(searchKeyword, async (newValue) => 
{
  const trimmedKeyword = newValue.trim()
  if(trimmedKeyword){
    store.commit('setIsTypeSearch', true)
  }else{
    store.commit('setIsTypeSearch', false)
    store.commit('setSearchResult', [])
  }
})

const handleSearch = async () => {
  const trimmedKeyword = searchKeyword.value.trim()
  if (trimmedKeyword) {
    await store.dispatch('searchProducts', trimmedKeyword)
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (!isMenuOpen.value) {
    isCategoryOpen.value = false
  }
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : ''
}

const toggleCategory = () => {
  isCategoryOpen.value = !isCategoryOpen.value
}

const handleResize = () => {
  if (window.innerWidth > 768 && isMenuOpen.value) {
    isMenuOpen.value = false
    document.body.style.overflow = ''
  }
}

const handleLogout= async() =>{
  await store.dispatch('logout')
  router.push('/login')
}
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.header {
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 0.5rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

/* 漢堡選單樣式 */
.burger-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  cursor: pointer;
  z-index: 1001;
  background: none;
  border: none;
  padding: 0;
}

.burger-bar {
  width: 100%;
  height: 2px;
  background-color: #333;
  transition: all 0.3s ease-in-out;
}

.burger-menu.active .burger-bar:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.burger-menu.active .burger-bar:nth-child(2) {
  opacity: 0;
}

.burger-menu.active .burger-bar:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

/* 側邊選單樣式 */
.side-menu {
  position: fixed;
  top: 60px;
  left: -250px;
  width: 250px;
  height: calc(100vh - 60px);
  background-color: #fff;
  transition: left 0.3s ease-in-out;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
}

.side-menu.active {
  left: 0;
}

.menu-items {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.menu-item {
  padding: 1rem;
  color: #333;
  text-decoration: none;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 1rem;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

/* 下拉選單樣式 */
.menu-item-dropdown {
  position: relative;
}

.dropdown-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  background-color: #f9f9f9;
}

.dropdown-content.show {
  max-height: 500px;
}

.dropdown-item {
  padding: 0.8rem 1rem 0.8rem 2rem;
  color: #333;
  text-decoration: none;
  display: block;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

/* 搜尋欄樣式 */
.search-box {
  flex: 1;
  max-width: 600px;
  margin: 0 2rem;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.search-box button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
}

/* 用戶導航樣式 */
.user-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  color: #007bff;
}

.cart-link {
  position: relative;
  color: #333;
  text-decoration: none;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #007bff;
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* 用戶資訊下拉選單 */
.user-info {
  position: relative;
}

.user-info:hover .user-dropdown {
  display: block;
}

.username {
  margin-left: 0.5rem;
  font-weight: 500;
}

.user-dropdown {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #eee;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 0.5rem 0;
  min-width: 150px;
  z-index: 1000;
}

.user-dropdown .dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
  font-size: 0.9rem;
  border: none;
  width: 100%;
  text-align: left;
  background: none;
  cursor: pointer;
}

.user-dropdown .dropdown-item:hover {
  background-color: #f5f5f5;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .header-container {
    flex-wrap: wrap;
    height: auto;
    gap: 1rem;
    padding: 0.5rem 1rem;
  }

  .search-box {
    order: 2;
    margin: 0;
    width: 100%;
  }

  .user-nav {
    order: 1;
  }
}
</style>
