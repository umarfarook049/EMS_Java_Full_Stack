import axios from "axios";

const AUTH_URL = "http://localhost:8080/api/auth";

export const login = (username, password) =>
  axios.post(`${AUTH_URL}/login`, { username, password });

export const createUser = (user) => axios.post(`${AUTH_URL}/users`, user);

export const saveSession = (data) =>
  localStorage.setItem("auth", JSON.stringify(data));

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem("auth"));
  } catch {
    return null;
  }
};

export const logout = () => localStorage.removeItem("auth");
export const isLoggedIn = () => !!getSession()?.token;
export const isAdmin = () => getSession()?.role === "ADMIN";

// Attach the token to every request
axios.interceptors.request.use((config) => {
  const token = getSession()?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is expired or invalid, send the user back to login
axios.interceptors.response.use(
  (res) => res,
  (error) => {
    const isLoginCall = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isLoginCall) {
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
