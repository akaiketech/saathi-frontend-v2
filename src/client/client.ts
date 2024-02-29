
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_BASE_URL,
});

export default axiosInstance;
