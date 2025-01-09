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
                <p><strong>訂購日期:</strong> {{ formatDate(order.createdAt) }}</p>
                <p><strong>訂單狀態:</strong> {{ getOrderStatus(order.statusId) }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>收件人:</strong> {{ userData?.fullName }}</p>
                <p><strong>聯絡電話:</strong> {{ userData?.phoneNumber }}</p>
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
                <tr v-for="item in order.items" :key="item.orderItemId">
                  <td>{{ item.productName }}</td>
                  <td>${{ formatPrice(item.price) }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>${{ formatPrice(item.price * item.quantity) }}</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                  <td colspan="3" class="text-end"><strong>總計:</strong></td>
                  <td><strong>${{ formatPrice(order.totalAmount) }}</strong></td>
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
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getOrderDetail } from '@/services/order'
import { getUser } from '@/services/users'

const store = useStore()
const route = useRoute()
const router = useRouter()
const userData = ref()
const order = ref({
  orderId: '',
  createdAt: '',
  statusId: '',
  shippingAddress: '',
  items: [],
  totalAmount: 0
})

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
    const orderId = route.params.id
    const response = await getOrderDetail(orderId, store.state.accessToken)
    if (response) {
      order.value = response
    }
  } catch (error) {
    console.error('獲取訂單詳細資訊失敗:', error)
  }
}

const fetchUserData = async () => {
  try {
    const data = await getUser(store.state.userId, store.state.accessToken)
    userData.value = data
  } catch (error) {
    console.error('獲取使用者資料失敗:', error)
  }
}

const initData = async () => {
  try {
    await Promise.all([fetchOrderDetail(), fetchUserData()])
  } catch (error) {
    console.error('初始化資料失敗:', error)
  }
}

onMounted(() => {
  initData()
})
</script>

<style scoped>
.table th {
  background-color: #f8f9fa;
}

.table td, .table th {
  vertical-align: middle;
}

.text-end {
  text-align: right;
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
