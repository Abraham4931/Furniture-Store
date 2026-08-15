import { createContext, useContext, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("fernwood_user");
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (data) => {
    localStorage.setItem("fernwood_user", JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persist(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    persist(data);
    return data;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put("/auth/profile", payload);
    persist(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("fernwood_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
