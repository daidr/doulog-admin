import axios from 'axios'
import { API_BASE } from './env'
import { STORAGE_TOKEN } from '@/constants/base'

export const instance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem(STORAGE_TOKEN),
  },
})
