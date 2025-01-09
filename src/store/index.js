import {createStore} from 'vuex'
import {searchProduct} from '@/services/products'

const storeOptions = {
    //狀態資料
    state:{
        accessToken : "",
        refreshToken : "",
        userId : "",
        userName : "",
        searchResults: [],
        isSearching: false,
        isTypeSearch:false
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
        setSearchResult(state, results) {
            state.searchResults = results
        },
        setIsSearching(state, status) {
            state.isSearching = status
        },
        setIsTypeSearch(state, payload){
            state.isTypeSearch = payload
        }
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
    },
}

export default
createStore(storeOptions)
