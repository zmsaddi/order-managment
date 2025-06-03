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
  async createUser(userData) {
    // التحقق من صلاحيات المستخدم الحالي
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    if (!['admin', 'sales_manager'].includes(currentUser.role)) {
      throw new Error('ليس لديك صلاحية لإنشاء مستخدمين جدد')
    }

    try {
      const email = userData.email;
      const password = userData.password;
      
      // استخدام signUp مباشرة لإنشاء المستخدم
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            email: email
          }
        }
      })

      if (signUpError) throw signUpError

      // إنشاء سجل المستخدم في جدول المستخدمين
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: signUpData.user.id,
            email: email,
            name: userData.name,
            role: userData.role,
            phone: userData.phone,
            address: userData.address,
            status: userData.status || 'active'
          }
        ])
        .select()
        .single()

      if (userError) throw userError

      // إزالة محاولة تفعيل المستخدم تلقائياً لأن وظيفة RPC غير متوفرة
      // تم إزالة استدعاء confirm_user لأنه يسبب خطأ 404

      // تحديث قائمة المستخدمين في الواجهة
      return {
        user: newUser
      }
    } catch (error) {
      console.error('خطأ في إنشاء المستخدم:', error)
      throw error
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

    // حذف سجل المستخدم من جدول المستخدمين فقط
    // ملاحظة: لا يمكننا حذف المستخدم من نظام المصادقة لأننا لا نملك صلاحيات admin
    // يجب حذف المستخدم يدوياً من لوحة تحكم Supabase إذا لزم الأمر
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) throw error

    return { success: true, message: 'تم حذف المستخدم من النظام. لحذفه بشكل كامل من نظام المصادقة، يرجى استخدام لوحة تحكم Supabase.' }
  },

  // إعادة تعيين كلمة المرور
  async resetPassword(userId, newPassword) {
    // التحقق من صلاحيات المستخدم الحالي
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    if (!['admin', 'sales_manager'].includes(currentUser.role)) {
      throw new Error('ليس لديك صلاحية لإعادة تعيين كلمات المرور')
    }

    // إعادة تعيين كلمة المرور
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    )

    if (error) throw error

    return { success: true }
  },
  
  // تحديث كلمة مرور المستخدم
  async updateUserPassword(userId, newPassword) {
    // التحقق من صلاحيات المستخدم الحالي
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    if (!['admin', 'sales_manager'].includes(currentUser.role)) {
      throw new Error('ليس لديك صلاحية لتحديث كلمات المرور')
    }

    // التحقق من طول كلمة المرور
    if (newPassword.length < 6) {
      throw new Error('يجب أن تكون كلمة المرور 6 أحرف على الأقل')
    }

    try {
      // تحديث كلمة المرور باستخدام API المناسبة
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { password: newPassword }
      )

      if (error) throw error

      return { success: true, error: null }
    } catch (error) {
      console.error('خطأ في تحديث كلمة المرور:', error)
      return { success: false, error }
    }
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

    // إنشاء المستخدم المدير الافتراضي
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'msaddizakariya@gmail.com',
      password: 'Spain@2025',
      email_confirm: true
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
      // إذا فشل إنشاء سجل المستخدم، قم بحذف المستخدم من نظام المصادقة
      await supabase.auth.admin.deleteUser(data.user.id)
      throw userError
    }

    return {
      success: true,
      user: newUser
    }
  }
}
