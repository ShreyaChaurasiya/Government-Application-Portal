import api from "../api/api";
 
// Expected backend contract (adjust to match your Spring Boot controller):
// POST /api/auth/login    { email, password }        -> { token, name, email, role }
// POST /api/auth/register { name, email, password, role } -> { token, name, email, role }
 
export const login = (email, password) =>
  api.post("/api/auth/login", { email, password });
 
export const signup = ({ name, email, password, role }) =>
  api.post("/api/auth/register", { name, email, password, role });
 