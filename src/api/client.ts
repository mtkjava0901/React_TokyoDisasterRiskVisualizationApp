import axios from "axios";

/**------------------
 *
 * axios共通設定
 *
 ------------------*/
export const apiClient = axios.create({
  baseURL: "http://localhost:8080", // Spring Boot
  headers: {
    "Content-Type": "application/json"
  }
});
