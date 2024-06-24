import { createClient } from 'supabase-wechat-stable-v2'

const url = process.env.TARO_APP_SUPABASE_API_URL || ""
const key = process.env.TARO_APP_SUPABASE_API_KEY || ""

export const supabase = createClient(url, key)