<template>
  <div class="cart-view">
    <!-- 購物車標題 -->

    <div class="cart-header">
      <h1>購物車</h1><div class="back-link">
      <a @click="handleBack">
        <i class="fas fa-arrow-left"></i> 返回
      </a>
    </div>

    </div>

    <!-- 購物車內容區 -->
    <div class="cart-container">
      <div  v-if="cartItems.length > 0">
        <button class="text-gray-600 hover:text-red-600"
        @click="deleteCart">清空購物車</button>
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
      // 獲取所有商品資訊
      const response = await getProductInfo()
      // 根據購物車項目過濾相關商品
      prodItems.value = response.filter(product =>
          cartItems.value.some(cartItem => cartItem.productId === product.productId)
      )
    }
  } catch (error) {
    console.error('獲取商品資訊失敗:', error)
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
const handleBack = () => {
  if (window.history.length > 2) {
    router.go(-1)
  } else {
    router.push('/')
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

onMounted(() => {
  initData()
})
</script>

<style scoped>
.cart-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.cart-header {
  margin-bottom: 2rem;
}

.cart-header h1 {
  font-size: 2rem;
  color: var(--primary-color);
}

.cart-container {
  background: lightgray;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-cart {
  text-align: center;
  padding: 3rem;
}

.empty-cart i {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.continue-shopping {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.loading i {
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
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  }
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
