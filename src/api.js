// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",   // ⬅️  adjust if your Laravel host/port differs
  headers: { Accept: "application/json" },
});

// ───── Request interceptor: add Bearer token ─────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// src/api.js  (add to the file we created earlier)

export const getTodos   = ()                 => api.get   ("/todos");
export const createTodo = (data)             => api.post  ("/todo",   data);
export const updateTodo = (id, data)         => api.put   (`/todo/${id}`, data);
export const deleteTodo = (id)               => api.delete(`/todo/${id}`);

export const signup   = (data) => api.post("/signup", data);
export const login    = (data) => api.post("/login",  data);
export const profile  = ()      => api.get ("/profile");
export const logout   = ()      => api.post("/logout");
export default api;
