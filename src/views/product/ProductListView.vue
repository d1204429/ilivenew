<template>
  <div class="product-list-view">
    <!-- 頁面標題區 -->
    <div class="page-header">
      <div class="header-content">
        <button class="back-btn" @click="goBack">
          <i class="fas fa-arrow-left"></i> 返回
        </button>
        <h1>商品列表</h1>
      </div>
      <div class="filter-controls">
        <!-- <BaseInput
            v-model="filters.keyword"
            placeholder="搜尋商品..."
            prefix-icon="fas fa-search"

        /> -->
        <!-- @input="handleSearch" -->
        <!-- <select v-model="filters.categoryId" @change="handleCategoryChange">
          <option value="">全部分類</option>
          <option
              v-for="category in categories"
              :key="category.categoryId"
              :value="category.categoryId"
          >
            {{ category.name }}
          </option>
        </select>
        <select v-model="filters.sortBy" @change="handleSort">
          <option value="">排序方式</option>
          <option value="price-asc">價格由低到高</option>
          <option value="price-desc">價格由高到低</option>
          <option value="newest">最新上架</option>
        </select> -->
      </div>
    </div>

    <!-- 商品列表區 -->
    <div class="products-container">
      <BaseLoading v-if="loading"/>

      <div v-else-if="products.length===0" class="no-products">
        <i class="fas fa-box-open"></i>
        <p>{{ noProductsMessage }}</p>
      </div>

      <div v-else class="products-grid">
        <div v-for="product in products"
             :key="product.productId">
          <ProductCard :product="product" />
        </div>
      </div>

      <!-- 分頁控制 -->
      <!-- <div class="pagination" v-if="pagination.totalPages > 1">
        <button
            class="page-btn"
            :disabled="pagination.currentPage === 1"
            @click="handlePageChange(pagination.currentPage - 1)"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <span class="page-info">
          {{ pagination.currentPage }} / {{ pagination.totalPages }}
        </span>

        <button
            class="page-btn"
            :disabled="pagination.currentPage === pagination.totalPages"
            @click="handlePageChange(pagination.currentPage + 1)"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div> -->
    </div>

    <!-- 錯誤提示 -->
    <BaseAlert
        v-if="error"
        :message="error"
        type="error"
        @close="error = null"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseLoading from '@/components/common/BaseLoading.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import {getProduct} from '@/services/products'
//import { debounce } from '@/utils/helpers'
//import { handleError } from '@/utils/errorHandler'

const store = useStore()
const router = useRouter()
const route = useRoute()
const categoryId = route.query.search;


// 狀態
const loading = ref(false)
const error = ref(null)
const products = ref([])
const categories = ref([])

// 過濾和分頁
const filters = reactive({
  keyword: '',
  categoryId: '',
  sortBy: '',
  minPrice: null,
  maxPrice: null
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 12,
  totalPages: 1,
  total: 0
})

// const filteredProducts = computed(() =>
// products.value.filter(product => product.parentCategoryId === categoryId)
// )
// 計算屬性
const noProductsMessage = computed(() => {
  if (filters.keyword) {
    return `沒有找到與 "${filters.keyword}" 相關的商品`
  }
  return '暫無商品'
})

// 方法
const transformProductData = (product) => {
  return {
    ...product,
    imageUrl: product.imageUrl?.split('/').pop(),
    price: product.promotionalPrice || product.price,
    originalPrice: product.originalPrice,
    stock: product.availableStock
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const data = await getProduct()
    products.value = data.filter(product => Number(product.parentCategoryId) === Number(categoryId))
    console.log(products.value)
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

// const handleSearch = debounce(() => {
//   pagination.currentPage = 1
//   fetchData()
// }, 500)

const handleCategoryChange = () => {
  pagination.currentPage = 1
  fetchData()
}

const handleSort = () => {
  fetchData()
}

const handlePageChange = (page) => {
  pagination.currentPage = page
  fetchData()
}

const handleAddToCart = async (product) => {
  //   try {
  //     await store.dispatch('cart/addToCart', {
  //       productId: product.productId,
  //       quantity: 1
  //     })
  //     store.dispatch('app/showNotification', {
  //       type: 'success',
  //       message: '已加入購物車'
  //     })
  //   } catch (err) {
  //     const errorMessage = handleError(err)
  //     store.dispatch('app/showNotification', {
  //       type: 'error',
  //       message: errorMessage || '加入購物車失敗'
  //     })
  //   }
}

const handleViewDetail = (productId) => {
  router.push(`/products/${productId}`)
}

const goBack = () => {
  router.back()
}

// 生命週期
onMounted(async() => {
  await fetchData()
})

</script>

<style scoped>
.product-list-view {
  padding: clamp(1rem, 4vw, 2rem);
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f5f5f5;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  background-color: #ffffff;
  color: #333;
  cursor: pointer;
  font-size: 0.95rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.back-btn:hover {
  background-color: #f0f0f0;
  transform: translateX(-2px);
}

.page-header {
  margin-bottom: 2.5rem;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.page-header h1 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: #ffffff;
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
}

.filter-controls select {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  min-width: 180px;
  background-color: white;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.filter-controls select:hover {
  border-color: #d0d0d0;
}

.filter-controls select:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: clamp(1rem, 3vw, 2rem);
  margin-bottom: 2rem;
}

.no-products {
  text-align: center;
  padding: clamp(2rem, 6vw, 4rem);
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.no-products i {
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: 1rem;
  color: #9ca3af;
}

.no-products p {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
}

.page-btn {
  padding: 0.75rem 1.25rem;
  border: none;
  background-color: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  color: #4a5568;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-btn:hover:not(:disabled) {
  background-color: #4a90e2;
  color: white;
  transform: translateY(-1px);
}

.page-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.page-info {
  font-size: 1rem;
  color: #4a5568;
  padding: 0.5rem 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .product-list-view {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-controls {
    flex-direction: column;
    padding: 1rem;
  }

  .filter-controls select {
    width: 100%;
    min-width: unset;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }

  .page-header {
    padding: 1rem;
  }

  .pagination {
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .page-btn {
    padding: 0.5rem 1rem;
  }
}
</style>
