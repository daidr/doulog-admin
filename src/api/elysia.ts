import type { DouLogElysiaBackend } from '@server/index'
import { STORAGE_TOKEN } from '@/constants/base'
import { API_BASE } from '@/utils/env'
import { treaty } from '@elysiajs/eden'

let token = localStorage.getItem(STORAGE_TOKEN)

const { error } = useToast()

window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_TOKEN) {
    token = e.newValue
  }
})

// @ts-expect-error 由于跨项目引入，类型错误，之后要改成monorepo
export const app = treaty<DouLogElysiaBackend>(API_BASE, {
  headers() {
    return {
      authorization: token ?? undefined,
    }
  },
  async fetcher(url, options) {
    const response = await fetch(url, options)

    if (response.status === 200) {
      return response
    }

    // if response is json
    if (response.headers.get('content-type')?.includes('application/json')) {
      try {
        const result = await response.clone().json()
        if (result?.msg) {
          error({ content: result.msg, duration: 2000 })
        }
      } catch (err) {
        console.log('Unknown Fetch Runtime error: ', response, err)
        error({ content: '未知错误', duration: 2000 })
      }
    }

    return response
  },
})
