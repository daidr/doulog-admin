import { instance } from "@/utils/axios";

 interface UserInfoDTO {
  id: number
  name: string
  email: string
  email_hash: string
  is_admin: boolean
  is_banned: boolean
}

export interface UserInfo {
  id: number
  name: string
  email: string
  emailHash: string
  isAdmin: boolean
  isBanned: boolean
}

export type UserInfoWithLogged = UserInfo & {
  isLogged: true
} | {
  isLogged: false
}

export async function getSelfUserInfo(): Promise<UserInfoWithLogged> {
  const result = await instance.get<UserInfoDTO>('/api/x/user/v1/me')
  if (result.data.id === 0) {
    return {
      isLogged: false
    }
  }

  return {
    isLogged: true,
    id: result.data.id,
    name: result.data.name,
    email: result.data.email,
    emailHash: result.data.email_hash,
    isAdmin: result.data.is_admin,
    isBanned: result.data.is_banned
  }
}
