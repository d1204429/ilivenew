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
        },
    },
    //異步處理動作
    actions:{
        async loginUser({commit}, response) {
            try {
                if (response?.accessToken) {
                    commit('updateAccessToken', response.accessToken)
                    commit('updateRefreshToken', response.refreshToken)
                    commit('updateUserId', response.user.userId)
                    commit('updateUserName', response.user.username)
                    return
                }
                throw new Error('Login failed: No access token received')
            } catch (error) {
                console.error('Login error:', error)
                throw error
            }
        },
    },
}

export default
createStore(storeOptions)