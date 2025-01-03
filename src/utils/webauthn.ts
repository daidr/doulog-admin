interface WebAuthnErrorItem {
  fallback?: string
  msg?: {
    raw: string
    text: string
  }[]
}

export const WebAuthnErrorMap: Record<string, WebAuthnErrorItem> = {
  NotAllowedError: {
    fallback: '操作被拒绝：未知错误',
    msg: [
      {
        raw: 'The operation either timed out or was not allowed.',
        text: '操作超时/被取消',
      },
      {
        raw: 'The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.',
        text: '操作超时/被取消',
      },
    ],
  },
  InvalidStateError: {
    fallback: '状态异常：未知错误',
    msg: [
      {
        raw: 'The user attempted to register an authenticator that contains one of the credentials already registered with the relying party.',
        text: '该设备已经注册过',
      },
    ],
  },
}

export function getWebAuthnToastTextByError(err: Error): string {
  const errName = err.name
  const errMsg = err.message
  console.log('errName', errName)
  console.log('errMsg', errMsg)

  if (WebAuthnErrorMap[errName]) {
    const errMap = WebAuthnErrorMap[errName]
    if (!errMap.msg) {
      return errMap.fallback || '未知错误'
    }
    for (let i = 0; i < errMap.msg.length; i++) {
      if (errMsg.includes(errMap.msg[i].raw)) {
        return errMap.msg[i].text
      }
    }
    return errMap.fallback || '未知错误'
  }

  return '未知错误'
}
