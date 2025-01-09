<template>
  <div class="cart-view">
    <div class="back-link">
      <a @click="handleBack">
        <i class="fas fa-arrow-left"></i> 返回
      </a>
    </div>
    <!-- 購物車標題 -->
    <div class="cart-header">
      <h1>購物車</h1>
    </div>

    <!-- 購物車內容區 -->
    <div class="cart-container">
      <div  v-if="cartItems.length > 0">
        <button class="text-gray-600 hover:text-red-600"
        @click="deleteCart">移除所有商品</button>
      </div>
      <!-- 購物車列表 -->
      <div>
        <div v-if="!loading && cartItems.length > 0">
          <CartList
          v-if="isDataReady"
          :cart-items="cartItems"
          :prod-items="prodItems"
          @remove-item="removeItem"/>
        </div>
        <div v-else-if="!loading && cartItems.length == 0" class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>您的購物車是空的</p>
          <router-link to="/products" class="continue-shopping">
            繼續購物
          </router-link>
        </div>
        <!-- 載入中提示 -->
         <div v-else class="loading">
          <i class="fas fa-spinner fa-spin"></i>
          載入中...
        </div>
      </div>
      <!-- 購物車摘要 -->
      <div class="cart-summary-container" v-if="cartItems.length > 0">
        <CartSummary
        v-if="isDataReady"
        :cart-items="cartItems"
        :prod-items="prodItems"
        :total="calculateTotal"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CartList from '@/components/cart/CartList.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import {getCartItems, delCartItem, clearCart} from '@/services/cart'
import { getProductInfo } from '@/services/products';

const router = useRouter()
const store = useStore()
const loading = ref(true)
const cartItems = ref([])
const prodItems = ref([])

// 計算總金額
const calculateTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

// 檢查數據是否都準備好
const isDataReady = computed(() => {
  return cartItems.value?.length > 0 &&
         prodItems.value?.length > 0 &&
         cartItems.value.length === prodItems.value.length
})

// 獲取購物車商品
const fetchCartItems = async () => {
  try {
    if(!store.state.accessToken){
      router.push('/login')
    }
    loading.value = true
    //console.log(store.state.accessToken)
    const data = await getCartItems(store.state.accessToken)
    cartItems.value = data

  } catch (error) {
    console.error('獲取購物車失敗:', error)
  } finally {
    loading.value = false
  }
}

//商品車
const fetchProdItems = async () => {
  try {
    loading.value = true
    if(cartItems.value && cartItems.value.length > 0){
      const promises = cartItems.value.map(item => getProductInfo(item.productId))
      const results = await Promise.all(promises)
      prodItems.value = results
    }
  } catch (error) {
    console.error('獲取購物車失敗:', error)
  } finally {
    loading.value = false
  }
}

// 移除商品
const removeItem = (cartItemId) => {
  //console.log(cartItemId)
  deleteCartItemQty(cartItemId)
};

const deleteCartItemQty = async (cartItemId) =>{
  const response = await delCartItem(cartItemId, store.state.accessToken)
  if (!response) {
        alert(error.message || '刪除購物車項目失敗')
      }else{
        initData()
      }
}

//清空購物車
const deleteCart = ()=>{
  clearCartItem(cartItems.value.at(0).cartId)
}

const clearCartItem = async (cartId) =>{
  const response = await clearCart(cartId, store.state.accessToken)
  if (!response) {
        alert(error.message || '刪除購物車失敗')
      }else{
        initData()
      }
}

const initData = async () => {
  loading.value = true
  try {
    await fetchCartItems()
    await fetchProdItems()
  } catch (error) {
    console.error('初始化資料失敗:', error)
  } finally {
    loading.value = false
  }
}
const handleBack = () => {
  if (window.history.length > 2) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
onMounted(() => {
  initData()
})
</script>

<style scoped>
.cart-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
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

.cart-header {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.cart-header h1 {
  font-size: 1.75rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cart-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-top: 1rem;
}

.empty-cart {
  text-align: center;
  padding: 3rem 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.empty-cart i {
  font-size: 3.5rem;
  color: #95a5a6;
  margin-bottom: 1.5rem;
}

.empty-cart p {
  color: #2c3e50;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.continue-shopping {
  display: inline-block;
  padding: 0.75rem 2rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
  border: none;
}

.continue-shopping:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.loading i {
  margin-right: 0.75rem;
  color: #3498db;
}

.cart-summary-container {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

/* 按鈕樣式 */
.btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  border: none;
  border-radius: 6px;
  background: #3498db;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

/* 刪除按鈕 */
.text-gray-600 {
  padding: 0.75rem 1.5rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-bottom: 1rem;
}

.text-gray-600:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

/* 移除按鈕特製樣式 */
.remove-btn,
button[aria-label="移除商品"] {
  padding: 0.5rem 1rem;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  min-width: 80px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.remove-btn:hover,
button[aria-label="移除商品"]:hover {
  background: #ff6b81;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.2);
}

.remove-btn i,
button[aria-label="移除商品"] i {
  margin-right: 0.4rem;
  font-size: 0.9rem;
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
}

.back-link i {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .cart-view {
    padding: 1rem;
  }

  .cart-summary-container {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 1rem;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px 12px 0 0;
    margin-top: 1rem;
  }

  .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .cart-header h1 {
    font-size: 1.5rem;
  }
}
</style>
