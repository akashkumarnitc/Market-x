import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/', // all your routes start from here
  withCredentials: true, // for cookie-based auth
});

export default axiosInstance;