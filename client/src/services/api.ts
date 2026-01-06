import axios, { AxiosInstance, AxiosError } from "axios";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER: "auth_user",
  API_URL: "api_url",
};

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
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
      const apiUrl = this.getApiUrl();
      if (apiUrl && config.url) {
        config.url = `${apiUrl}${config.url}`;
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

  getApiUrl(): string {
    return localStorage.getItem(STORAGE_KEYS.API_URL) || "";
  }

  setApiUrl(url: string): void {
    const normalizedUrl = url.endsWith("/") ? url.slice(0, -1) : url;
    localStorage.setItem(STORAGE_KEYS.API_URL, normalizedUrl);
  }

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

  async login(email: string, password: string): Promise<{ access_token: string; user: any }> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl) {
      throw new Error("API URL não configurada");
    }

    const response = await this.client.post("/api/login", { email, password });
    const { access_token, user } = response.data;

    this.setAccessToken(access_token);
    this.setStoredUser(user);

    return { access_token, user };
  }

  async logout(): Promise<void> {
    try {
      await this.client.post("/api/logout");
    } catch (error) {
    } finally {
      this.clearAuth();
    }
  }

  async getUser(): Promise<any> {
    const response = await this.client.get("/api/user");
    this.setStoredUser(response.data);
    return response.data;
  }

  async get<T = any>(endpoint: string): Promise<T> {
    const response = await this.client.get(endpoint);
    return response.data;
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const response = await this.client.post(endpoint, data);
    return response.data;
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    const response = await this.client.put(endpoint, data);
    return response.data;
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    const response = await this.client.delete(endpoint);
    return response.data;
  }
}

export const api = new ApiService();
export { STORAGE_KEYS };
