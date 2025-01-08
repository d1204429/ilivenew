<template>
  <div class="checkout-view">
    <!-- 結帳流程進度條 -->
    <div class="checkout-steps">
      <div class="step" :class="{ active: currentStep >= 1 }">填寫資料</div>
      <div class="step" :class="{ active: currentStep >= 2 }">付款方式</div>
    </div>

    <!-- 購買人資訊 -->
    <div class="checkout-section" v-if="currentStep === 1">
      <h2>購買人資訊</h2>
      <div class="form-group">
        <label>姓名</label>
        <input v-model="buyerInfo.name" type="text" required>
      </div>
      <div class="form-group">
        <label>手機</label>
        <input v-model="buyerInfo.phone" type="tel" required>
      </div>
      <div class="form-group">
        <label>地址</label>
        <input v-model="buyerInfo.address" type="tel" required>
      </div>
      <h2>寄送方式</h2>
      <div class="shipping-options">
        <div v-for="method in shippingMethods"
             :key="method.id"
             class="shipping-option"
             :class="{ active: selectedShipping === method.id }"
             @click="selectShipping(method.id)">
          <div class="method-info">
            <h3>{{ method.name }}</h3>
            <p>{{ method.description }}</p>
          </div>
          <div class="method-price">
            {{ method.price === 0 ? '免運費' : `$${method.price}` }}
          </div>
        </div>
      </div>
    </div>

    <!-- 訂單摘要 -->
    <div class="order-summary" v-if="isDataReady">
      <h2>訂單摘要</h2>
      <div class="summary-items">
        <div v-for="(item, index) in cartItems" class="summary-item">
          <img :src="getImageUrl(prodItems[index].imageUrl)" :alt="item.name">
          <div class="item-details">
            <h5>{{ prodItems[index].name }}</h5>
            <p>數量: {{ item.quantity }}</p>
            <p class="item-price">${{ getPrice(prodItems[index].promotionalPrice, prodItems[index].originalPrice) }}</p>
          </div>
        </div>
      </div>
      <div class="summary-total">
        <div class="total-row">
          <span>小計</span>
          <span>${{ formatPrice(subtotal) }}</span>
        </div>
        <div class="total-row">
          <span>運費</span>
          <span>${{ formatPrice(shippingFee) }}</span>
        </div>
        <div class="total-row grand-total">
          <span>總計</span>
          <span>${{ formatPrice(total) }}</span>
        </div>
      </div>
    </div>
    <!-- 付款方式 -->
    <div class="checkout-section" v-if="currentStep === 2">
      <h2>付款方式</h2>
      <div class="payment-methods">
        <div v-for="method in paymentMethods"
             :key="method.id"
             class="payment-method"
             :class="{ active: selectedPayment === method.id }"
             @click="selectPayment(method.id)">
          <i :class="method.icon"></i>
          <div class="method-details">
            <h3>{{ method.name }}</h3>
            <p>{{ method.description }}</p>
          </div>
        </div>
      </div>

      <!-- 信用卡表單 -->
      <div class="credit-card-form" v-if="selectedPayment === 'credit'">
        <div class="form-group">
          <label>卡號</label>
          <input type="text" v-model="cardInfo.number" placeholder="1234 5678 9012 3456">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>有效期限</label>
            <input type="text" v-model="cardInfo.expiry" placeholder="MM/YY">
          </div>
          <div class="form-group">
            <label>CVV</label>
            <input type="text" v-model="cardInfo.cvv" placeholder="123">
          </div>
        </div>
      </div>

      <div class="credit-card-form" v-if="selectedPayment === 'apple'">
        <span>產生訂單後請於30分鐘內付款完成</span>
      </div>
    </div>

    <!-- 操作按鈕 -->
    <div class="checkout-actions">
      <!-- <button
          v-if="currentStep > 1"
          class="btn-back"
          @click="previousStep"
      >
        上一步
      </button> -->
      <button
          class="btn-next"
          @click="nextStep"
          :disabled="!canProceed"
      >
        {{ currentStep === 1 ? '轉訂單' : '結帳' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUser } from '@/services/users'
import { useStore } from 'vuex'
import {getCartItems} from '@/services/cart'
import { getProductInfo } from '@/services/products';
import {createOrder, orderCreditPayment} from '@/services/order';

const router = useRouter()
const route = useRoute()
const store = useStore()
const currentStep = ref(1)
const userData = ref()
const cartItems = ref([])
const prodItems = ref([])
const loading = ref(true)
const orderId = ref()

// 購買人資訊
const buyerInfo = ref({
    name: '',
    phone: '',
    address: ''
})

// 運送方式
const shippingMethods = [
    //{ id: 'home', name: '宅配到府', description: '2-3 個工作天到貨', price: 60 },
    //{ id: 'store', name: '超商取貨', description: '2-3 個工作天到店', price: 60 },
    { id: 'free', name: '免運宅配', description: '', price: 0 }
]
const selectedShipping = ref('free')

// 付款方式
const paymentMethods = [
    { id: 'credit', name: '信用卡', description: '支援 VISA, Master, JCB', icon: 'fas fa-credit-card' },
    { id: 'apple', name: 'apple Pay', description: '', icon: 'fas fa-university' }
]
const selectedPayment = ref('')

// 信用卡資訊
const cardInfo = ref({
    number: '',
    expiry: '',
    cvv: ''
})

// 計算金額
const subtotal= computed(() =>{
  let total = 0
  for (const item of cartItems.value) {
    const product = prodItems.value.find(prod => prod.productId === item.productId)
    //console.log(product)
    if (product) {
      if (product.promotionalPrice < product.originalPrice) {
        total += product.promotionalPrice * (item.quantity || 0)
      } else {
        total += product.originalPrice * (item.quantity || 0)
      }
    }
  }
  return total
})

const shippingFee = computed(() => {
    if (selectedShipping.value === 'free' || subtotal.value >= 1000) return 0
    return 60
})

const total = computed(() => subtotal.value + shippingFee.value)

// 檢查是否可以進行下一步
const canProceed = computed(() => {
    if (currentStep.value === 1) {
        return buyerInfo.value.name &&
        buyerInfo.value.phone &&
        buyerInfo.value.address &&
        selectedShipping.value
    }
    if (currentStep.value === 2) {
        return selectedPayment.value &&
        (selectedPayment.value !== 'credit' ||
        (cardInfo.value.number && cardInfo.value.expiry && cardInfo.value.cvv))
    }
    return false
})

// 方法
const nextStep = async () => {
  if (currentStep.value === 1) {
    const success = await processPayment()
    if (success) {
      currentStep.value++
    }
  } else {
    try {
      if (selectedPayment.value === "credit") {
        const success = await creditPayment()
        if (success) {
          router.push('/orders')
        }
      } else {
        // 處理其他支付方式
        router.push('/orders')
      }
    } catch (error) {
      alert('付款處理失敗，請稍後再試')
    }
  }
}

// const previousStep = () => {
//     if (currentStep.value > 1) {
//         currentStep.value--
//     }
// }

const selectShipping = (methodId) => {
    selectedShipping.value = methodId
}

const selectPayment = (methodId) => {
    selectedPayment.value = methodId
}

const formatPrice = (price) => {
    return price?.toLocaleString('zh-TW') || '0'
}

const processPayment = async () => {
  try {
    loading.value = true
    const response = await createOrder(buyerInfo.value.address, store.state.accessToken)
    // 確保 response 有值且包含 data
    if (response && response.data) {
      orderId.value = response.data.orderId
      console.log('Order created:', orderId.value)
      return true // 返回成功標誌
    } else {
      throw new Error('訂單創建失敗: 伺服器回應異常')
    }
  } catch (error) {
    console.error('轉訂單失敗:', error)
    alert(error.response?.data?.message || '轉訂單失敗，請稍後再試')
    return false // 返回失敗標誌
  } finally {
    loading.value = false
  }
}

const creditPayment = async () => {
  try {
    loading.value = true
    const response = await orderCreditPayment(
        orderId.value,
        cardInfo.value.number,
        store.state.accessToken
    )
    if (response && response.data) {
      return true
    }
    throw new Error('付款處理失敗')
  } catch (error) {
    console.error('信用卡付款失敗:', error)
    alert(error.response?.data?.message || '信用卡付款失敗，請稍後再試')
    return false
  } finally {
    loading.value = false
  }
}

// 檢查數據是否都準備好
const isDataReady = computed(() => {
  return cartItems.value?.length > 0 &&
         prodItems.value?.length > 0 &&
         cartItems.value.length === prodItems.value.length
})

const getPrice = (promt, origin) => {
  if(promt<origin){
    return promt;
  }
  return origin;
}

// 圖片處理方法
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return
  }
  return imagePath.replace('/image/', '/static/image/')
}

//使用者資料擷取
const fetchUserData = async () => {
  try {
    const data = await getUser(store.state.userId, store.state.accessToken)
    userData.value = data
    buyerInfo.value.name = data.fullName
    buyerInfo.value.phone = data.phoneNumber
    buyerInfo.value.address = data.address
  } catch (error) {
    console.error('獲取使用者資料失敗:', error)
  } finally {
  }
}

// 獲取購物車商品
const fetchCartItems = async () => {
  try {
    //console.log(store.state.accessToken)
    const data = await getCartItems(store.state.accessToken)
    cartItems.value = data

  } catch (error) {
    console.error('獲取購物車失敗:', error)
  } finally {
  }
}

//商品車
const fetchProdItems = async () => {
  try {
    if(cartItems.value && cartItems.value.length > 0){
      // 獲取所有商品信息
      const response = await getProductInfo()
      // 過濾出購物車中的商品
      prodItems.value = response.filter(product =>
          cartItems.value.some(cartItem => cartItem.productId === product.productId)
      )
    }
  } catch (error) {
    console.error('獲取商品資訊失敗:', error)
  }
}

const initData = async () => {
  try {
    await fetchCartItems()
    await fetchProdItems()
  } catch (error) {
    console.error('初始化資料失敗:', error)
  } finally {
  }
}

onMounted(() => {
    fetchUserData()
    initData()
})
</script>

<style scoped>
.checkout-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.checkout-steps {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.step {
  padding: 1rem 2rem;
  margin: 0 1rem;
  background: #f5f5f5;
  border-radius: 4px;
  color: #666;
}

.step.active {
  background: var(--primary-color);
  color: white;
}

.checkout-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.address-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 1rem;
}

.shipping-options,
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shipping-option,
.payment-method {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.shipping-option.active,
.payment-method.active {
  border-color: var(--primary-color);
  background: #f8f9ff;
}

.credit-card-form {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.order-summary {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.summary-items {
  margin-bottom: 2rem;
}

.summary-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.summary-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.grand-total {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--primary-color);
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.checkout-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-back,
.btn-next {
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-back {
  background: white;
  border: 1px solid #ddd;
}

.btn-next {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-next:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .checkout-view {
    padding: 1rem;
  }

  .address-inputs {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
