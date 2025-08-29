import axios from 'axios';
import toast from 'react-hot-toast';

let accessToken = "";

if(typeof window !== "undefined") {
    accessToken = localStorage.getItem("accessToken") || "";
}

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api`,
    timeout: 10_000,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
    }
});

api.interceptors.request.use((config) => {
    console.log(`Intercepted request: ${config.url}`);
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            switch (status) {
                case 400:
                    toast.error(`Bad Request: ${error.response.data}`);
                    break;
                case 401:
                    toast.error("Unauthorized - maybe token expired");
                    window.location.href = "/auth/signin";
                    break;
                case 403:
                    toast.error("Forbidden - insufficient permissions");
                    break;
                case 404:
                    toast.error(`Not Found: ${error.response.config.url}`);
                    break;
                case 409:
                    toast.error(`Conflict: ${error.response.data}`);
                    break;
                case 500:
                    toast.error("Internal Server Error");
                    break;
                default:
                    toast.error(`Unhandled error: ${status}`);
                    break;
            }
        } else if (error.request) {
            toast.error(`No response from server: ${error.request}`);
        } else {
            toast.error(`Axios setup error: ${error.message}`);
        }

        return Promise.reject(error);
    }
);

export default api;