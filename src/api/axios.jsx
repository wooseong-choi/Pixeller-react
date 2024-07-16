import axios from "axios";
// axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
  baseURL: "//api.pixeller.net", // Change this to Backend API URL
  // baseURL: "//192.168.0.96:3333", // Change this to Backend API URL
  timeout: 1000,
  headers: {
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

const axiosCRUDInstance = axios.create({
  baseURL: "//lionreport.pixeller.net", // Change this to Backend API URL
  // baseURL: "//192.168.0.46:8080", // Change this to Backend API URL
  timeout: 5000,
});

axiosCRUDInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const token = sessionStorage.getItem("user");
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

export { axiosInstance, axiosCRUDInstance };
