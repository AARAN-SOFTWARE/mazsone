// apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  withCredentials: true,
  // baseURL: "https://dev.aaranerp.com",
});

apiClient.interceptors.request.use(
  (config) => {

    // ✅ Only set application/json when not sending FormData
    const isFormData = config.data instanceof FormData;
    if (!isFormData && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
