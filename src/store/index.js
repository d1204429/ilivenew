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
    actions:{
        // 添加 loginUser action
        loginUser({ commit }, userData) {
            commit('updateAccessToken', userData.accessToken)
            commit('updateRefreshToken', userData.refreshToken)
            commit('updateUserId', userData.user.userId)
            commit('updateUserName', userData.user.username)
        },
        logoutUser({ commit }) {
            commit('clearUserData')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('userId')
            localStorage.removeItem('userName')
        }
    },
}

export default createStore(storeOptions)
