<template>
  <div class="about-container">
    <div class="back-link">
      <a @click="handleBack">
        <i class="fas fa-arrow-left"></i> 返回
      </a>
    </div>

    <h1 class="page-title">關於我們</h1>

    <section class="company-intro">
      <h2>公司簡介</h2>
      <p>iLive 是您值得信賴的電器用品購物平台，致力於提供優質的家電產品和卓越的購物體驗。全年全日所有商品皆享免運優惠，讓您輕鬆購物無負擔。</p>
    </section>

    <section class="company-value">
      <h2>我們的價值</h2>
      <div class="value-cards">
        <div class="value-card">
          <i class="fas fa-check-circle"></i>
          <h3>品質保證</h3>
          <p>嚴選優質商品，確保每件產品都符合高標準</p>
        </div>
        <div class="value-card">
          <i class="fas fa-truck"></i>
          <h3>全館免運</h3>
          <p>所有商品全年全日免運費，讓您安心購物</p>
        </div>
        <div class="value-card">
          <i class="fas fa-headset"></i>
          <h3>專業服務</h3>
          <p>貼心的客戶服務，解決您的所有疑問</p>
        </div>
        <div class="value-card">
          <i class="fas fa-shipping-fast"></i>
          <h3>快速配送</h3>
          <p>專業物流團隊，讓您購物無需久候</p>
        </div>
      </div>
    </section>

    <section class="company-history">
      <h2>發展歷程</h2>
      <div class="timeline">
        <div class="timeline-item">
          <div class="year">2020</div>
          <div class="content">公司成立</div>
        </div>
        <div class="timeline-item">
          <div class="year">2021</div>
          <div class="content">線上平台上線</div>
        </div>
        <div class="timeline-item">
          <div class="year">2022</div>
          <div class="content">擴展商品類別</div>
        </div>
        <div class="timeline-item">
          <div class="year">2023</div>
          <div class="content">會員數突破10萬，推出全年免運服務</div>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  try {
    if (window.history.state?.back) {
      router.go(-1)
    } else {
      router.push('/')
    }
  } catch (error) {
    router.push('/')
  }
}
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #ffd700, #ffeda0, #ffa500);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Wave animation */
.about-container::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 40%;
  animation: wave 15s infinite linear;
  z-index: 1;
}

.about-container::after {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 35%;
  animation: wave 15s infinite linear;
  animation-delay: -5s;
  z-index: 1;
}

@keyframes wave {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Content styles with flat design */
.page-title {
  text-align: center;
  margin-bottom: 3rem;
  color: #2c3e50;
  font-weight: 700;
  position: relative;
  z-index: 2;
}

section {
  margin-bottom: 4rem;
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

section:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.value-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.value-card {
  text-align: center;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.value-card:hover {
  transform: translateY(-5px);
  border-color: #ffd700;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.value-card i {
  font-size: 2.5rem;
  color: #ffd700;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.value-card:hover i {
  transform: scale(1.1);
}

.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
}

.timeline-item {
  display: flex;
  margin-bottom: 2rem;
  gap: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.timeline-item:hover {
  transform: translateX(10px);
}

.year {
  font-weight: bold;
  color: #ffd700;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2c3e50;
  padding: 0.5rem;
  border-radius: 6px;
}

.content {
  flex: 1;
  padding: 0.5rem;
}

.back-link {
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
}

.back-link a {
  display: inline-flex;
  align-items: center;
  color: #2c3e50;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-link a:hover {
  color: #ffd700;
  background: #2c3e50;
  transform: translateX(-5px);
}

.back-link i {
  margin-right: 0.5rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .value-cards {
    grid-template-columns: 1fr;
  }

  .value-card {
    margin-bottom: 1rem;
  }

  .timeline-item {
    flex-direction: column;
    gap: 1rem;
  }

  .year {
    width: 100%;
  }
}

/* Typography */
h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.5rem;
}

h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: #ffd700;
  border-radius: 3px;
}

h3 {
  color: #2c3e50;
  margin: 1rem 0;
  font-weight: 500;
}

p {
  color: #34495e;
  line-height: 1.6;
}
</style>
