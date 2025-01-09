<template>
  <div class="order-history">
    <h1>訂單記錄</h1>
    <div class="back-link">
      <a @click="handleBack">
        <i class="fas fa-arrow-left"></i> 返回
      </a>
    </div>

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
      <div class="order-item" v-for="(order, index) in orders" :key="order.id">
        <div class="order-header">
          <span class="order-number">訂單編號: {{ order.orderId }}</span>
          <span class="order-date">下單時間: {{ formatDate(order.createdAt) }}</span>
          <span class="order-status">狀態: {{ getOrderStatus(order.statusId) }}</span>
        </div>
        <div class="order-content">
          <div class="product-list">
            <div v-for="(item, subdex) in orderItems[index]" :key="item.productId" class="product-item">
              <img :src="getImageUrl(item.imageUrl)" :alt="item.name" @error="handleImageError">
              <div class="product-info">
                <h3>{{ item.name }}</h3>
                <p>數量: {{ orders[index].items[subdex].quantity }}</p>
                <p>單價: ${{ formatPrice(orders[index].items[subdex].price) }}</p>
              </div>
            </div>
          </div>
          <div class="order-summary">
            <p>總金額: ${{ formatPrice(order.totalAmount) }}</p>
          </div>
        </div>
        <div class="order-footer">
          <BaseButton @click="viewOrderDetail(order.orderId)" variant="outline">
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
import { getOrder } from '@/services/order'
import { getProductInfo } from '@/services/products'

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

// 資料狀態
const orders = ref([])
const orderItems = ref([])
const searchKeyword = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10

// 初始化加載
onMounted(async () => {
  await fetchOrders()
  await fetchOrderItems()
})

// 獲取訂單數據
const fetchOrders = async () => {
  try {
    const response = await getOrder(store.state.accessToken)
    if (response && Array.isArray(response)) {
      let filteredOrders = response

      if (searchKeyword.value.trim()) {
        filteredOrders = response.filter(order =>
            order.orderId.toString().includes(searchKeyword.value.trim())
        )
      }

      orders.value = filteredOrders
    }
  } catch (error) {
    console.error('獲取訂單失敗:', error)
    orders.value = []
  }
}

const fetchOrderItems = async () => {
  try {
    for (let i = 0; i < orders.value.length; i++) {
      let items = orders.value[i].items
      orderItems.value[i] = await fetchProdItems(items)
    }
  } catch (error) {
    console.error('獲取訂單失敗:', error)
  }
}

const fetchProdItems = async (items) => {
  try {
    if (items && items.length > 0) {
      const promises = items.map(item => getProductInfo(item.productId))
      return await Promise.all(promises)
    }
  } catch (error) {
    console.error('獲取購物車失敗:', error)
    return []
  }
}

// 圖片處理方法
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return
  }
  return imagePath.replace('/image/', '/static/image/')
}

// 圖片載入失敗處理
const handleImageError = (event) => {
  event.target.src = '/default-image.jpg'
}

// 返回按鈕處理
const handleBack = () => {
  if (window.history.length > 2) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = ''
  fetchOrders()
}

// 獲取訂單狀態
const getOrderStatus = (statusId) => {
  return orderStatusMap[statusId] || '未知狀態'
}

// 金額格式化
const formatPrice = (price) => {
  return price?.toLocaleString('zh-TW') || '0'
}

// 搜尋處理
const handleSearch = () => {
  currentPage.value = 1
  fetchOrders()
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
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.product-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
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
</style>
