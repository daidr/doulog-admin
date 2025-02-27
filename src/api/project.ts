import { instance } from '@/utils/axios'

export interface ProjCatInfo {
  id: number
  label: string
  desc: string
}

export async function getProjCatInfo(cid: number | string): Promise<ProjCatInfo | false> {
  const result = await instance.get<ProjCatInfo>(`/api/x/project/cat/${cid}`)

  if (!result) {
    return false
  }

  return result.data
}

export async function getProjCatList(props: {
  keyword?: string
  page?: number
  size?: number
} = {}): Promise<{
  total: number
  list: ProjCatInfo[]
} | false> {
  const { keyword, page = 1, size = 10 } = props

  const result = await instance.get('/api/x/project/cat/list', {
    params: {
      keyword,
      page,
      page_size: size,
    },
  })

  if (!result || !result.data) {
    return false
  }

  return {
    total: result.data.total,
    list: result.data.list,
  }
}

export async function createProjCat(cat: Omit<ProjCatInfo, 'id'>): Promise<boolean> {
  const result = await instance.post('/api/x/project/cat', cat)

  if (!result) {
    return false
  }

  return true
}

export async function updateProjCat(cid: number, tag: Omit<ProjCatInfo, 'id'>): Promise<boolean> {
  const result = await instance.put(`/api/x/project/cat/${cid}`, tag)

  if (!result) {
    return false
  }

  return true
}
