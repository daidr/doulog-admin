import { instance } from '@/utils/axios'

export interface TagInfo {
  id: number
  label: string
  slug: string
  color: string
}

export async function getTagInfo(tid: number | string): Promise<TagInfo | false> {
  const result = await instance.get<TagInfo>(`/api/x/tag/${tid}`)

  if (!result) {
    return false
  }

  return result.data
}

// export async function updateMotto(uid: number, motto: string): Promise<boolean> {
//   const result = await instance.put(`/api/x/user/motto/${uid}`, {
//     motto,
//   })

//   if (!result) {
//     return false
//   }

//   return true
// }

export async function getTagList(props: {
  keyword?: string
  page?: number
  size?: number
} = {}): Promise<{
  total: number
  list: TagInfo[]
} | false> {
  const { keyword, page = 1, size = 10 } = props

  const result = await instance.get('/api/x/tag/list', {
    params: {
      keyword,
      page,
      page_size: size,
    },
  })

  if (!result) {
    return false
  }

  return {
    total: result.data.total,
    list: result.data.list,
  }
}

export async function createTag(tag: Omit<TagInfo, 'id'>): Promise<boolean> {
  const result = await instance.post('/api/x/tag', tag)

  if (!result) {
    return false
  }

  return true
}

export async function updateTag(tid: number, tag: Omit<TagInfo, 'id'>): Promise<boolean> {
  const result = await instance.put(`/api/x/tag/${tid}`, tag)

  if (!result) {
    return false
  }

  return true
}
