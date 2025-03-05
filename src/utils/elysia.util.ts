export type ElysiaResp<Func extends (...args: any[]) => any> = Exclude<Awaited<ReturnType<Func>>['data'], null>
