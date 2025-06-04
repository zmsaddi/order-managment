import { createClient } from '@supabase/supabase-js'
import { config } from '@/config'

// إنشاء عميل Supabase موحد مع خيارات متقدمة
export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseKey,
  {
    auth: {
      autoRefreshToken: true,  // يجدد التوكين دون تدخّل
      persistSession: true,    // يُخزِّن الجلسة في IndexedDB افتراضيًّا
      detectSessionInUrl: true
    },
  }
)
