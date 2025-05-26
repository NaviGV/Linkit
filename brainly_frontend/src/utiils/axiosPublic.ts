
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const axiosPublic = axios.create({
  baseURL: BACKEND_URL,
});

export default axiosPublic;
