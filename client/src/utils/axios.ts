import axios from 'axios';
import Cookies from 'js-cookie';
import { VITE_APP_SERVER_URL } from './constant';

const axiosInstance = axios.create({
  baseURL: VITE_APP_SERVER_URL,
});
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('autoflow_token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export { axiosInstance };
