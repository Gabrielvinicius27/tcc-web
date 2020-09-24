// Serviço de configuração da API
import axios from 'axios';
import {getToken} from "./auth"

// URL da API
const api = axios.create({
    baseURL: "https://estoque-inteligente-cefsa.herokuapp.com"
});

// Autorização da API para consultas restritas da API
api.interceptors.request.use(async config =>{
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Exporta a API para ser utilizada posteriormente
export default api;