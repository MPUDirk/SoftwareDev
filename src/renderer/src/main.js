import '@/assets/BootStrap/css/bootstrap.min.css';
import '@/assets/BootStrap/js/bootstrap.bundle.min.js';

import axios from 'axios'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

axios.defaults.baseURL = 'https://p2304362.dc-yan.top/oms/';
axios.defaults.timeout = 60000;
axios.defaults.withCredentials = true;

app.config.globalProperties.$axios = axios;
app.use(router)
app.mount('#app')
