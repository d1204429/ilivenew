<template>
  <div class="order-history">
    <h1>訂單記錄</h1>
    <div class="back-link">
      <a @click="handleBack">
        <i class="fas fa-arrow-left"></i> 返回
      </a>
    </div>

    <!-- 訂單篩選區 -->
    <!-- <div class="filter-section">
      <BaseInput
          v-model="searchKeyword"
          placeholder="搜尋訂單編號"
          class="search-input"
          @keyup.enter="handleSearch"
      />
      <BaseButton @click="handleSearch">搜尋</BaseButton>
    </div> -->

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
              <img :src="getImageUrl(item.imageUrl)" :alt="item.name">
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
          <BaseButton
              @click="viewOrderDetail(order.orderId)"
              variant="outline">
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
import { getProductInfo } from '@/services/products';

const store = useStore()
const router = useRouter()

// 訂單狀態對應
const orderStatusMap = {
  1: '下單鎖定',
  2: '已付款',
  3: '已出貨',
  4: '已取消',
  5: '已完成',
  6: '已退貨',
  7: '未付款取消'
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
    const response = await getOrder(localStorage.getItem('accessToken'))
    orders.value = response
  } catch (error) {
    console.error('獲取訂單失敗:', error)
  }
}

const fetchOrderItems = async()=>{
  try {
    for (let i = 0; i < orders.value.length; i++) {
      let items = orders.value[i].items
      orderItems.value[i] =await fetchProdItems(items)
    }
    //console.log(orderItems.value)
  } catch (error) {
    console.error('獲取訂單失敗:', error)
  }
}

//
const fetchProdItems = async (items) => {
  try {
    //loading.value = true
    //console.log(items)
    if(items && items.length > 0){
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

// 返回按鈕處理
const handleBack = () => {
  if (window.history.length > 2) {
    router.go(-1)
  } else {
    router.push('/')
  }
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

h1 {
  font-size: 1.75rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.filter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.search-input {
  width: 300px;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background: #f8f9fa;
}

.search-input:focus {
  border-color: #3498db;
  outline: none;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-item {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.order-item:hover {
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
  color: #2c3e50;
}

.order-number {
  font-weight: 500;
}

.order-status {
  color: #3498db;
  font-weight: 500;
}

.order-content {
  padding: 1.5rem 0;
}

.product-list {
  display: grid;
  gap: 1.5rem;
}

.product-item {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.product-item:hover {
  transform: translateY(-2px);
}

.product-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex: 1;
}

.product-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 500;
}

.product-info p {
  margin: 0.25rem 0;
  color: #7f8c8d;
}

.order-summary {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #2c3e50;
}

.order-summary p {
  margin: 0;
  font-weight: 500;
  color: #3498db;
}

.order-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 2px solid #f8f9fa;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.pagination span {
  color: #2c3e50;
  font-weight: 500;
}

.no-orders {
  text-align: center;
  padding: 3rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.no-orders p {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin: 0;
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
  background: #ffffff;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.back-link a:hover {
  background: #f8f9fa;
  color: #3498db;
  transform: translateY(-2px);
}

.back-link i {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .order-history {
    padding: 1rem;
  }

  .filter-section {
    flex-direction: column;
    padding: 1rem;
  }

  .search-input {
    width: 100%;
  }

  .order-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .product-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .product-item img {
    width: 150px;
    height: 150px;
  }

  .pagination {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0.75rem;
  }
}
</style>
