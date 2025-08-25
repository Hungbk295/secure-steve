// import { store } from "@/store";
// import { actionLogout } from "@/store/authSlide";
import axios, { AxiosRequestConfig } from "axios";
import { handleApiException } from "@/utils/apiException";

export const instanceAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instanceAxios.defaults.headers.common["Content-Type"] = "application/json";

instanceAxios.interceptors.response.use(
  (response) => {
    if (
      response.data.code &&
      response.data.code != 200 &&
      response.data?.code != 0
    ) {
      handleApiException(response);
      return Promise.reject(response);
    }
    return response;
  },
  (error) => {
    if (!axios.isCancel(error)) {
      console.error("Request was not canceled:", error);
    }
    return Promise.reject(error);
  }
);

export default function request(options: AxiosRequestConfig) {
  return instanceAxios({
    ...options,
  });
}
