<template>
  <button
      :class="buttonClasses"
      :type="htmlType"
      :disabled="disabled || loading"
      @click="handleClick"
  >
    <!-- 載入動畫 -->
    <span v-if="loading" class="button-loading">
      <i class="fas fa-spinner fa-spin"></i>
    </span>

    <!-- 左側圖標 -->
    <i v-if="leftIcon && !loading" :class="['button-icon', leftIcon]"></i>

    <!-- 按鈕內容 -->
    <span class="button-content" :class="{ 'hidden': loading }">
      <slot></slot>
    </span>

    <!-- 右側圖標 -->
    <i v-if="rightIcon && !loading" :class="['button-icon', rightIcon]"></i>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',

  props: {
    // HTML 按鈕類型
    htmlType: {
      type: String,
      default: 'button',
      validator: value => ['button', 'submit', 'reset'].includes(value)
    },

    // 按鈕樣式類型
    variant: {
      type: String,
      default: 'primary',
      validator: value => [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
        'link',
        'outline'
      ].includes(value)
    },

    // 按鈕尺寸
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },

    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },

    // 是否顯示載入狀態
    loading: {
      type: Boolean,
      default: false
    },

    // 左側圖標
    leftIcon: {
      type: String,
      default: ''
    },

    // 右側圖標
    rightIcon: {
      type: String,
      default: ''
    },

    // 是否為塊級元素
    block: {
      type: Boolean,
      default: false
    },

    // 是否為輪廓按鈕
    outline: {
      type: Boolean,
      default: false
    },

    // 是否為圓角按鈕
    rounded: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    buttonClasses() {
      return [
        'base-button',
        `base-button--${this.variant}`,
        `base-button--${this.size}`,
        {
          'base-button--block': this.block,
          'base-button--disabled': this.disabled || this.loading,
          'base-button--outline': this.outline,
          'base-button--rounded': this.rounded,
          'base-button--loading': this.loading
        }
      ]
    }
  },

  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
  cursor: pointer;
  position: relative;
  outline: none;
  white-space: nowrap;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 尺寸變體 */
.base-button--small {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.base-button--medium {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.base-button--large {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

/* 主題變體 */
.base-button--primary {
  background-color: #4299e1;
  color: #ffffff;
}

.base-button--secondary {
  background-color: #718096;
  color: #ffffff;
}

.base-button--success {
  background-color: #48bb78;
  color: #ffffff;
}

.base-button--danger {
  background-color: #f56565;
  color: #ffffff;
}

.base-button--warning {
  background-color: #ecc94b;
  color: #000000;
}

.base-button--info {
  background-color: #4fd1c5;
  color: #ffffff;
}

.base-button--light {
  background-color: #f7fafc;
  color: #1a202c;
}

.base-button--dark {
  background-color: #2d3748;
  color: #ffffff;
}

.base-button--link {
  background-color: transparent;
  color: #4299e1;
  box-shadow: none;
}

/* 輪廓按鈕 */
.base-button--outline {
  background-color: transparent;
  box-shadow: none;
}

.base-button--outline.base-button--primary {
  color: #4299e1;
  box-shadow: inset 0 0 0 2px #4299e1;
}

.base-button--outline.base-button--secondary {
  color: #718096;
  box-shadow: inset 0 0 0 2px #718096;
}

.base-button--outline.base-button--success {
  color: #48bb78;
  box-shadow: inset 0 0 0 2px #48bb78;
}

.base-button--outline.base-button--danger {
  color: #f56565;
  box-shadow: inset 0 0 0 2px #f56565;
}

.base-button--outline.base-button--warning {
  color: #ecc94b;
  box-shadow: inset 0 0 0 2px #ecc94b;
}

.base-button--outline.base-button--info {
  color: #4fd1c5;
  box-shadow: inset 0 0 0 2px #4fd1c5;
}

/* 圓角按鈕 */
.base-button--rounded {
  border-radius: 9999px;
}

/* 狀態樣式 */
.base-button--disabled {
  opacity: 0.65;
  cursor: not-allowed;
  pointer-events: none;
}

.base-button--block {
  display: flex;
  width: 100%;
}

/* 圖標樣式 */
.button-icon {
  display: inline-flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.button-icon:first-child {
  margin-right: 0.5rem;
}

.button-icon:last-child {
  margin-left: 0.5rem;
}

/* 載入動畫 */
.button-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.base-button--loading {
  color: transparent !important;
}

.base-button--loading .button-content {
  visibility: hidden;
}

/* 懸停效果 */
.base-button:not(.base-button--disabled):not(.base-button--loading):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  filter: brightness(110%);
}

.base-button--link:hover,
.base-button--outline:hover {
  box-shadow: none;
  background-color: rgba(66, 153, 225, 0.1);
}

/* 點擊效果 */
.base-button:not(.base-button--disabled):not(.base-button--loading):active {
  transform: translateY(1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 滑進滑出動畫 */
.base-button:not(.base-button--link):not(.base-button--outline)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.base-button:not(.base-button--disabled):not(.base-button--loading):hover::before {
  transform: translateX(100%);
}

/* 響應式設計 */
@media (max-width: 640px) {
  .base-button {
    font-size: 0.875rem;
  }

  .base-button--large {
    font-size: 1rem;
  }
}
</style>
