<template>
  <footer class="footer">
    <div class="container">
      <div class="row align-items-center py-2">
        <!-- Links Section -->
        <div class="col-12 col-md-4 mb-2 mb-md-0">
          <div class="d-flex justify-content-center justify-content-md-start gap-3">
            <router-link to="/about" class="footer-link">關於我們</router-link>
            <router-link to="/contact" class="footer-link">聯絡我們</router-link>
          </div>
        </div>

        <!-- Copyright Section -->
        <div class="col-12 col-md-4 mb-2 mb-md-0">
          <div class="text-center">
            <small class="copyright-text">Copyright © {{ currentYear }} FCU. All rights reserved.</small>
          </div>
        </div>

        <!-- Social Media Section -->
        <div class="col-12 col-md-4">
          <div class="d-flex justify-content-center justify-content-md-end gap-2">
            <a href="https://www.facebook.com"
               target="_blank"
               rel="noopener noreferrer"
               class="social-link">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com"
               target="_blank"
               rel="noopener noreferrer"
               class="social-link">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="https://line.me"
               target="_blank"
               rel="noopener noreferrer"
               class="social-link">
              <i class="fab fa-line"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background-color: #FFD466;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1030;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
}

.footer-link {
  color: #000;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  padding: 0.3rem 0;
  margin: 0 3px;
  white-space: nowrap;
}

.footer-link:hover {
  color: #333;
  transform: translateY(-2px) scale(1.05);
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #333;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.footer-link:hover::after {
  width: 100%;
}

.social-link {
  color: #000;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.social-link:hover {
  color: #333;
  transform: translateY(-2px) rotate(5deg);
}

.social-link i {
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.social-link:hover i {
  transform: scale(1.1);
}

.copyright-text {
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.2;
  white-space: nowrap;
}

.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

@media (max-width: 767.98px) {
  .footer {
    padding: 0.75rem 0;
    height: auto;
  }

  .row {
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer-link {
    font-size: 0.8rem;
    padding: 0.2rem 0;
  }

  .social-link {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }

  .copyright-text {
    font-size: 0.75rem;
  }

  .col-12 {
    width: 100%;
    text-align: center;
  }

  .d-flex {
    justify-content: center !important;
  }

  .mb-2 {
    margin-bottom: 0.3rem !important;
  }
}

@media (max-width: 575.98px) {
  .footer {
    padding: 0.5rem 0;
  }

  .social-link {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }

  .py-2 {
    padding-top: 0.3rem !important;
    padding-bottom: 0.3rem !important;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.footer {
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 新增滑動淡入淡出動畫 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* 新增持續動畫效果 */
.footer {
  animation: footerFloat 3s ease-in-out infinite;
}

@keyframes footerFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 社交媒體圖標的動畫效果增強 */
.social-link {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* 連結動畫效果增強 */
.footer-link {
  animation: fadeInOut 3s ease-in-out infinite;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}
</style>
