<template>
  <div class="cart-summary">
    <!-- 購物車標題 -->
    <div class="summary-header">
      <h2>購物車摘要</h2>
      <span class="item-count">{{ totalItems }} 件商品</span>
    </div>

    <!-- 價格明細 -->
    <div class="price-details">
      <div class="price-row">
        <span>商品總額</span>
        <span>${{ formatPrice(subtotal) }}</span>
      </div>

      <!-- 運費計算 -->
      <div class="shipping-section">
        <div class="price-row">
          <span>運費</span>
          <span v-if="shipping === 0">免運費</span>
          <span v-else>${{ formatPrice(shipping) }}</span>
        </div>
        <div class="shipping-note" v-if="remainingForFreeShipping > 0">
          再購買 ${{ formatPrice(remainingForFreeShipping) }} 即可享免運優惠
        </div>
      </div>
      
      <!-- 總計金額 -->
      <div class="total-section">
        <div class="price-row total">
          <span>總計</span>
          <span>${{ formatPrice(total) }}</span>
        </div>
      </div>
    </div>

    <!-- 結帳按鈕 -->
    <div class="checkout-actions">
      <button
          class="checkout-button"
          @click="proceedToCheckout"
          :disabled="totalItems === 0"
      >
        前往結帳
      </button>
      <button
          class="continue-shopping"
          @click="continueShopping"
      >
        繼續購物
      </button>
    </div>

    <!-- 付款方式提示 -->
    <!-- <div class="payment-methods">
      <h3>付款方式</h3>
      <div class="payment-icons">
        <i class="fab fa-cc-visa"></i>
        <i class="fab fa-cc-mastercard"></i>
        <i class="fab fa-cc-jcb"></i>
        <i class="fab fa-apple-pay"></i>
        <i class="fab fa-google-pay"></i>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { useRouter } from 'vue-router'

// 接收 props
const props = defineProps({
  cartItems: {
    type: Array,
    required: true,
    default: () => []
  },
  prodItems:{
    type: Array,
    required: true,
    default: () => []
  }
});

const router = useRouter()

// 計算屬性
const totalItems = computed(() => 
props.cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0))

const subtotal= computed(() =>{
  let total = 0
  for (const item of props.cartItems) {
    const product = props.prodItems.find(prod => prod.productId === item.productId)
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

const shipping = computed(() => {
  return subtotal.value >= 1000 ? 0 : 60
})

const total = computed(() => {
  return subtotal.value + shipping.value
})

const remainingForFreeShipping = computed(() => {
  return subtotal.value >= 1000 ? 0 : 1000 - subtotal.value
})

// 方法
const formatPrice = (price) => {
  return price?.toLocaleString('zh-TW') || '0'
}

const proceedToCheckout = () => {
  router.push('/checkout')
}

const continueShopping = () => {
  router.push('/products')
}
</script>

<style scoped>
.cart-summary {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.summary-header h2 {
  font-size: 1.5rem;
  margin: 0;
}

.item-count {
  color: #666;
}

.price-details {
  margin-bottom: 1.5rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.discount {
  color: #e53935;
}

.shipping-section {
  padding: 1rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.shipping-note {
  font-size: 0.9rem;
  color: #2196f3;
  margin-top: 0.5rem;
}

.coupon-section {
  margin: 1rem 0;
}

.coupon-input {
  display: flex;
  gap: 0.5rem;
}

.coupon-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.coupon-input button {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.coupon-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.coupon-message {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #4caf50;
}

.total-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.total {
  font-size: 1.2rem;
  font-weight: bold;
}

.checkout-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.checkout-button,
.continue-shopping {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-button {
  background: var(--primary-color);
  color: white;
}

.checkout-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.continue-shopping {
  background: white;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.payment-methods {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.payment-methods h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.payment-icons {
  display: flex;
  gap: 1rem;
  color: #666;
}

.payment-icons i {
  font-size: 2rem;
}

@media (max-width: 768px) {
  .cart-summary {
    margin: 1rem;
  }
}
</style>
