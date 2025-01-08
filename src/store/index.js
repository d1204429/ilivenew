import {createStore} from 'vuex'

const storeOptions = {
    state:{
        accessToken : "",
        refreshToken : "",
        userId : "",
        userName : "",
    },
    mutations:{
        updateAccessToken(state, payload){
            state.accessToken = payload
        },
        updateRefreshToken(state, payload){
            state.refreshToken = payload
        },
        updateUserId(state, payload){
            state.userId = payload
        },
        updateUserName(state, payload){
            state.userName = payload
        },
        clearUserData(state) {
            state.accessToken = ""
            state.refreshToken = ""
            state.userId = ""
            state.userName = ""
        }
    },
    actions: {
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
            // 更新 Vuex store
            commit('updateAccessToken', userData.accessToken)
            commit('updateRefreshToken', userData.refreshToken)
            commit('updateUserId', userData.user.userId)
            commit('updateUserName', userData.user.username)

            // 保存到 localStorage
            localStorage.setItem('accessToken', userData.accessToken)
            localStorage.setItem('refreshToken', userData.refreshToken)
            localStorage.setItem('userId', userData.user.userId)
            localStorage.setItem('userName', userData.user.username)
        },

        logoutUser({ commit }) {
            // 清除 Vuex store
            commit('clearUserData')

            // 清除 localStorage
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('userId')
            localStorage.removeItem('userName')

            // 可選：重定向到登入頁
            window.location.href = '/login'
        },

        // 檢查登入狀態
        checkAuthState({ state }) {
            return !!state.accessToken && !!state.userId
        },

        // 更新 token
        updateTokens({ commit }, { accessToken, refreshToken }) {
            commit('updateAccessToken', accessToken)
            commit('updateRefreshToken', refreshToken)

            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
        }
    },
}

export default createStore(storeOptions)
