import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../services/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string | null;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => api.getStoredUser());
  const [accessToken, setAccessToken] = useState<string | null>(() => api.getAccessToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await api.getUser();
        setUser(userData);
      } catch (error) {
        api.clearAuth();
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [accessToken]);

  const login = async (email: string, password: string) => {
    const { access_token, user: userData } = await api.login(email, password);
    setAccessToken(access_token);
    setUser(userData);
  };

  const logout = async () => {
    await api.logout();
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user && !!accessToken,
        login,
        logout,
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
