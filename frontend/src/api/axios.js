import axios from "axios";

const api = axios.create({
  baseURL: "https://hostel-management-system-1uio.onrender.com/api",
  withCredentials: true,
});

export default api;