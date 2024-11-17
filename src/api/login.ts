import { instance } from "@/utils/axios";
import type { CredentialCreationOptionsJSON } from "@github/webauthn-json/browser-ponyfill";

export async function pwLogin(email: string, password: string): Promise<string | false> {
  const result = await instance.post<string>('/api/x/auth/login/password', {
    email,
    password
  })

  if (!result) {
    return false;
  }

  const token = result.data;

  return token ? token : false;
}

export async function getWebAuthnRegOptions(): Promise<CredentialCreationOptionsJSON | false> {
  const result = await instance.post<CredentialCreationOptionsJSON>('/api/x/auth/webauthn/reg/options')

  if (!result) {
    return false;
  }

  return result.data;
}

export async function finishWebAuthnReg(challenge: string, data: any): Promise<boolean> {
  const result = await instance.post<boolean>('/api/x/auth/webauthn/reg/finish', {
    challenge,
    data
  })

  if (!result) {
    return false;
  }

  return true;
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
    return false;
  }

  return result.data;
}
