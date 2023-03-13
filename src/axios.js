import axios from "axios";
require('dotenv').config()

axios.defaults.baseURL = process.env.VUE_APP_BaseURLBackend;
axios.defaults.withCredentials = true;

export default axios;