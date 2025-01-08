<template>
  <div class="contact-container">
    <div class="back-link">
      <a @click="handleBack">
        <i class="fas fa-arrow-left"></i> 返回
      </a>
    </div>

    <h1 class="page-title">聯絡我們</h1>

    <div class="contact-content">
      <div class="contact-card">
        <div class="card-item">
          <div class="icon-wrapper">
            <i class="fas fa-phone-alt"></i>
          </div>
          <div class="info">
            <h3>電話諮詢</h3>
            <p>0800-888-888</p>
            <small>週一至週五 9:00-18:00</small>
          </div>
        </div>

        <div class="card-item">
          <div class="icon-wrapper">
            <i class="fas fa-envelope"></i>
          </div>
          <div class="info">
            <h3>電子郵件</h3>
            <p>service@ilive.com</p>
            <small>我們將在24小時內回覆</small>
          </div>
        </div>

        <div class="card-item">
          <div class="icon-wrapper">
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <div class="info">
            <h3>營業據點</h3>
            <p>台北市信義區信義路五段7號</p>
            <small>歡迎預約參觀</small>
          </div>
        </div>

        <div class="card-item">
          <div class="icon-wrapper">
            <i class="fas fa-comments"></i>
          </div>
          <div class="info">
            <h3>線上客服</h3>
            <p>即時對話服務</p>
            <small>點擊開始對話</small>
          </div>
        </div>
      </div>
    </div>
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
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem;
}

.page-title {
  text-align: center;
  margin-bottom: 4rem;
  color: #2c3e50;
  font-size: 2.5rem;
}

.contact-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

.contact-card {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 900px;
}

.card-item {
  background: #ffffff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s ease;
}

.card-item:hover {
  transform: translateY(-5px);
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper i {
  font-size: 1.5rem;
  color: #3498db;
}

.info h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.info p {
  color: #34495e;
  margin-bottom: 0.3rem;
}

.info small {
  color: #7f8c8d;
}

.back-link {
  margin-bottom: 1rem;
}

.back-link a {
  display: inline-flex;
  align-items: center;
  color: #666;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;
}

.back-link a:hover {
  color: #4299e1;
}

.back-link i {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .contact-card {
    grid-template-columns: 1fr;
  }

  .card-item {
    padding: 1.5rem;
  }
}
</style>
