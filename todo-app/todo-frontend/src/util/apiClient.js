import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:80/api/',
})
console.log("backend url:" + import.meta.env.VITE_BACKEND_URL)

export default apiClient