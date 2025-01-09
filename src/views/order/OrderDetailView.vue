<template>
  <div class="container">
    <div class="row" v-if="isDataReady">
      <div class="col-12">
        <div class="back-link">
          <a @click="handleBack">
            <i class="fas fa-arrow-left"></i> 返回
          </a>
        </div>
        
        <h2 class="mb-4">訂單詳細資訊</h2>

        <!-- 訂單基本資訊 -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <p><strong>訂單編號:</strong> {{ order.orderId }}</p>
                <p><strong>訂購日期:</strong> {{ formatDate(order.orderDate) }}</p>
                <p><strong>訂單狀態:</strong> {{ getOrderStatus(order.statusId) }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>收件人:</strong> {{ userData.fullName }}</p>
                <p><strong>聯絡電話:</strong> {{ userData.phoneNumber }}</p>
                <p><strong>配送地址:</strong> {{ order.shippingAddress }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 訂單商品列表 -->
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-4">訂購商品</h5>
            <div class="table-responsive">
              <table class="table">
                <thead>
                <tr>
                  <th>商品名稱</th>
                  <th>單價</th>
                  <th>數量</th>
                  <th>小計</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in order.items" :key="item.id">
                  <td>{{ item.productName }}</td>
                  <td>{{ formatPrice(item.price) }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ formatPrice(item.price * item.quantity) }}</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                  <td colspan="3" class="text-end"><strong>總計:</strong></td>
                  <td><strong>{{ formatPrice(order.totalAmount) }}</strong></td>
                </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import {getOrderDetail} from '@/services/order';
import { getUser } from '@/services/users'

const store = useStore()
const route = useRoute()
const router = useRouter()
const userData = ref()
const order = ref()

// 檢查數據是否都準備好
const isDataReady = computed(() => {
  return order.value && userData.value
})

const orderStatusMap = {
  1: '待付款',
  2: '已付款',
  3: '已出貨',
  4: '已完成',
  5: '已取消'
}

const handleBack = () => {
  if (window.history.length > 2) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const getOrderStatus = (statusId) => {
  return orderStatusMap[statusId] || '未知狀態'
}

const formatPrice = (price) => {
  return price?.toLocaleString('zh-TW') || '0'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchOrderDetail = async () => {
    try {
        const id = route.params.id
        const response = await getOrderDetail(id, localStorage.getItem('accessToken'))
        order.value = response
    } catch (error) {
        console.error('獲取訂單詳細資訊失敗:', error)
    }
}

//使用者資料擷取
const fetchUserData = async () => {
  try {
    const data = await getUser(localStorage.getItem('userId'), localStorage.getItem('accessToken'))
    userData.value = data
  } catch (error) {
    console.error('獲取使用者資料失敗:', error)
  } finally {
  }
}

const initData = async () => {
  try {
    await fetchOrderDetail()
    await fetchUserData()
  } catch (error) {
    console.error('初始化資料失敗:', error)
  } finally {
  }
}

onMounted(() => {
    initData()
})
</script>

<style scoped>
.order-history,
.container {
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

h1, h2 {
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 1.5rem;
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
  border-radius: 6px;
  transition: all 0.3s ease;
}

.back-link a:hover {
  background: #f8f9fa;
  color: #3498db;
  transform: translateY(-2px);
}

.back-link i {
  margin-right: 0.5rem;
}

.filter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.search-input {
  width: 300px;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: border-color 0.3s ease;
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

.order-content {
  padding: 1.5rem 0;
}

.product-list {
  display: grid;
  gap: 1rem;
}

.product-item {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
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

.no-orders {
  text-align: center;
  padding: 3rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  border: none;
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.table th {
  background-color: #f8f9fa;
  color: #2c3e50;
  font-weight: 500;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
}

.table td {
  padding: 1rem;
  color: #2c3e50;
  border-bottom: 1px solid #f8f9fa;
  vertical-align: middle;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.table tfoot td {
  border-top: 2px solid #e9ecef;
  font-weight: 500;
}

.text-end {
  text-align: right;
}

/* 按鈕統一樣式 */
.btn,
button[class*="btn"],
:deep(.base-button) {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  background: #3498db;
  color: white;
}

.btn:hover,
button[class*="btn"]:hover,
:deep(.base-button:hover) {
  transform: translateY(-2px);
  background: #2980b9;
}

.btn[variant="outline"],
button[variant="outline"],
:deep(.base-button[variant="outline"]) {
  background: transparent;
  border: 2px solid #3498db;
  color: #3498db;
}

.btn[variant="outline"]:hover,
button[variant="outline"]:hover,
:deep(.base-button[variant="outline"]:hover) {
  background: #3498db;
  color: white;
}

@media (max-width: 768px) {
  .order-history,
  .container {
    padding: 1rem;
  }

  .filter-section {
    flex-direction: column;
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
  }

  .product-item img {
    width: 100%;
    height: 200px;
  }

  .table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .pagination {
    flex-wrap: wrap;
  }
}
</style>
