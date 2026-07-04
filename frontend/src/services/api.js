import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  timeout: 60000 // 60 seconds timeout to handle Render cold starts gracefully
});

API.interceptors.request.use((config) => {

const token = localStorage.getItem("token");

if(token){
config.headers.Authorization=`Bearer ${token}`;
}

return config;

});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default API;