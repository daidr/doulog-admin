import { instance } from "@/utils/axios";
import { type UserInfo } from "./user";


export interface MediaInfo {
  id: number
  ext: string
  etag: string
  title: string
  mime: string
  alt: string
  width: number
  height: number
  extra: {
    original: number
    thumbnail: number
  }
  prominentColor: string[]
}

export interface MediaInfoWithOwner extends MediaInfo {
  owner: UserInfo
}

export async function getMediaList(props: {
  keyword?: string,
  page?: number,
  size?: number
} = {}): Promise<{
  total: number,
  list: MediaInfo[]
} | false> {
  const { keyword, page = 1, size = 10 } = props;

  const result = await instance.get('/api/x/media/list', {
    params: {
      keyword,
      page,
      page_size: size,
    }
  })

  if (!result) {
    return false;
  }

  return {
    total: result.data.total,
    list: result.data.list
  }
}
