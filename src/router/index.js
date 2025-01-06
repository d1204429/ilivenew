import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
//import store from '@/store'
//import { handleError } from '@/utils/errorHandler'

// 創建路由實例
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(savedPosition)
                }, 300)
            })
        }
        return { top: 0, behavior: 'smooth' }
    }
})

// 路由常量配置
// const ROUTE_CONSTANTS = {
//     TOKEN_KEY: import.meta.env.VITE_JWT_TOKEN_KEY,
//     REFRESH_KEY: import.meta.env.VITE_JWT_REFRESH_KEY,
//     APP_NAME: import.meta.env.VITE_APP_NAME || 'iLive',
//     DEFAULT_TITLE: '首頁',
//     LOGIN_PATH: '/login',
//     HOME_PATH: '/',
//     ERROR_PATHS: {
//         FORBIDDEN: '/403',
//         NOT_FOUND: '/404',
//         SERVER_ERROR: '/500'
//     }
// }

// 檢查認證狀態
// const checkAuthentication = async () => {
//     try {
//         const token = localStorage.getItem(ROUTE_CONSTANTS.TOKEN_KEY)
//         const refreshToken = localStorage.getItem(ROUTE_CONSTANTS.REFRESH_KEY)
//         const isAuthenticated = store.getters['auth/isAuthenticated']

//         if (!token && !refreshToken) return false

//         if (!isAuthenticated && token && refreshToken) {
//             try {
//                 await store.dispatch('auth/checkAuth')
//                 return true
//             } catch (error) {
//                 console.error('認證檢查失敗:', error)
//                 await handleAuthError(error)
//                 return false
//             }
//         }

//         return isAuthenticated
//     } catch (error) {
//         console.error('認證檢查失敗:', error)
//         return false
//     }
// }

// 處理認證錯誤
// const handleAuthError = async (error) => {
//     await store.dispatch('auth/logout')
//     store.dispatch('app/showNotification', {
//         type: 'error',
//         message: error.message || '認證失敗，請重新登入',
//         duration: 3000
//     })
// }

// 處理認證重定向
// const handleAuthRedirect = (to) => {
//     const currentPath = to.fullPath
//     const isLoginPage = currentPath === ROUTE_CONSTANTS.LOGIN_PATH

//     if (isLoginPage) {
//         return { path: ROUTE_CONSTANTS.HOME_PATH }
//     }

//     return {
//         path: ROUTE_CONSTANTS.LOGIN_PATH,
//         query: {
//             redirect: currentPath,
//             message: '請先登入以繼續操作'
//         }
//     }
// }

// 設置文檔標題
// const setDocumentTitle = (to) => {
//     const title = to.meta.title || ROUTE_CONSTANTS.DEFAULT_TITLE
//     document.title = `${title} - ${ROUTE_CONSTANTS.APP_NAME}`
// }

// 驗證購物車
// const validateCart = async () => {
//     try {
//         await store.dispatch('cart/validateCart')
//         return true
//     } catch (error) {
//         store.dispatch('app/showNotification', {
//             type: 'error',
//             message: error.message || '購物車驗證失敗',
//             duration: 3000
//         })
//         return false
//     }
// }

// 路由守衛
// router.beforeEach(async (to, from, next) => {
//     try {
//         setDocumentTitle(to)
//         const isAuthenticated = await checkAuthentication()

//         if (to.meta.requiresAuth && !isAuthenticated) {
//             store.dispatch('app/showNotification', {
//                 type: 'warning',
//                 message: '請先登入以繼續操作',
//                 duration: 2000
//             })
//             return next(handleAuthRedirect(to))
//         }

//         if (to.meta.hideForAuth && isAuthenticated) {
//             return next(ROUTE_CONSTANTS.HOME_PATH)
//         }

//         if (to.meta.validateCart && isAuthenticated) {
//             const isValid = await validateCart()
//             if (!isValid) {
//                 return next('/cart')
//             }
//         }

//         next()
//     } catch (error) {
//         console.error('路由守衛錯誤:', error)
//         handleError(error)
//         next(ROUTE_CONSTANTS.ERROR_PATHS.SERVER_ERROR)
//     }
// })

// 路由後置守衛
// router.afterEach((to, from) => {
//     if (to.meta.keepAlive) {
//         const instance = router.currentRoute.value.matched[0].instances.default
//         if (instance && instance.activatedCache) {
//             instance.activatedCache()
//         }
//     }
//     store.dispatch('app/setLoading', false)
// })

export default router
