import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // base da sua API
  withCredentials: true
});

export default api  