import { instance } from "@/utils/axios";

export interface UserInfo {
  id: number
  name: string
  email: string
  emailHash: string
  homepage: string
  isAdmin: boolean
  isBanned: boolean
  motto?: string
  createdAt: number
}

export type UserInfoWithLogged = UserInfo & {
  isLogged: true
} | {
  isLogged: false
}

export async function getSelfUserInfo(): Promise<UserInfoWithLogged> {
  const result = await instance.get<UserInfo>('/api/x/user')
  if (result.data.id === 0) {
    return {
      isLogged: false
    }
  }

  return {
    isLogged: true,
    ...result.data
  }
}

export async function getUserInfo(uid: number | string): Promise<UserInfo | false> {
  const result = await instance.get<UserInfo>(`/api/x/user/${uid}`)

  if (!result) {
    return false;
  }

  return result.data
}


export async function updateSelfUsername(name: string): Promise<boolean> {
  const result = await instance.put('/api/x/user/name', {
    name
  })

  if (!result) {
    return false;
  }

  return true;
}

export async function updateUsername(uid: number, name: string): Promise<boolean> {
  const result = await instance.put(`/api/x/user/name/${uid}`, {
    name
  })

  if (!result) {
    return false;
  }

  return true;
}

export async function updateEmail(uid: number, email: string): Promise<boolean> {
  const result = await instance.put(`/api/x/user/email/${uid}`, {
    email
  })

  if (!result) {
    return false;
  }

  return true;
}

export async function updateHomepage(uid: number, homepage: string): Promise<boolean> {
  const result = await instance.put(`/api/x/user/homepage/${uid}`, {
    homepage
  })

  if (!result) {
    return false;
  }

  return true;
}

export async function updateMotto(uid: number, motto: string): Promise<boolean> {
  const result = await instance.put(`/api/x/user/motto/${uid}`, {
    motto
  })

  if (!result) {
    return false;
  }

  return true;
}

export async function getUserList(props: {
  keyword?: string,
  page?: number,
  size?: number
} = {}): Promise<{
  total: number,
  list: UserInfo[]
} | false> {
  const { keyword, page = 1, size = 10 } = props;

  const result = await instance.get('/api/x/user/list', {
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
