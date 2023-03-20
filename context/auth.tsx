import router from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    setToken(token);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.clear();
    setToken("");
    router.push("/");
    router.reload();
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

interface AuthContextType {
  token?: string;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}
