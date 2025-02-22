<template>
  <div class="product-card" :class="{ 'out-of-stock': !product.availableStock }">
    <!-- 商品圖片區塊 - 可點擊 -->
    <div class="product-image-container cursor-pointer" @click="handleViewDetail">
      <img
          :src="getProductImageUrl"
          :alt="product.name"
          @error="handleImageError"
          @load="handleImageLoad"
          class="product-image"
          :class="{ 'loading': imageLoading }"
      >
      <div class="product-badges" v-if="showBadges">
        <span v-if="product.isNew" class="badge new">新品</span>
        <span v-if="product.isOnSale" class="badge sale">特價</span>
        <span v-if="product.discount" class="badge discount">
          {{ product.discount }}折
        </span>
      </div>
      <div v-if="imageLoading" class="image-skeleton"></div>
    </div>

    <!-- 商品內容區塊 -->
    <div class="product-content">
      <!-- 品牌資訊 - 不可點擊 -->
      <div class="product-meta">
        <span v-if="product.brand" class="brand">
          <i class="fas fa-tag"></i>
          {{ product.brand }}
        </span>
        <span v-if="product.categoryName" class="category">
          <i class="fas fa-folder"></i>
          {{ product.categoryName }}
        </span>
      </div>

      <!-- 可點擊區域 -->
      <div class="clickable-content cursor-pointer" @click="handleViewDetail">
        <h3 class="product-title" :title="product.name">
          {{ truncateText(product.name, 20) }}
        </h3>

        <div class="product-price" :class="{ 'has-discount': hasDiscount }">
          <span class="current-price">
            NT$ {{ formatPrice(product.promotionalPrice || product.price) }}
          </span>
          <span v-if="hasDiscount" class="original-price">
            NT$ {{ formatPrice(product.originalPrice) }}
          </span>
        </div>

        <p v-if="product.description" class="product-description">
          {{ truncateText(product.description, 50) }}
        </p>
      </div>

      <!-- 庫存和購物車按鈕區域 -->
      <div class="product-stock" :class="stockStatusClass">
        <i :class="stockStatusIcon"></i>
        {{ stockStatusText }}
      </div>

      <div class="product-actions">
        <BaseButton
            class="cart-btn"
            :disabled="!canAddToCart"
            @click="handleAddToCart"
            :loading="addingToCart"
        >
          <i class="fas fa-cart-plus"></i>
          {{ cartButtonText }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import BaseButton from '@/components/common/BaseButton.vue'
import {addCart} from '@/services/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
    const store = useStore()
    const imageLoading = ref(true)
    const addingToCart = ref(false)
    const imageError = ref(false)

    // 計算屬性
    const getProductImageUrl = computed(() => {
      if (imageError.value || !props.product.imageUrl) {
        return
      }
      const imageUrl = props.product.imageUrl
      return imageUrl.replace('/image/', '/static/image/')
    })

    const showBadges = computed(() =>
        props.product.isNew ||
        props.product.isOnSale ||
        props.product.discount
    )

    const hasDiscount = computed(() =>
        props.product.promotionalPrice < props.product.originalPrice
    )

    const stockStatusClass = computed(() => ({
      'in-stock': props.product.availableStock > 10,
      'low-stock': props.product.availableStock > 0 && props.product.availableStock <= 10,
      'out-of-stock': !props.product.availableStock
    }))

    const stockStatusIcon = computed(() => {
      if (!props.product.availableStock) return 'fas fa-times-circle'
      if (props.product.availableStock <= 10) return 'fas fa-exclamation-circle'
      return 'fas fa-check-circle'
    })

    const stockStatusText = computed(() => {
      if (!props.product.availableStock) return '已售完'
      if (props.product.availableStock <= 10) return `剩餘 ${props.product.availableStock} 件`
      return '現貨充足'
    })

    const cartButtonText = computed(() => {
      if (addingToCart.value) return '處理中...'
      if (!props.product.availableStock) return '已售完'
      return '加入購物車'
    })

    const canAddToCart = computed(() =>
        props.product.availableStock > 0 && !addingToCart.value
    )

    // 方法
    const formatPrice = (price) => {
      if (!price) return '0'
      return new Intl.NumberFormat('zh-TW', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price)
    }

    const truncateText = (text, length) => {
      if (!text) return ''
      return text.length > length ? `${text.substring(0, length)}...` : text
    }

    const handleImageLoad = () => {
      imageLoading.value = false
    }

    const handleImageError = (event) => {
      console.error('Image load failed:', event)
      imageError.value = true
      imageLoading.value = false
    }

    const handleAddToCart = async () => {
      if (!canAddToCart.value) return
      addingToCart.value = true
      try{
        if (!localStorage.getItem('accessToken')) {
          router.push('/login')
          return
        }
        const response = await addCart(props.product.productId, 1, localStorage.getItem('accessToken'))
        if (response) {
          alert('已加入購物車')
        } else {
          alert(error.message || '加入購物車失敗')
        }
      }catch (error) {
        alert(error.message || '加入購物車失敗')
      }finally {
        addingToCart.value = false
      }
    }
    
    const handleViewDetail = () => {
      router.push({
        name: 'ProductDetail',
        params: { id: props.product.productId }
      })
    }
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.clickable-content {
  transition: opacity 0.2s;
}

.clickable-content:hover {
  opacity: 0.8;
}

.product-card {
  position: relative;
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-image.loading {
  opacity: 0;
}

.image-skeleton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.product-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

.badge.new {
  background-color: var(--primary-color);
}

.badge.sale {
  background-color: var(--danger-color);
}

.badge.discount {
  background-color: var(--warning-color);
}

.product-content {
  padding: 1rem;
}

.product-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.product-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.product-meta i {
  margin-right: 4px;
}

.product-price {
  margin-bottom: 0.5rem;
}

.current-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.original-price {
  font-size: 0.9rem;
  text-decoration: line-through;
  color: var(--text-muted);
  margin-left: 0.5rem;
}

.product-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.product-stock {
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.product-stock i {
  margin-right: 4px;
}

.product-stock.in-stock {
  color: var(--success-color);
}

.product-stock.low-stock {
  color: var(--warning-color);
}

.product-stock.out-of-stock {
  color: var(--danger-color);
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

.product-actions button {
  flex: 1;
  min-height: 36px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 768px) {
  .product-card {
    font-size: 0.9rem;
  }

  .product-title {
    font-size: 1rem;
  }

  .current-price {
    font-size: 1.1rem;
  }

  .product-actions {
    flex-direction: column;
  }
}
</style>
