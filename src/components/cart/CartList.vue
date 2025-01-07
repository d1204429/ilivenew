<template>
  <div class="cart-list">
    <div v-for="(item, index) in cartItems" >
      <div class="cart-row">
        <!-- 第一欄：圖片 -->
         <div >
          <img :src="getImageUrl(prodItems[index].imageUrl)"
          :alt="item.name" >
        </div>
        <!-- 第二欄：品名 -->
         <div >
          <h5 class="font-bold">{{ prodItems[index].name }}</h5>
        </div>
        <!-- 第三欄：價格 -->
         <div >
          <div class="text-red-600 text-xl">
            ${{ getPrice(prodItems[index].promotionalPrice, prodItems[index].originalPrice) }}
          </div>
        </div>
        <!-- 第四欄：數量調整 -->
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

img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  transition: transform 0.3s ease;
}

</style>
