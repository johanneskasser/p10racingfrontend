import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login'
import Register from './components/Register'
import store from "@/store/vuex";
import Dashboard from "@/components/Dashboard";
import UpdateBet from "./components/UpdateBet";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Login
        },
        {
            path: '/register',
            component: Register
        },
        {
            path: '/dashboard',
            component: Dashboard,
            beforeEnter: guard
        },
        {
            path: '/updateBet',
            component: UpdateBet,
            beforeEnter: guard
        }
    ]
})

function guard(to,from,next) {
    if(store.state.user === null) {
        next('/');
    } else {
        next();
    }
}

export default router
