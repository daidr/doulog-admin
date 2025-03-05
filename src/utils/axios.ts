import { useToast } from '@/composables/useToast'
import axios from 'axios'
import { API_BASE } from './env'

export const instance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

const { error } = useToast()

instance.interceptors.response.use(
  (resp) => {
    return resp
    // switch (resp.status) {
    //   case 200:
    //     // success

    //   default:
    //     if (resp.data?.msg) {
    //       // error
    //       console.log('Api error: ', resp.data.msg, resp)
    //       error({ content: resp.data.msg, duration: 2000 })
    //       return null
    //     }
    //     // error
    //     console.log('Unknown Api error: ', resp.data, resp)
    //     error({ content: '未知错误', duration: 2000 })
    // }
  },
  (err) => {
    switch (err.response?.status) {
      case 404:
        error({ content: 'API not found', duration: 2000 })
        return err.response

      case 500:
        error({ content: 'Internal server error', duration: 2000 })
        return err.response
    }

    if (err.response?.data?.msg) {
      console.log('Api error: ', err.response.data.msg, err)
      error({ content: err.response.data.msg, duration: 2000 })
      return err.response
    }

    console.log('Unexpected api error: ', err.response, err)
    error({ content: '网络错误', duration: 2000 })
    return err.response
  },
)
