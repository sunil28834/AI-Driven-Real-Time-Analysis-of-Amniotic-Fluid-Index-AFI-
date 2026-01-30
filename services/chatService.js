import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const getChatHistory = (token, limit = 100) => {
  return axios.get(`${API_URL}/api/chat/history?limit=${limit}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
};
