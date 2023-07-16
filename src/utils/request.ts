import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
} from "axios";
import { useUserStoreHook } from "@/store/modules/user";

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStoreHook();
    if (userStore.token) {
      config.headers.Authorization = userStore.token;
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: any) => {
    const res = error.response;
    console.log(res);
    if (res?.status === 401) {
      ElMessageBox.confirm("当前会话已失效，请重新登录", "提示", {
        confirmButtonText: "确定",
        type: "warning",
      }).then(() => {
        localStorage.clear();
        location.reload();
      });
    }

    return Promise.reject(res);
  }
);

export const http = {
  get<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },

  post<T = any>(
    url: string,
    data?: object,
    config?: InternalAxiosRequestConfig
  ): Promise<T> {
    return service.post(url, data, config);
  },

  put<T = any>(
    url: string,
    data?: object,
    config?: InternalAxiosRequestConfig
  ): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T = any>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<T> {
    return service.delete(url, config);
  },
};

export default service;
