import type { app } from '@/api/elysia'
import type { ElysiaResp } from '@/utils/elysia.util'

type SettingResp = ElysiaResp<typeof app.api.setting.get>
export type SettingItem = SettingResp['settings'][number]['items'][number]
