import { useToast } from '@/composables/useToast'
import { STORAGE_TOKEN } from '@/constants/base'
import axios from 'axios'
import { API_BASE } from './env'

export const instance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

instance.interceptors.request.use((config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem(STORAGE_TOKEN)}`
  return config
})

const { error } = useToast()

instance.interceptors.response.use(
  (resp) => {
    switch (resp.data.code) {
      case 0:
        // success
        return resp.data
      case -2:
        // invalid parameters
        error({ content: '参数不合法', duration: 2000 })
        break
      case 101003:
        // email not found
        error({ content: '邮箱不存在', duration: 2000 })
        break
      case 101004:
        // password incorrect
        error({ content: '密码错误', duration: 2000 })
        break
      case 101005:
        // Failed to create webauthn challenge
        error({ content: '创建挑战出现错误', duration: 2000 })
        break
      case 101006:
        // Failed to finish webauthn verification
        error({ content: '凭证挑战验证失败', duration: 2000 })
        break
      case 101007:
        // Credential not found
        error({ content: '凭证不存在', duration: 2000 })
        break
      default:
        // error
        console.log('Api error: ', resp.data.msg, resp)
        error({ content: resp.data.msg, duration: 2000 })
    }
  },
  (err) => {
    console.log('Unexpected api error: ', err.response, err)
    error({ content: '网络错误', duration: 2000 })
    return false
  },
)
