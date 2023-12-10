import axios from 'axios';
import { VITE_APP_SERVER_URL } from './constant';

const axiosInstance = axios.create({
  baseURL: VITE_APP_SERVER_URL,
});
export { axiosInstance };
