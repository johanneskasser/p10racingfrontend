import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            user: null
        }
    },
    getters: {
        user(state) {
            return state.user
        }
    },
    actions: {
        setUser({ commit }, user) {
            commit('SET_USER', user)
        }
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user
        }
    }
})

export default store
