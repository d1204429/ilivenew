<template>
  <div class="checkout-view">
    <div class="back-link">
      <a @click="handleBack">
        <i class="fas fa-arrow-left"></i> 返回
      </a>
    </div>
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
        {{ currentStep === 1 ? '去下單' : '結帳' }}
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
import {createOrder, orderCreditPayment, orderApplePayPayment} from '@/services/order';

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
const handleBack = () => {
  if (window.history.length > 2) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
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
    if (currentStep.value ==1) {
        await processPayment()
        currentStep.value++
    } else {
        if(selectedPayment.value === "credit"){
          await creditPayment()
        }else{
          await applePayment()
        }
        router.push('/orders')
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
    //console.log(localStorage.getItem('accessToken'))
    const data = await createOrder(buyerInfo.value.address , localStorage.getItem('accessToken'))
    orderId.value = data.data.orderId
    console.log(orderId.value)
  } catch (error) {
    console.error('轉訂單失敗:', error)
  } finally {
    loading.value = false
  }
}

const creditPayment = async () => {
    try {
    loading.value = true
    //console.log(localStorage.getItem('accessToken'))
    const data = await orderCreditPayment(orderId.value, cardInfo.value.number , localStorage.getItem('accessToken'))
  } catch (error) {
    console.error('信用卡付款失敗:', error)
  } finally {
    loading.value = false
  }
}

const applePayment = async () => {
    try {
    loading.value = true
    //console.log(localStorage.getItem('accessToken'))
    const data = await orderApplePayPayment(orderId.value, localStorage.getItem('accessToken'))
  } catch (error) {
    console.error('信用卡付款失敗:', error)
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
    const data = await getUser(localStorage.getItem('userId'), localStorage.getItem('accessToken'))
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
    //console.log(localStorage.getItem('accessToken'))
    const data = await getCartItems(localStorage.getItem('accessToken'))
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
      const promises = cartItems.value.map(item => getProductInfo(item.productId))
      const results = await Promise.all(promises)
      prodItems.value = results
    }
  } catch (error) {
    console.error('獲取購物車失敗:', error)
  } finally {
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

.checkout-steps {
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
  gap: 1.5rem;
}

.step {
  padding: 1rem 2.5rem;
  background: #ffffff;
  border-radius: 8px;
  color: #95a5a6;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.step.active {
  background: #3498db;
  color: white;
  transform: translateY(-2px);
}

.checkout-section {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-group input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.15);
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
  padding: 1.25rem;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.shipping-option:hover,
.payment-method:hover {
  background: #fff;
  transform: translateY(-2px);
}

.shipping-option.active,
.payment-method.active {
  border-color: #3498db;
  background: #fff;
}

.method-info h3,
.method-details h3 {
  color: #2c3e50;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.method-info p,
.method-details p {
  color: #7f8c8d;
  margin: 0;
}

.credit-card-form {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.order-summary {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.order-summary h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.summary-items {
  margin-bottom: 2rem;
}

.summary-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.25rem 0;
  border-bottom: 2px solid #f8f9fa;
}

.summary-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details h5 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.item-details p {
  color: #7f8c8d;
  margin: 0.25rem 0;
}

.item-price {
  color: #3498db;
  font-weight: 500;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: #2c3e50;
}

.grand-total {
  font-size: 1.25rem;
  font-weight: 600;
  color: #3498db;
  border-top: 2px solid #f8f9fa;
  padding-top: 1rem;
  margin-top: 1rem;
}

.checkout-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-next {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  border: none;
  border-radius: 6px;
  background: #3498db;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-next:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-2px);
}

.btn-next:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .checkout-view {
    padding: 1rem;
  }

  .checkout-steps {
    flex-direction: row;
    gap: 1rem;
  }

  .step {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }

  .checkout-section,
  .order-summary {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .summary-item {
    flex-direction: column;
    gap: 1rem;
  }

  .summary-item img {
    width: 100%;
    height: 200px;
  }

  .checkout-actions {
    flex-direction: column;
  }

  .btn-next {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .checkout-view {
    padding: 0.75rem;
  }

  .checkout-section,
  .order-summary {
    padding: 1rem;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-group input {
    padding: 0.625rem 0.875rem;
  }
}
</style>
