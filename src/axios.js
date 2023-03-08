import axios from "axios";

axios.defaults.baseURL = 'https://p10racing.herokuapp.com/api';
axios.defaults.withCredentials = true;

export default axios;