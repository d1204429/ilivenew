import { createStore } from 'vuex'
import { searchProduct } from '@/services/products'

const storeOptions = {
    state: {
        // 認證相關狀態
        accessToken: "",
        refreshToken: "",
        userId: "",
        userName: "",
        // 搜尋相關狀態
        searchResults: [],
        isSearching: false,
        isTypeSearch: false
    },

    mutations: {
        // 認證相關更新器
        updateAccessToken(state, payload) {
            state.accessToken = payload
        },
        updateRefreshToken(state, payload) {
            state.refreshToken = payload
        },
        updateUserId(state, payload) {
            state.userId = payload
        },
        updateUserName(state, payload) {
            state.userName = payload
        },
        clearUserData(state) {
            state.accessToken = ""
            state.refreshToken = ""
            state.userId = ""
            state.userName = ""
        },
        // 搜尋相關更新器
        setSearchResult(state, results) {
            state.searchResults = results
        },
        setIsSearching(state, status) {
            state.isSearching = status
        },
        setIsTypeSearch(state, payload) {
            state.isTypeSearch = payload
        }
    },

    actions: {
        // 認證相關動作
        initializeAuth({ commit }) {
            const accessToken = localStorage.getItem('accessToken')
            const refreshToken = localStorage.getItem('refreshToken')
            const userId = localStorage.getItem('userId')
            const userName = localStorage.getItem('userName')

            if (accessToken && userId) {
                commit('updateAccessToken', accessToken)
                commit('updateRefreshToken', refreshToken)
                commit('updateUserId', userId)
                commit('updateUserName', userName)
            }
        },

        loginUser({ commit }, userData) {
            commit('updateAccessToken', userData.accessToken)
            commit('updateRefreshToken', userData.refreshToken)
            commit('updateUserId', userData.user.userId)
            commit('updateUserName', userData.user.username)

            localStorage.setItem('accessToken', userData.accessToken)
            localStorage.setItem('refreshToken', userData.refreshToken)
            localStorage.setItem('userId', userData.user.userId)
            localStorage.setItem('userName', userData.user.username)
        },

        logoutUser({ commit }) {
            commit('clearUserData')

            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('userId')
            localStorage.removeItem('userName')

            window.location.href = '/login'
        },

        checkAuthState({ state }) {
            return !!state.accessToken && !!state.userId
        },

        updateTokens({ commit }, { accessToken, refreshToken }) {
            commit('updateAccessToken', accessToken)
            commit('updateRefreshToken', refreshToken)

            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
        },

        // 搜尋相關動作
        async searchProducts({ commit }, keyword) {
            try {
                commit('setIsSearching', true)
                const results = await searchProduct(keyword)
                commit('setSearchResult', results)
            } catch (error) {
                console.error('搜尋商品失敗:', error)
                commit('setSearchResult', [])
            } finally {
                commit('setIsSearching', false)
            }
        }
    }
}

export default createStore(storeOptions)
