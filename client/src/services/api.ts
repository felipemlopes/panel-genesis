import axios, { AxiosInstance, AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER: "auth_user",
};

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = this.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  /* =======================
     AUTH STORAGE
  ======================= */

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  setAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  getStoredUser(): any | null {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  }

  setStoredUser(user: any): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  clearAuth(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  /* =======================
     AUTH REQUESTS
  ======================= */

  async login(email: string, password: string) {
    const response = await this.client.post("/login", { email, password });

    const { access_token, user } = response.data;

    this.setAccessToken(access_token);
    this.setStoredUser(user);

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post("/logout");
    } finally {
      this.clearAuth();
    }
  }

  async getUser(): Promise<any> {
    const response = await this.client.get("/me");
    this.setStoredUser(response.data);
    return response.data;
  }

  /* =======================
     GENERIC REQUESTS
  ======================= */

  async get<T = any>(endpoint: string): Promise<T> {
    const response = await this.client.get(endpoint);
    return response.data;
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const response = await this.client.post(endpoint, data);
    return response.data;
  }

  async getParameters(): Promise<any> {
    const response = await this.client.get("/settings");
    return response.data;
  }

  async getSubscriptions(): Promise<any> {
    const response = await this.client.get("/subscriptions");
    return response.data;
  }

  async getPlans(): Promise<any> {
    const response = await this.client.get("/plans");
    return response.data;
  }

  async getUsers(): Promise<any> {
    const response = await this.client.get("/users");
    return response.data;
  }

  async updateUser(
    userId: number,
    data: {
      credits?: number;
      is_admin?: boolean;
      name?: string;
      email?: string;
    }
  ): Promise<any> {
    const response = await this.client.post(`/users/${userId}`, data);
    return response.data;
  }

  async addUserCredits(
    userId: number,
    data: {
      credits?: number;
    }
  ): Promise<any> {
    const response = await this.client.post(`/users/${userId}/credits`, data);
    return response.data;
  }

  async toggleUserStatus(userId: number): Promise<any> {
    const response = await this.client.post(`/users/${userId}/status`);
    return response.data;
  }

  async updateUserActivation(
    userId: number,
    data: {
      activationMode: string;
      manualActivationStart?: string | null;
      manualActivationEnd?: string | null;
    }
  ): Promise<any> {
    const response = await this.client.post(`/users/${userId}/activation`, data);
    return response.data;
  }

}

export const api = new ApiService();
