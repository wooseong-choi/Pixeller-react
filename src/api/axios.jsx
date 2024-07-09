import axios from "axios";
// axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
  baseURL: "http://172.31.32.205:3333", // Change this to Backend API URL
  timeout: 1000,
  Headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const token = localStorage.getItem("user");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
