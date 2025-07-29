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
    // TODO: Backend not complete return statusCode -> fake one (0 - zero)
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

    // const { url } = error.config;
    // const isUrlLogin = url.includes("/signin");
    // if (error.response.status === 401 && !isUrlLogin) {
    // store.dispatch(actionLogout());
    // }
    return Promise.reject(error);
  }
);

export default function request(options: AxiosRequestConfig) {
  return instanceAxios({
    ...options,
  });
}
