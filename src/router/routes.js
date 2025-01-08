export default [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/home/HomeView.vue'),
        meta: {
            title: '首頁',
            keepAlive: true
        }
    },
    {
        path: '/products',
        name: 'Products',
        component: () => import('@/views/product/ProductListView.vue'),
        props: route => ({
            categoryId: route.query.categoryId ? parseInt(route.query.categoryId) : null
        }),
        meta: {
            title: '商品列表',
            keepAlive: true
        }
    },
    // {
    //     path: '/category/:id',
    //     name: 'Category',
    //     component: () => import('@/views/product/ProductListView.vue'),
    //     props: route => ({ categoryId: parseInt(route.params.id) }),
    //     meta: {
    //         title: '商品分類',
    //         keepAlive: true
    //     }
    // },
    {
        path: '/product/:id',
        name: 'ProductDetail',
        component: () => import('@/views/product/ProductDetailView.vue'),
        props: route => ({ productId: parseInt(route.params.id) }),
        meta: {
            title: '商品詳情',
            keepAlive: true
        }
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('@/views/cart/CartView.vue'),
        meta: {
            requiresAuth: true,
            title: '購物車'
        }
    },
    {
        path: '/checkout',
        name: 'Checkout',
        component: () => import('@/views/cart/CheckoutView.vue'),
        meta: {
            requiresAuth: true,
            title: '結帳',
            validateCart: true
        }
    },
    {
        path: '/orders',
        name: 'Orders',
        component: () => import('@/views/order/OrderHistoryView.vue'),
        meta: {
            requiresAuth: true,
            title: '訂單記錄'
        }
    },
    {
        path: '/order/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/OrderDetailView.vue'),
        props: route => ({ orderId: parseInt(route.params.id) }),
        meta: {
            requiresAuth: true,
            title: '訂單詳情'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/user/LoginView.vue'),
        meta: {
            title: '登入',
            hideForAuth: true
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/user/RegisterView.vue'),
        meta: {
            title: '註冊',
            hideForAuth: true
        }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/user/ProfileView.vue'),
        meta: {
            requiresAuth: true,
            title: '會員資料',
            keepAlive: true
        }
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('@/views/about/AboutView.vue'),
        meta: { title: '關於我們' }
    },
    {
        path: '/contact',
        name: 'Contact',
        component: () => import('@/views/contact/ContactView.vue'),
        meta: { title: '聯絡我們' }
    },
    // // {
    // //     path: '/403',
    // //     name: 'Forbidden',
    // //     component: () => import('@/views/ErrorView.vue'),
    // //     props: { code: 403, message: '無權限訪問此頁面' },
    // //     meta: { title: '403 無權限訪問' }
    // // },
    // // {
    // //     path: '/404',
    // //     name: 'NotFound',
    // //     component: () => import('@/views/NotFoundView.vue'),
    // //     meta: { title: '404 頁面不存在' }
    // // },
    // // {
    // //     path: '/500',
    // //     name: 'ServerError',
    // //     component: () => import('@/views/ErrorView.vue'),
    // //     props: { code: 500, message: '伺服器發生錯誤' },
    // //     meta: { title: '500 伺服器錯誤' }
    // // },
    // // {
    // //     path: '/:pathMatch(.*)*',
    // //     redirect: ROUTE_CONSTANTS.ERROR_PATHS.NOT_FOUND
    // // }
]
