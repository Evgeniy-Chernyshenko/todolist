import axios from "axios";

export const client = axios.create({
  withCredentials: true,
  headers: {
    "api-key": "02961556-53bc-4585-b670-252d64d59f3a",
  },
  baseURL: "https://social-network.samuraijs.com/api/1.1",
});
