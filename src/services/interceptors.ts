
import { api } from "./axios";
import { storageLocal } from "./storageLocal";

let onLogout: (() => void) | null = null;

export function setupInterceptors(logoutCallback?: () => void) {
    onLogout = logoutCallback ?? null;

    api.interceptors.request.use((config) => {
        const token = storageLocal.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    })

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error.response?.status;
            if (status === 401) {
                storageLocal.clear();
                if (onLogout) onLogout(); // redireciona para login
            }
            return Promise.reject(error);
        }
    );
}