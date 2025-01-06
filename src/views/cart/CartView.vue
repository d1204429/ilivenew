<template>
  <div class="cart-view">
    <!-- 購物車標題 -->
    <div class="cart-header">
      <h1>購物車</h1>
    </div>

    <!-- 購物車內容區 -->
    <div class="cart-container">
      <div  v-if="cartItems.length > 0">
          <button class="text-gray-600 hover:text-red-600"
          @click="deleteCart">
            清空購物車
          </button>
        </div>
      <!-- 購物車列表 -->
        <CartList :cart-items="cartItems"
        @remove-item="removeItem"/>

        <!-- 購物車摘要 -->
        <div class="cart-summary-container" v-if="cartItems.length > 0">
          <!-- <CartSummary
              :cart-items="cartItems"
              :total="calculateTotal"
              @checkout="proceedToCheckout"
          /> -->
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


const router = useRouter()
const store = useStore()
const loading = ref(true)
const cartItems = ref([])

// 計算總金額
const calculateTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

// 獲取購物車商品
const fetchCartItems = async () => {
  try {
    if(!store.state.accessToken){
      router.push('/login')
    }
    loading.value = true
    console.log(store.state.accessToken)
    const data = await getCartItems(store.state.accessToken)
    cartItems.value = data
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
        fetchCartItems()
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
        fetchCartItems()
      }
}

// 前往結帳
const proceedToCheckout = () => {
  router.push('/checkout')
}

onMounted(() => {
  fetchCartItems()
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
</style>
