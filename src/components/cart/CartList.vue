<template>
  <div class="cart-list">
    <div class="product-list">
      <div v-for="(item, index) in cartItems" class="product-item">
        <img :src="getImageUrl(prodItems[index].imageUrl)"
          :alt="item.name" >
        <div class="product-info">
          <h3>{{ prodItems[index].name }}</h3>
          <p>${{ getPrice(prodItems[index].promotionalPrice, prodItems[index].originalPrice) }}</p>
        </div>
        <div >
          <button @click="updateQuantity(index, -1)" 
          class="px-2 py-1 border rounded hover:bg-gray-100"
          :disabled="loading || item.quantity<=1">-</button>
          <span class="px-4">{{ item.quantity }}</span>
          <button @click="updateQuantity(index, 1)" 
          class="px-2 py-1 border rounded hover:bg-gray-100"
          :disabled="loading || item.quantity>=10">+</button>
        </div>
        <!-- 第五欄：移除按鈕 -->
         <div >
          <button class="text-gray-600 hover:text-red-600"
          @click="removeItem(index)">
            移除
          </button>
        </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch  } from 'vue';
import { useStore } from 'vuex'
import { putCartQty } from '@/services/cart'

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

// 購物車商品數據
const loading = ref(false)
const error = ref(null)
//const prodItems = ref([])
const store = useStore()

// 定義可發送的事件
const emit = defineEmits(['remove-item']);

// 圖片處理方法
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 
  }
  return imagePath.replace('/image/', '/static/image/')
}

const getPrice = (promt, origin) => {
  if(promt<origin){
    return promt;
  }
  return origin;
}

const updateQuantity=(index, qty) => {
  //console.log(props.cartItems[index])
  putCartItemQty(index, props.cartItems[index].cartItemId,
    props.cartItems[index].productId,
    props.cartItems[index].quantity + qty
  )
}

const putCartItemQty = async (index ,cartItemId, productId, quantity) => {
      const response = await putCartQty(cartItemId, productId, quantity, store.state.accessToken)
      if (!response) {
        alert(error.message || '更新購物車數量失敗')
      }else{
         props.cartItems[index].quantity = quantity
      }
    }

const removeItem = (index) => {
  emit('remove-item',  props.cartItems[index].cartItemId); // 通知父組件移除項目
};

</script>

<style scoped>
.cart-list{
  background:white;
  margin: 5px 0px;
}

.cart-row{
  display:flex;
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

.product-list {
  display: grid;
  gap: 1.5rem;
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

</style>
