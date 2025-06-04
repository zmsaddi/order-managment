import { createClient } from '@supabase/supabase-js'
import { config } from '@/config'

// إنشاء دالة للحصول على عميل Supabase مع معالجة أخطاء الاتصال
let supabaseInstance = null

export const getSupabase = () => {
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(
        config.supabaseUrl,
        config.supabaseKey,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          },
          global: {
            // إضافة خيارات إعادة المحاولة عند فشل الاتصال
            fetch: (url, options) => {
              return fetch(url, {
                ...options,
                // إضافة timeout لتجنب الانتظار الطويل عند فشل الاتصال
                signal: AbortSignal.timeout(30000) // 30 ثانية كحد أقصى
              }).catch(error => {
                console.error('خطأ في الاتصال بـ Supabase:', error)
                // إعادة رمي الخطأ مع معلومات إضافية للمستخدم
                throw new Error(`فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت الخاص بك والمحاولة مرة أخرى. (${error.message})`)
              })
            }
          }
        }
      )
    } catch (error) {
      console.error('خطأ في إنشاء عميل Supabase:', error)
      // إنشاء عميل احتياطي بدون خيارات إضافية في حالة فشل الإنشاء مع الخيارات المتقدمة
      supabaseInstance = createClient(config.supabaseUrl, config.supabaseKey)
    }
  }
  return supabaseInstance
}

// للتوافق مع الكود الحالي
export const supabase = getSupabase()

// دالة للتحقق من حالة الاتصال بـ Supabase
export const checkSupabaseConnection = async () => {
  try {
    // محاولة إجراء عملية بسيطة للتحقق من الاتصال
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('خطأ في الاتصال بـ Supabase:', error)
      return {
        connected: false,
        error: error.message
      }
    }
    
    return {
      connected: true,
      data
    }
  } catch (error) {
    console.error('خطأ في التحقق من الاتصال بـ Supabase:', error)
    return {
      connected: false,
      error: error.message
    }
  }
}

// دالة لإعادة المحاولة عند فشل العمليات
export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      console.warn(`فشلت المحاولة ${i + 1} من ${maxRetries}:`, error)
      lastError = error
      
      // انتظار قبل إعادة المحاولة
      await new Promise(resolve => setTimeout(resolve, delay))
      
      // زيادة وقت الانتظار تدريجياً
      delay *= 2
    }
  }
  
  throw lastError
}
