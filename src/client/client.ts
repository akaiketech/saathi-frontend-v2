import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_BASE_URL,
});

export default axiosInstance;
