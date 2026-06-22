import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (
    token &&
    !config.url.includes("/login/") &&
    !config.url.includes("/register/")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem("token", res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export const registerUser = async (name, email, password) => {
  const response = await api.post("/register/", { name, email, password });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post("/login/", { email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/me/");
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/users/");
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}/`);
  return response.data;
};

export const deleteMe = async () => {
  const response = await api.delete("/me/");
  return response.data;
};
