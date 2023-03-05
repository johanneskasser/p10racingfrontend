import {createApp} from 'vue'
import App from './App.vue'
import router from "./router.js"
import store from "@/store/vuex";
import '@/assets/css/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)

app.config.productionTip = false

app.use(router)

app.use(store)

app.mount('#app')
