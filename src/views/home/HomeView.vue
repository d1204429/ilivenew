<template>
  <div class="home-view">
    <!-- 輪播圖部分 -->
    <div class="carousel">
      <button class="carousel-control left" @click="prevSlide">
        <i class="fas fa-chevron-left"></i>
      </button>
      <div class="carousel-inner2" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="(slide, index) in carouselSlides"
             :key="index"
             class="carousel-slide"
             :class="{ 'cursor-pointer': slide.link }"
             @click="handleSlideClick(slide)">
          <img :src="slide.image" :alt="slide.caption">
          <div class="carousel-caption">{{ slide.caption }}</div>
        </div>
      </div>
      <button class="carousel-control right" @click="nextSlide">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- 搜尋結果區域 -->
    <section v-if="isTypeSearch" >
      <h2>搜尋結果</h2>
      <div v-if="isSearching" class="loading">
        搜尋中...
      </div>
      <div v-else-if="searchResults.length === 0" class="no-results">
        沒有找到相關商品
      </div>
      <div v-else class="products-grid">
        <div v-for="product in searchResults" 
             :key="product.productId" 
             class="product-card">
          <ProductCard :product="product" />
        </div>
      </div>
    </section>

    <template v-else>
      <!-- 促銷活動區域 -->
    <section class="promotions-section">
      <h2>當前促銷活動</h2>
      <div class="promotions-grid">
        <div v-for="promotion in activePromotions"
             :key="promotion.promotionId"
             class="promotion-card">
          <div class="promotion-content">
            <h3>{{ promotion.title }}</h3>
            <p class="promotion-description">{{ promotion.description }}</p>
            <div class="promotion-details">
              <span class="discount-badge" :class="promotion.discountType.toLowerCase()">
                {{ formatDiscount(promotion.discountType, promotion.discountValue) }}
              </span>
              <div class="promotion-period">
                <p>活動期間：</p>
                <p>{{ formatDate(promotion.startDate) }} - {{ formatDate(promotion.endDate) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 熱門商品區域 -->
    <!-- <section class="hot-products-section">
      <h2>熱門商品優惠</h2>
      <div class="products-grid">
        <div v-for="product in productPromotions"
             :key="product.productId"
             class="product-promotion-card">
          <ProductCard
              :product="product"
              
          /> -->
          <!-- :promotional-price="product.promotionalPrice" -->
          <!-- <div class="promotion-tag">
            特惠價格
          </div>
        </div>
      </div>
    </section> -->
    <PromotionProductCarousel :product-promotions="productPromotions"/>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getPromotions } from '@/services/promotion'
import { getPromotionProduct, getProductInfo } from '@/services/products'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ProductCard from '@/components/product/ProductCard.vue'
import PromotionProductCarousel from '@/components/carousel/PromotionProductCarousel.vue'

//const router = useRouter()
const store = useStore()
const isSearching = computed(() => store.state.isSearching)
const searchResults = computed(() => store.state.searchResults)
const isTypeSearch = computed(()=> store.state.isTypeSearch)
const router = useRouter()

//初始get promotionData
onMounted(() => {
  getPromotionsData()
})

// 輪播圖相關
const currentSlide = ref(0)
const carouselSlides = ref([
  {
    image: '/src/assets/carousel/ilive1.webp',
    caption: '全館免運',
    link: null
  },
  {
    image: '/src/assets/carousel/ilive2.webp',
    caption: '限時特惠',
    link: null
  },
  {
    image: '/src/assets/carousel/login.webp',
    caption: '立即登入',
    link: '/login'  // 添加登入頁面路由
  }
])

// 處理輪播圖點擊
const handleSlideClick = (slide) => {
  if (slide.link) {
    router.push(slide.link)
  }
}

// 輪播控制
const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + carouselSlides.value.length) % carouselSlides.value.length
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselSlides.value.length
}

//促銷活動
const activePromotions = ref([])
// 商品
const productPromotions = ref([])
const promotion = ref([])
// 獲取促銷活動和商品資料
const getPromotionsData = async () => {
  try {
    activePromotions.value = await getPromotions()
    promotion.value = await getPromotionProduct() 
    await getpromtProdInfo()
    //productPromotions.value = await getPromotionProduct()
  } catch (error) {
    console.error('獲取促銷資料失敗:', error)
  }
}

const getpromtProdInfo= async() =>{
  if(promotion.value){
    const promises = promotion.value.map(item => getProductInfo(item.productId))
    const results = await Promise.all(promises)
    productPromotions.value = results
  }
}

// 格式化日期
const formatDate = (dateString) => {
return new Date(dateString).toLocaleDateString('zh-TW')
}

// 格式化折扣顯示
const formatDiscount = (type, value) => {
  return type === 'PERCENTAGE' ? `${value}% OFF` : `$${value} 折扣`
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.home-view {
  padding: 0rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 輪播圖樣式 */
.carousel {
  position: relative;
  margin: 0 calc(-50vw + 50%);
  width: 100vw;
  overflow: hidden;
}

.carousel-inner2 {
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 100%;
}

.carousel-slide {
  min-width: 100%;
  position: relative;
  flex-shrink: 0;
  height: auto;
}

.carousel-slide img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.carousel-caption {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  z-index: 10;
}

.carousel-control.left {
  left: 10px;
}

.carousel-control.right {
  right: 10px;
}

.carousel-control:hover {
  background: rgba(0, 0, 0, 0.7);
}

/* 促銷活動區域樣式 */
.promotions-section {
  margin: 2rem 0;
  padding: 1rem;
}

.promotions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.promotion-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
}

.promotion-card:hover {
  transform: translateY(-4px);
}

.promotion-content {
  padding: 1.5rem;
}

.promotion-description {
  color: #666;
  margin: 0.5rem 0;
}

.promotion-details {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.discount-badge {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  color: white;
}

.discount-badge.percentage {
  background-color: #ff4757;
}

.discount-badge.fixed_amount {
  background-color: #2ed573;
}

.promotion-period {
  font-size: 0.9rem;
  color: #777;
}

/* 熱門商品區域樣式 */
.hot-products-section {
  margin: 2rem 0;
  padding: 1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.product-promotion-card {
  position: relative;
}

.promotion-tag {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #ff4757;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
  z-index: 1;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .carousel-slide img {
    height: 300px;
  }

  .promotions-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .promotion-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .carousel-slide img {
    height: 200px;
  }

  .carousel-caption {
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .promotion-card {
    margin: 0 0.5rem;
  }
}
</style>