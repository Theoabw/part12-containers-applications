import axios from 'axios'
import {backendUrl} from "../utils/config.js";
const baseUrl = backendUrl + '/login'

const login = async credentials => {
    const response = await axios.post(baseUrl, credentials)
    return response.data
}

export default { login }