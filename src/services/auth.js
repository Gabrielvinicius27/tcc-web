// Serviço de autentificação de usuários

export const TOKEN_KEY = "@login-Token";
// Verifica se está autenticado, os tokens ficam gravados no localStorage do navegador.
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
// Pega o token
export const getToken = () => localStorage.getItem(TOKEN_KEY);
// Grava o token
export const login = token => {
  localStorage.setItem(TOKEN_KEY, token);
};
// Remove o token
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};