import {createStore} from 'vuex'
import {searchProduct} from '@/services/products'

const storeOptions = {
    //狀態資料
    state:{
        isLogIn : false,
        currentUserName: "",
        searchResults: [],
        isSearching: false,
        isTypeSearch:false
    },
    //更新器
    mutations:{
        updateIsLogIn(state, payload){
            state.isLogIn = payload
        },
        updateCurrentUserName(state, payload){
            state.currentUserName = payload
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
                    localStorage.setItem('accessToken', response.accessToken);
                    localStorage.setItem('refreshToken', response.refreshToken);
                    localStorage.setItem('userId', response.user.userId);
                    localStorage.setItem('userName', response.user.username);
                    commit('updateIsLogIn', true)
                    commit('updateCurrentUserName', response.user.username)
                    commit('setSearchResult', [])
                    commit('setIsSearching', false)
                    commit('setIsTypeSearch', false)
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
        },
        async logout({commit}){
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            commit('updateIsLogIn', false)
            commit('updateCurrentUserName', "")
            commit('setSearchResult', [])
            commit('setIsSearching', false)
            commit('setIsTypeSearch', false)
        },
        async getLoginState({commit}){
            commit('updateIsLogIn', !!localStorage.getItem('accessToken'))
            commit('updateCurrentUserName', localStorage.getItem('userName'))
        }
    },
}

export default
createStore(storeOptions)