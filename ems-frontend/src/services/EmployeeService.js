import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const REST_API_BASE_URL = `${API}/api/employees`;

// Add a request interceptor to attach the JWT token to headers if available
axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const listEmployees = () => axios.get(REST_API_BASE_URL);

export const createEmployee = (employee) =>
  axios.post(REST_API_BASE_URL, employee);

export const getEmployee = (employeeId) =>
  axios.get(`${REST_API_BASE_URL}/${employeeId}`);

export const updateEmployee = (employeeId, employee) =>
  axios.put(`${REST_API_BASE_URL}/${employeeId}`, employee);

export const deleteEmployee = (employeeId) =>
  axios.delete(`${REST_API_BASE_URL}/${employeeId}`);

export const getSalary = (employeeId, month, year) =>
  axios.get(`${REST_API_BASE_URL}/${employeeId}/salary`, {
    params: { month, year },
  });

export const getLatestSalary = (employeeId) =>
  axios.get(`${REST_API_BASE_URL}/${employeeId}/salary/latest`);

export const getRecentPayslips = (employeeId) =>
  axios.get(`${REST_API_BASE_URL}/${employeeId}/payslips/recent`);

export const saveSalary = (employeeId, salary) =>
  axios.put(`${REST_API_BASE_URL}/${employeeId}/salary`, salary);

export const downloadPayslip = (employeeId, month, year) =>
  axios.get(`${REST_API_BASE_URL}/${employeeId}/payslip`, {
    params: { month, year },
    responseType: "blob",
  });
