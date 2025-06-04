/**
 * وحدة إدارة الجلسات
 * تتضمن دوال مساعدة للتعامل مع بيانات الجلسة والمستخدم
 */

// دالة لحفظ بيانات المستخدم الحالي
export const backupUserData = () => {
  const userData = localStorage.getItem('user')
  if (userData) {
    localStorage.setItem('user_backup', userData)
    return JSON.parse(userData)
  }
  return null
}

// دالة لاستعادة بيانات المستخدم المحفوظة
export const restoreUserData = () => {
  const backupData = localStorage.getItem('user_backup')
  if (backupData) {
    localStorage.setItem('user', backupData)
    localStorage.removeItem('user_backup')
    return JSON.parse(backupData)
  }
  return null
}

// دالة للتحقق من صلاحيات المستخدم
export const verifyUserPermissions = (requiredRoles = ['admin', 'sales_manager']) => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  return requiredRoles.includes(userData.role)
}

// دالة لتحديث بيانات المستخدم في localStorage
export const updateUserData = (userData) => {
  if (userData) {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    
    // تحديث البيانات مع الاحتفاظ بالهوية
    if (currentUser.id === userData.id) {
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        ...userData
      }))
      return true
    }
  }
  return false
}

// دالة لمسح بيانات الجلسة
export const clearSessionData = (projectId) => {
  localStorage.removeItem('user')
  localStorage.removeItem('user_backup')
  
  // مسح توكن Supabase
  if (projectId) {
    localStorage.removeItem(`sb-${projectId}-auth-token`)
  } else {
    // محاولة مسح جميع توكنات Supabase المحتملة
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
        localStorage.removeItem(key)
      }
    })
  }
}

// دالة للحصول على بيانات المستخدم الحالي
export const getCurrentUser = () => {
  const userData = localStorage.getItem('user')
  return userData ? JSON.parse(userData) : null
}
