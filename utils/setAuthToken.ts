import api from "./api";

export const setAuthToken = (token?: string | null) => {
    if(token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("accessToken", token);
    } else {
        delete api.defaults.headers.common["Authorization"];
        localStorage.removeItem("accessToken");
    }
}