import { instance } from "@/utils/axios";

interface UserInfoDTO {
  id: number
  name: string
  email: string
  email_hash: string
  homepage: string
  is_admin: boolean
  is_banned: boolean
  motto?: string
  created_at: number
}

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

function userDTO2User(dto: UserInfoDTO): UserInfo {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    emailHash: dto.email_hash,
    homepage: dto.homepage,
    motto: dto.motto,
    isAdmin: dto.is_admin,
    isBanned: dto.is_banned,
    createdAt: dto.created_at
  }
}

export async function getSelfUserInfo(): Promise<UserInfoWithLogged> {
  const result = await instance.get<UserInfoDTO>('/api/x/user/v1')
  if (result.data.id === 0) {
    return {
      isLogged: false
    }
  }

  return {
    isLogged: true,
    ...userDTO2User(result.data)
  }
}

export async function getUserInfo(uid: number | string): Promise<UserInfo | false> {
  const result = await instance.get<UserInfoDTO>(`/api/x/user/v1/${uid}`)

  if (!result) {
    return false;
  }

  return userDTO2User(result.data)
}


export async function updateSelfUsername(name: string): Promise<boolean> {
  const result = await instance.put('/api/x/user/v1/name', {
    name
  })

  if (!result) {
    return false;
  }

  return true;
}

export async function updateUsername(uid: number, name: string): Promise<boolean> {
  const result = await instance.put(`/api/x/user/v1/name/${uid}`, {
    name
  })

  if (!result) {
    return false;
  }

  return true;
}

export async function updateEmail(uid: number, email: string): Promise<boolean> {
  const result = await instance.put(`/api/x/user/v1/email/${uid}`, {
    email
  })

  if (!result) {
    return false;
  }

  return true;
}

export async function updateHomepage(uid: number, homepage: string): Promise<boolean> {
  const result = await instance.put(`/api/x/user/v1/homepage/${uid}`, {
    homepage
  })

  if (!result) {
    return false;
  }

  return true;
}

export async function updateMotto(uid: number, motto: string): Promise<boolean> {
  const result = await instance.put(`/api/x/user/v1/motto/${uid}`, {
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

  const result = await instance.get('/api/x/user/v1/list', {
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
    list: result.data.list.map(userDTO2User)
  }
}
