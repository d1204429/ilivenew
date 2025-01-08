<template>
  <section class="hot-products-section">
    <div class="section-header">
      <h2>熱門商品優惠</h2>
      <div class="carousel-controls">
        <button class="control-button" @click="prevSlide">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="control-button" @click="nextSlide">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
    
    <div 
      class="carousel-container"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd" 
    >
      <div 
        class="carousel-track"
        :style="{ 
          transform: `translateX(-${currentSlide * 100}%)`
        }"
      >
        <div 
          v-for="slideIndex in totalSlides" 
          :key="slideIndex"
          class="carousel-slide"
        >
          <div class="products-grid">
            <div
              v-for="product in getProductsForSlide(slideIndex - 1)"
              :key="product.productId"
              class="product-promotion-card"
            >
              <ProductCard :product="product" />
              <div class="promotion-tag">
                特惠價格
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineProps } from 'vue'
import ProductCard from '@/components/product/ProductCard.vue'

// 接收 props
const props = defineProps({
  productPromotions: {
    type: Array,
    required: true,
    default: () => []
  }
});

const currentSlide = ref(0)
const touchStart = ref(0)
const touchEnd = ref(0)
const productsPerSlide = 4

const totalSlides = computed(() => 
  Math.ceil(props.productPromotions.length / productsPerSlide)
)

const getProductsForSlide = (slideIndex) => {
  const start = slideIndex * productsPerSlide
  return props.productPromotions.slice(start, start + productsPerSlide)
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides.value
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + totalSlides.value) % totalSlides.value
}

const handleTouchStart = (e) => {
  touchStart.value = e.touches[0].clientX
}

const handleTouchMove = (e) => {
  touchEnd.value = e.touches[0].clientX
}

const handleTouchEnd = () => {
  if (touchStart.value - touchEnd.value > 100) {
    nextSlide()
  }
  if (touchStart.value - touchEnd.value < -100) {
    prevSlide()
  }
}

// 自動輪播
let autoplayInterval
onMounted(() => {
  autoplayInterval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  clearInterval(autoplayInterval)
})
</script>

<style scoped>
.hot-products-section {
  margin: 2rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.carousel-controls {
  display: flex;
  gap: 0.5rem;
}

.control-button {
  padding: 0.5rem;
  border-radius: 50%;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.control-button:hover {
  background: #e5e7eb;
}

.carousel-container {
  position: relative;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  flex-shrink: 0;
  width: 100%;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 0 1rem;
}

.product-promotion-card {
  position: relative;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.promotion-tag {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #ef4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: bold;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>