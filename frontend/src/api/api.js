import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
    console.warn(
        "VITE_API_URL is not configured. Please create a frontend .env file."
    );
}

const api = axios.create({
    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json"
    }
});

export default api;