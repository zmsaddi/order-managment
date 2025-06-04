import { createClient } from '@supabase/supabase-js'
import { config } from '@/config'

// إنشاء دالة للحصول على عميل Supabase
let supabaseInstance = null

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      config.supabaseUrl,
      config.supabaseKey
    )
  }
  return supabaseInstance
}

// للتوافق مع الكود الحالي
export const supabase = getSupabase()
