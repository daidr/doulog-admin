import axios from 'axios'
import { API_BASE } from './env'
import { STORAGE_TOKEN } from '@/constants/base'

export const instance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

instance.interceptors.request.use((config) => {
  config.headers['authorization'] = `Bearer ${localStorage.getItem(STORAGE_TOKEN)}`
  return config
})

instance.interceptors.response.use(
  (resp) => {
    switch (resp.data.code) {
      case 0:
        // success
        return resp.data
      default:
        // error
        console.log("Api error: ", resp.data.msg, resp)
    }
  },
  (err) => {
    console.log("Unexpected api error: ", err.response, err)
    return Promise.reject(err)
  }
)
