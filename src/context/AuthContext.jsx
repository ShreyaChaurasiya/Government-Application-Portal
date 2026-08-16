import { useState } from "react";
import { clearStoredUser, readStoredUser, writeStoredUser } from "../utils/authStorage";
import { AuthContext } from "./auth-context";

function normalizeRole(role) {
  if (typeof role === "string") return role;
  if (role?.name) return role.name;
  return role;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());

  const login = (data) => {
    const nextUser = {
      token: data.token,
      refreshToken: data.refreshToken,
      name: data.name,
      email: data.email,
      role: normalizeRole(data.role),
    };
    writeStoredUser(nextUser);
    setUser(nextUser);
  };

  const logout = () => {
    clearStoredUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading: false, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
