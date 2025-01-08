import {createStore} from 'vuex'

const storeOptions = {
    //狀態資料
    state:{
        accessToken : "",
        refreshToken : "",
        userId : "",
        userName : "",
    },
    //更新器
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
        }, clearUserData(state) {
            state.accessToken = ""
            state.refreshToken = ""
            state.userId = ""
            state.userName = ""
        }
    },
    //異步處理動作
    actions:{
        logoutUser({ commit }) {
            // 清除 store 中的用戶數據
            commit('clearUserData')
            // 清除 localStorage 中可能存在的數據
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('userId')
            localStorage.removeItem('userName')
        }
    },
}

export default
createStore(storeOptions)
