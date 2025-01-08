<template>
  <div class="order-history">
    <h1>訂單記錄</h1>

    <!-- 訂單篩選區 -->
    <div class="filter-section">
      <BaseInput
          v-model="searchKeyword"
          placeholder="搜尋訂單編號"
          class="search-input"
          @keyup.enter="handleSearch"
      />
      <BaseButton @click="handleSearch">搜尋</BaseButton>
      <BaseButton
          v-if="searchKeyword"
          @click="clearSearch"
          variant="outline"
      >
        清除搜尋
      </BaseButton>
    </div>

    <!-- 訂單列表 -->
    <div class="order-list" v-if="orders.length">
      <div class="order-item" v-for="order in orders" :key="order.id">
        <div class="order-header">
          <span class="order-number">訂單編號: {{ order.orderId }}</span>
          <span class="order-date">下單時間: {{ formatDate(order.createdAt) }}</span>
          <span class="order-status">狀態: {{ getOrderStatus(order.statusId) }}</span>
        </div>
        <div class="order-content">
          <div class="product-list">
            <div v-for="item in order.orderItems" :key="item.orderItemId" class="product-item">
              <img
                  :src="getImageUrl(item.product?.imageUrl || item.product?.imgUrl || item.imgUrl)"
                  :alt="item.product?.name || item.productName"
                  @error="handleImageError"
                  class="product-image"
              >
              <div class="product-info">
                <h3>{{ item.productName }}</h3>
                <p>數量: {{ item.quantity }}</p>
                <p>單價: ${{ formatPrice(item.price) }}</p>
              </div>
            </div>
          </div>
          <div class="order-summary">
            <p>總金額: ${{ order.totalAmount }}</p>
          </div>
        </div>
        <div class="order-footer">
          <BaseButton
              @click="viewOrderDetail(order.id)"
              variant="outline"
          >
            查看詳情
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- 無訂單時顯示 -->
    <div v-else class="no-orders">
      <p>目前沒有訂單記錄</p>
    </div>

    <!-- 分頁控制 -->
    <div class="pagination" v-if="totalPages > 1">
      <BaseButton
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
      >
        上一頁
      </BaseButton>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <BaseButton
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
      >
        下一頁
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import {getOrder} from '@/services/order';

const store = useStore()
const router = useRouter()
// 訂單狀態對應
const orderStatusMap = {
  1: '待付款',
  2: '已付款',
  3: '已出貨',
  4: '已完成',
  5: '已取消'
}

const getOrderStatus = (statusId) => {
  return orderStatusMap[statusId] || '未知狀態'
}
const clearSearch = () => {
  searchKeyword.value = ''
  fetchOrders()
}
// 資料狀態
const orders = ref([])
const searchKeyword = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10

// 圖片 URL 處理
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/default-image.jpg'  // 提供預設圖片路徑
  if (imagePath.startsWith('http')) return imagePath  // 處理完整 URL
  return imagePath.startsWith('/static') ? imagePath : `/static/image/${imagePath}`  // 處理相對路徑
}

// 圖片載入失敗處理
const handleImageError = (event) => {
  event.target.src = '/default-image.jpg' // 可以設置一個默認圖片
}

// 金額格式化
const formatPrice = (price) => {
  return price?.toLocaleString('zh-TW') || '0'
}


// 初始化加載
onMounted(async () => {
  await fetchOrders()
  console.log('訂單數據:', orders.value)
  if (orders.value.length > 0) {
    console.log('第一個訂單的商品:', orders.value[0].orderItems)
    if (orders.value[0].orderItems?.length > 0) {
      console.log('第一個商品的圖片URL:', orders.value[0].orderItems[0].product?.imageUrl)
    }
  }
})

// 獲取訂單數據
const fetchOrders = async () => {
  try {
    const response = await getOrder(store.state.accessToken)
    if (response && Array.isArray(response)) {
      let filteredOrders = response

      // 如果有搜尋關鍵字，進行過濾
      if (searchKeyword.value.trim()) {
        filteredOrders = response.filter(order =>
            order.orderId.toString().includes(searchKeyword.value.trim())
        )
      }

      orders.value = filteredOrders.map(order => ({
        ...order,
        orderItems: order.orderItems || []
      }))
    } else {
      orders.value = []
    }
  } catch (error) {
    console.error('獲取訂單失敗:', error)
    orders.value = []
  }
}
// 搜尋處理
const handleSearch = () => {
  currentPage.value = 1
  fetchOrders() // 重新獲取並過濾訂單
}

// 切換頁面
const changePage = (page) => {
  currentPage.value = page
  fetchOrders()
}

// 查看訂單詳情
const viewOrderDetail = (orderId) => {
  router.push(`/order/${orderId}`)
}

// 日期格式化
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.order-history {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.filter-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.order-content {
  padding: 15px 0;
}

.product-list {
  display: grid;
  gap: 15px;
}

.product-item {
  display: flex;
  gap: 15px;
}

.product-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.order-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.no-orders {
  text-align: center;
  padding: 40px;
  background: #f5f5f5;
  border-radius: 8px;
}
.product-item {
  display: flex;
  gap: 15px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.product-info {
  flex: 1;
}

.product-info h3 {
  margin: 0 0 8px;
  font-size: 1.1rem;
  color: #333;
}

.product-info p {
  margin: 4px 0;
  color: #666;
}
</style>
