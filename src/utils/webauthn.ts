export function getWebAuthnToastTextByError(err: Error): string {
  if (err.name === 'NotAllowedError') {
    return '操作超时/被取消';
  }

  return '未知错误';
}
