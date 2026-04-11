import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Example endpoints
export const registerUser = (data) => API.post("/api/user/register", data);
export const loginUser = (data) => API.post("/api/user/login", data);

export const getTasks = () => API.get("/api/tasks");
export const createTask = (data) => API.post("/api/tasks", data);
export const updateTask = (id, data) => API.put(`/api/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/api/tasks/${id}`);

export default API;
