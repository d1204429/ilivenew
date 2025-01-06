<template>
  <div class="cart-list">
    <div v-if="!loading && cartItems.length > 0"
         v-for="(item, index) in cartItems" >
      <div class="cart-row">
        <!-- 第一欄：圖片 -->
         <div >
          <img :src="getImageUrl(prodItems[index].imageUrl)"
          :alt="item.name" >
        </div>
        <!-- 第二欄：品名 -->
         <div >
          <h3 class="font-bold">{{ prodItems[index].name }}</h3>
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
    <!-- 空購物車提示 -->
     <div v-else-if="!loading && cartItems.length == 0" class="empty-cart">
      <i class="fas fa-shopping-cart"></i>
      <p>您的購物車是空的</p>
      <!-- <router-link to="/products" class="continue-shopping">
        繼續購物
      </router-link> -->
    </div>
    <!-- 載入中提示 -->
     <div v-else class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      載入中...
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch  } from 'vue';
import { useStore } from 'vuex'
import {getProductInfo} from '@/services/products';
import {putCartQty} from '@/services/cart'

// 接收 props
const props = defineProps({
  cartItems: {
    type: Array,
    required: true,
  },
});

// 購物車商品數據
const loading = ref(false)
const error = ref(null)
const prodItems = ref([])
const store = useStore()

// 定義可發送的事件
const emit = defineEmits(['remove-item']);

// 獲取購物車商品
    const fetchProdItems = async () => {
      try {
        
        loading.value = true
        //console.log(props.cartItems)
        if(props.cartItems && props.cartItems.length > 0){
          const promises = props.cartItems.map(item => getProductInfo(item.productId))
          const results = await Promise.all(promises)
          prodItems.value = results
        }
      } catch (error) {
        console.error('獲取購物車失敗:', error)
      } finally {
        loading.value = false
      }
    }

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

watch(
  () => props.cartItems,
  () => {
    fetchProdItems();
  }
);
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
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
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

</style>
