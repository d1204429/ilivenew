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
            <p>407台中市西屯區文華路100號</p>
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

<script setup>
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
  padding: 2rem;
  background: linear-gradient(-45deg, #fff3e0, #ffe0b2, #ffecb3, #fff8e1);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  min-height: 100vh;
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

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  color: #2c3e50;
  font-size: 1.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  position: relative;
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
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.card-item:hover {
  transform: translateY(-5px);
  border-color: #3498db;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.card-item:hover .icon-wrapper {
  background: #3498db;
}

.card-item:hover .icon-wrapper i {
  color: #ffffff;
  transform: scale(1.1);
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.icon-wrapper i {
  font-size: 1.5rem;
  color: #3498db;
  transition: all 0.3s ease;
}

.info {
  flex: 1;
}

.info h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.info p {
  color: #34495e;
  margin-bottom: 0.3rem;
  font-size: 1.1rem;
}

.info small {
  color: #7f8c8d;
  font-size: 0.9rem;
  display: block;
  margin-top: 0.5rem;
}

.back-link {
  margin-bottom: 1.5rem;
}

.back-link a {
  display: inline-flex;
  align-items: center;
  color: #34495e;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.back-link a:hover {
  background: #e9ecef;
  color: #2c3e50;
  transform: translateX(-5px);
}

.back-link i {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .contact-container {
    padding: 1rem;
  }

  .contact-card {
    grid-template-columns: 1fr;
  }

  .card-item {
    padding: 1.5rem;
  }

  .icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .icon-wrapper i {
    font-size: 1.2rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .info h3 {
    font-size: 1.2rem;
  }

  .info p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .contact-container {
    padding: 1rem;
  }

  .card-item {
    padding: 1.2rem;
    flex-direction: column;
    text-align: center;
  }

  .icon-wrapper {
    margin-bottom: 1rem;
  }
}
</style>
