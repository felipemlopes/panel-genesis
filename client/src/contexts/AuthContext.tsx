import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setApiUrl: (url: string) => void;
  apiUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "auth_user",
  API_URL: "api_url",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  });
  const [isLoading, setIsLoading] = useState(true);
  const [apiUrl, setApiUrlState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.API_URL) || "";
  });

  const setApiUrl = (url: string) => {
    const normalizedUrl = url.endsWith("/") ? url.slice(0, -1) : url;
    setApiUrlState(normalizedUrl);
    localStorage.setItem(STORAGE_KEYS.API_URL, normalizedUrl);
  };

  useEffect(() => {
    const validateToken = async () => {
      if (!token || !apiUrl) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setUser(response.data);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
      } catch (error) {
        setToken(null);
        setUser(null);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token, apiUrl]);

  const login = async (email: string, password: string) => {
    if (!apiUrl) {
      throw new Error("API URL não configurada");
    }

    const response = await axios.post(
      `${apiUrl}/api/login`,
      { email, password },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const { token: newToken, user: userData } = response.data;
    
    setToken(newToken);
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        setApiUrl,
        apiUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
