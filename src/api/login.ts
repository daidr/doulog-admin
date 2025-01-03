import type { CredentialCreationOptionsJSON, CredentialRequestOptionsJSON } from '@github/webauthn-json/browser-ponyfill'
import { instance } from '@/utils/axios'

export async function pwLogin(email: string, password: string): Promise<string | false> {
  const result = await instance.post<string>('/api/x/auth/login/password', {
    email,
    password,
  })

  if (!result) {
    return false
  }

  const token = result.data

  return token || false
}

export async function getWebAuthnRegOptions(): Promise<CredentialCreationOptionsJSON | false> {
  const result = await instance.post<CredentialCreationOptionsJSON>('/api/x/auth/webauthn/reg/options')

  if (!result) {
    return false
  }

  return result.data
}

export async function finishWebAuthnReg(challenge: string, data: any): Promise<boolean> {
  const result = await instance.post<boolean>('/api/x/auth/webauthn/reg/finish', {
    challenge,
    data,
  })

  if (!result) {
    return false
  }

  return true
}

export interface WebAuthnCredentialItem {
  id: string
  label: string
  createdAt: number
  lastUsedAt: number
  synced: boolean
}

export async function listWebAuthnCredentials(): Promise<WebAuthnCredentialItem[] | false> {
  const result = await instance.post<WebAuthnCredentialItem[]>('/api/x/auth/webauthn/credentials')

  if (!result) {
    return false
  }

  return result.data
}

export async function removeWebAuthnCredential(id: string): Promise<boolean> {
  const result = await instance.post<boolean>('/api/x/auth/webauthn/credentials/remove', {
    id,
  })

  if (!result) {
    return false
  }

  return true
}

export async function renameWebAuthnCredential(id: string, label: string): Promise<boolean> {
  const result = await instance.post<boolean>('/api/x/auth/webauthn/credentials/rename', {
    id,
    label,
  })

  if (!result) {
    return false
  }

  return true
}

export async function getWebAuthnDiscoverLoginOptions(): Promise<CredentialRequestOptionsJSON | false> {
  const result = await instance.post<CredentialRequestOptionsJSON>('/api/x/auth/webauthn/login/discover')

  if (!result) {
    return false
  }

  return result.data
}

export async function webauthnLogin(challenge: string, data: any): Promise<string | false> {
  const result = await instance.post<string>('/api/x/auth/webauthn/login/assertion', {
    challenge,
    data,
  })

  if (!result) {
    return false
  }

  const token = result.data

  return token || false
}
