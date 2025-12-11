import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  try {
    let token = localStorage.getItem("token");

    if (!token) {
      const persisted = localStorage.getItem("nostella-auth");
      if (persisted) {
        try {
          const parsed = JSON.parse(persisted);
          token =
            parsed?.access_token ??
            parsed?.token ??
            parsed?.state?.access_token ??
            parsed?.state?.token;
        } catch (e) {}
      }
    }
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {}
  return config;
});

// Auth API functions
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
  register: async (fullName: string, email: string, password: string) => {
    const response = await api.post("/auth/register", {
      fullName,
      email,
      password,
    });
    return response.data;
  },
  verify: async (email: string, code: string) => {
    const response = await api.post("/auth/verify", { email, code });
    return response.data;
  },
};

// User API functions
export const userApi = {
  updateProfile: async (name: string) => {
    const response = await api.patch("/users/profile", { name });
    return response.data;
  },

  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
