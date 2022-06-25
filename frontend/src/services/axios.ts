import axios from 'axios';

export const backend_server_addr = 'http://localhost:9527';

export const axiosInstance = axios.create({
    baseURL: backend_server_addr,
    timeout: 20000,
});
