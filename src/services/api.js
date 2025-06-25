import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3000/api'
  baseURL: 'https://casamento-backend-y3xx.onrender.com/api',
});

export default api;
