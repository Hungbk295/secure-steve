import axios from "axios";
import { Alert, AlertActionRequest, LatestAlertsResponse } from "@/interfaces/app";

// Create axios instance
const apiClient = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const alertsApi = {
  /**
   * Fetch latest alerts (API-DASH-01)
   */
  getLatestAlerts: async (): Promise<LatestAlertsResponse> => {
    try {
      const response = await apiClient.get<LatestAlertsResponse>("/analysis/requests/latest");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch latest alerts:", error);
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to load alerts"
      );
    }
  },

  /**
   * Get alert details by ID
   */
  getAlertById: async (alertId: string): Promise<Alert> => {
    try {
      const response = await apiClient.get<Alert>(`/analysis/requests/${alertId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error("Alert not found or has been deleted");
      }
      console.error("Failed to fetch alert details:", error);
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to load alert details"
      );
    }
  },

  /**
   * Update alert action status
   */
  updateAlertAction: async (alertId: string, actionData: AlertActionRequest): Promise<Alert> => {
    try {
      const response = await apiClient.put<Alert>(
        `/analysis/requests/${alertId}/action`,
        actionData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 404) {
          throw new Error("Alert not found or has been deleted");
        }
        if (status === 400) {
          throw new Error(message || "Invalid action request");
        }
        if (status === 403) {
          throw new Error("You don't have permission to perform this action");
        }
      }
      
      console.error("Failed to update alert action:", error);
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update alert action"
      );
    }
  },

  /**
   * Add to blacklist (API-POL-01) - Future extension
   */
  addToBlacklist: async (alertId: string, comments?: string): Promise<void> => {
    try {
      await apiClient.post("/policy/blacklist", {
        alert_id: alertId,
        comments,
      });
    } catch (error) {
      console.error("Failed to add to blacklist:", error);
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to add to blacklist"
      );
    }
  },

  /**
   * Add to whitelist (API-POL-01) - Future extension
   */
  addToWhitelist: async (alertId: string, comments?: string): Promise<void> => {
    try {
      await apiClient.post("/policy/whitelist", {
        alert_id: alertId,
        comments,
      });
    } catch (error) {
      console.error("Failed to add to whitelist:", error);
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to add to whitelist"
      );
    }
  },
};

export default apiClient;