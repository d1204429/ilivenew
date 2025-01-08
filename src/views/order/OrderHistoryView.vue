<template>
  <div class="order-history">
    <h1>訂單記錄</h1>

    <!-- 訂單篩選區 -->
    <div class="filter-section">
      <BaseInput
          v-model="searchKeyword"
          placeholder="搜尋訂單編號"
          class="search-input"
      />
      <BaseButton @click="handleSearch">搜尋</BaseButton>
    </div>

    <!-- 訂單列表 -->
    <div class="order-list" v-if="orders.length">
      <div class="order-item" v-for="(order, index) in orders" :key="order.id">
        <div class="order-header">
          <span class="order-number">訂單編號: {{ order.orderId }}</span>
          <span class="order-date">下單時間: {{ formatDate(order.createdAt) }}</span>
          <span class="order-status">狀態: {{ order.statusId }}</span>
        </div>
        <div class="order-content">
          <div class="product-list">
            <div v-for="(item, subdex) in orderItems[index]" :key="item.productId" class="product-item">
              <img :src="getImageUrl(item.imageUrl)" :alt="item.name">
              <div class="product-info">
                <h3>{{ item.name }}</h3>
                <p>數量: {{ orders[index].items[subdex].quantity }}</p>
                <p>單價: ${{ orders[index].items[subdex].price }}</p>
              </div>
            </div>
          </div>
          <div class="order-summary">
            <p>總金額: ${{ order.totalAmount }}</p>
          </div>
        </div>
        <div class="order-footer">
          <BaseButton
              @click="viewOrderDetail(order.orderId)"
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
import { getProductInfo } from '@/services/products';

const store = useStore()
const router = useRouter()

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
</style>
