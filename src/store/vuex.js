import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            user: JSON.parse(localStorage.getItem('user'))
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
        },
        removeUser({commit}) {
            commit('REMOVE_USER')
        }
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },
        REMOVE_USER(state) {
            state.user = null;
            localStorage.removeItem('user')
        }
    }
})

export default store
