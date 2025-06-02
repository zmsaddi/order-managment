import { createClient } from '@supabase/supabase-js'

// إنشاء عميل Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

// إنشاء خدمة المصادقة
export const authService = {
  // تسجيل الدخول
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    // جلب بيانات المستخدم من جدول المستخدمين
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (userError) {
      // إذا لم يكن المستخدم موجوداً في جدول المستخدمين، قم بإنشائه
      // هذا يحدث عند أول تسجيل دخول للمستخدم المدير الافتراضي
      if (userError.code === 'PGRST116') {
        // التحقق من عدد المستخدمين في النظام
        const { count, error: countError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })

        if (countError) throw countError

        // إذا كان هذا أول مستخدم، اجعله مديراً عاماً
        const role = count === 0 ? 'admin' : 'representative'

        // إنشاء سجل المستخدم
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              name: data.user.email.split('@')[0], // اسم افتراضي من البريد الإلكتروني
              role: role,
              status: 'active'
            }
          ])
          .select()
          .single()

        if (createError) throw createError

        return {
          user: newUser,
          session: data.session
        }
      } else {
        throw userError
      }
    }

    return {
      user: userData,
      session: data.session
    }
  },

  // تسجيل الخروج
  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // إنشاء مستخدم جديد
  async createUser(email, password, userData) {
    // التحقق من صلاحيات المستخدم الحالي
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    if (!['admin', 'sales_manager'].includes(currentUser.role)) {
      throw new Error('ليس لديك صلاحية لإنشاء مستخدمين جدد')
    }

    // إنشاء المستخدم في نظام المصادقة باستخدام signUp بدلاً من admin.createUser
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    })

    if (error) throw error

    // إنشاء سجل المستخدم في جدول المستخدمين
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email: email,
          name: userData.name,
          role: userData.role,
          phone: userData.phone,
          address: userData.address,
          status: userData.status
        }
      ])
      .select()
      .single()

    if (userError) {
      // إذا فشل إنشاء سجل المستخدم، قم بحذف المستخدم من نظام المصادقة
      // ملاحظة: لا يمكن حذف المستخدم من واجهة المستخدم، لكن سيتم تجاهله في النظام
      throw userError
    }

    return {
      user: newUser
    }
  },

  // تحديث بيانات المستخدم
  async updateUser(userId, userData) {
    // التحقق من صلاحيات المستخدم الحالي
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    
    // التحقق من أن المستخدم الحالي هو مدير أو يقوم بتحديث بياناته الشخصية
    if (!['admin', 'sales_manager'].includes(currentUser.role) && currentUser.id !== userId) {
      throw new Error('ليس لديك صلاحية لتحديث بيانات هذا المستخدم')
    }

    // تحديث سجل المستخدم في جدول المستخدمين
    const { data, error } = await supabase
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

    return {
      user: data
    }
  },

  // حذف مستخدم
  async deleteUser(userId) {
    // التحقق من صلاحيات المستخدم الحالي
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    if (!['admin', 'sales_manager'].includes(currentUser.role)) {
      throw new Error('ليس لديك صلاحية لحذف المستخدمين')
    }

    // جلب بيانات المستخدم المراد حذفه
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    // التحقق من أن المستخدم ليس مديراً عاماً
    if (userData.role === 'admin') {
      throw new Error('لا يمكن حذف المدير العام')
    }

    // التحقق من أن مدير المبيعات لا يحاول حذف مدير مبيعات آخر
    if (currentUser.role === 'sales_manager' && userData.role === 'sales_manager') {
      throw new Error('لا يمكن لمدير المبيعات حذف مدير مبيعات آخر')
    }

    // حذف سجل المستخدم من جدول المستخدمين
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) throw error

    // ملاحظة: لا يمكن حذف المستخدم من نظام المصادقة من واجهة المستخدم
    // يمكن للمدير حذفه يدوياً من لوحة تحكم Supabase إذا لزم الأمر

    return { success: true }
  },

  // إعادة تعيين كلمة المرور
  async resetPassword(email) {
    // إرسال رابط إعادة تعيين كلمة المرور
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) throw error

    return { success: true }
  },

  // تغيير كلمة المرور
  async changePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error

    return { success: true }
  },

  // التحقق من حالة المصادقة
  async checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { user: null, session: null }
    }

    // جلب بيانات المستخدم من جدول المستخدمين
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error) {
      // إذا لم يكن المستخدم موجوداً في جدول المستخدمين، قم بتسجيل الخروج
      await this.logout()
      return { user: null, session: null }
    }

    return {
      user: userData,
      session
    }
  },

  // إنشاء المستخدم المدير الافتراضي
  async createDefaultAdmin() {
    // التحقق من عدد المستخدمين في النظام
    const { count, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (countError) throw countError

    // إذا كان هناك مستخدمين بالفعل، لا تقم بإنشاء المدير الافتراضي
    if (count > 0) {
      return { success: false, message: 'يوجد مستخدمين بالفعل في النظام' }
    }

    // إنشاء المستخدم المدير الافتراضي باستخدام signUp
    const { data, error } = await supabase.auth.signUp({
      email: 'msaddizakariya@gmail.com',
      password: 'Spain@2025',
      options: {
        emailRedirectTo: window.location.origin
      }
    })

    if (error) throw error

    // إنشاء سجل المستخدم في جدول المستخدمين
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email: 'msaddizakariya@gmail.com',
          name: 'مدير النظام',
          role: 'admin',
          status: 'active'
        }
      ])
      .select()
      .single()

    if (userError) {
      throw userError
    }

    return {
      success: true,
      user: newUser
    }
  }
}
