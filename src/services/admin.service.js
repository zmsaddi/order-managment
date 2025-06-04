import { createClient } from '@supabase/supabase-js'
import { config } from '@/config.js'

// إنشاء عميل Supabase منفصل للعمليات الإدارية
// هذا العميل لن يؤثر على جلسة المستخدم الحالي
const supabaseUrl = config.supabaseUrl
const supabaseKey = config.supabaseServiceKey || config.supabaseKey
export const adminSupabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// خدمة إدارة المستخدمين المنفصلة عن خدمة المصادقة
export const adminService = {
  // إنشاء مستخدم جديد بدون التأثير على جلسة المستخدم الحالي
  async createUser(userData) {
    try {
      // إنشاء المستخدم في نظام المصادقة
      const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          role: userData.role
        }
      })

      if (authError) throw authError

      // إنشاء سجل المستخدم في جدول المستخدمين
      const { data: userData2, error: userError } = await adminSupabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            phone: userData.phone,
            address: userData.address,
            status: userData.status || 'active'
          }
        ])
        .select()
        .single()

      if (userError) {
        // إذا فشل إنشاء سجل المستخدم، قم بحذف المستخدم من نظام المصادقة
        await adminSupabase.auth.admin.deleteUser(authData.user.id)
        throw userError
      }

      return {
        user: userData2
      }
    } catch (error) {
      console.error('خطأ في إنشاء المستخدم:', error)
      throw error
    }
  },

  // تحديث بيانات المستخدم
  async updateUser(userId, userData) {
    try {
      // تحديث سجل المستخدم في جدول المستخدمين
      const { data, error } = await adminSupabase
        .from('users')
        .update({
          name: userData.name,
          role: userData.role,
          phone: userData.phone,
          address: userData.address,
          status: userData.status,
          updated_at: new Date()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      // إذا تم تحديث كلمة المرور
      if (userData.password) {
        // التحقق من طول كلمة المرور
        if (userData.password.length < 6) {
          throw new Error('يجب أن تكون كلمة المرور 6 أحرف على الأقل')
        }

        // تحديث كلمة المرور
        const { error: passwordError } = await adminSupabase.auth.admin.updateUserById(
          userId,
          { password: userData.password }
        )

        if (passwordError) throw passwordError
      }

      return {
        user: data
      }
    } catch (error) {
      console.error('خطأ في تحديث المستخدم:', error)
      throw error
    }
  },

  // حذف مستخدم
  async deleteUser(userId) {
    try {
      // حذف سجل المستخدم من جدول المستخدمين
      const { error } = await adminSupabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) throw error

      // حذف المستخدم من نظام المصادقة
      const { error: authError } = await adminSupabase.auth.admin.deleteUser(userId)

      if (authError) {
        console.warn('تم حذف المستخدم من جدول المستخدمين ولكن فشل حذفه من نظام المصادقة:', authError)
      }

      return { success: true }
    } catch (error) {
      console.error('خطأ في حذف المستخدم:', error)
      throw error
    }
  },

  // جلب قائمة المستخدمين
  async getUsers() {
    try {
      const { data, error } = await adminSupabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data
    } catch (error) {
      console.error('خطأ في جلب المستخدمين:', error)
      throw error
    }
  }
}
