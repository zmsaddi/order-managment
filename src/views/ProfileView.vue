<template><div>
</div></template>
<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { supabase } from '@/services/supabase'

export default {
  name: 'ProfileView',
  setup() {
    const user = ref({})
    const loading = ref(true)
    const error = ref('')
    const success = ref('')
    const showPasswordFields = ref(false)
    
    const form = reactive({
      name: '',
      email: '',
      phone: '',
      address: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    // الحصول على الأحرف الأولى من اسم المستخدم
    const userInitials = computed(() => {
      if (!user.value.name) return '؟'
      return user.value.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    })
    
    // جلب بيانات المستخدم
    const fetchUserData = async () => {
      loading.value = true
      error.value = ''
      success.value = ''
      
      try {
        // جلب بيانات جلسة المستخدم
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          loading.value = false
          return
        }
        
        // جلب بيانات المستخدم من جدول المستخدمين
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (fetchError) throw fetchError
        
        user.value = data
        
        // تعبئة نموذج التعديل
        form.name = data.name || ''
        form.email = data.email || ''
        form.phone = data.phone || ''
        form.address = data.address || ''
      } catch (err) {
        console.error('خطأ في جلب بيانات المستخدم:', err)
        error.value = 'حدث خطأ أثناء جلب بيانات المستخدم'
      } finally {
        loading.value = false
      }
    }
    
    // تحديث الملف الشخصي
    const updateProfile = async () => {
      loading.value = true
      error.value = ''
      success.value = ''
      
      try {
        // التحقق من تطابق كلمات المرور
        if (showPasswordFields.value) {
          if (form.newPassword !== form.confirmPassword) {
            error.value = 'كلمة المرور الجديدة وتأكيدها غير متطابقين'
            loading.value = false
            return
          }
          
          // تغيير كلمة المرور
          const { error: passwordError } = await supabase.auth.updateUser({
            password: form.newPassword
          })
          
          if (passwordError) throw passwordError
        }
        
        // تحديث بيانات المستخدم
        const { error: updateError } = await supabase
          .from('users')
          .update({
            name: form.name,
            phone: form.phone,
            address: form.address,
            updated_at: new Date()
          })
          .eq('id', user.value.id)
        
        if (updateError) throw updateError
        
        // تحديث البيانات المحلية
        user.value = {
          ...user.value,
          name: form.name,
          phone: form.phone,
          address: form.address
        }
        
        // إعادة تعيين حقول كلمة المرور
        if (showPasswordFields.value) {
          form.currentPassword = ''
          form.newPassword = ''
          form.confirmPassword = ''
          showPasswordFields.value = false
        }
        
        success.value = 'تم تحديث الملف الشخصي بنجاح'
      } catch (err) {
        console.error('خطأ في تحديث الملف الشخصي:', err)
        error.value = 'حدث خطأ أثناء تحديث الملف الشخصي'
      } finally {
        loading.value = false
      }
    }
    
    // الحصول على نص الدور
    const getRoleText = (role) => {
      const roleMap = {
        'admin': 'مدير عام',
        'sales_manager': 'مدير مبيعات',
        'representative': 'مندوب مبيعات'
      }
      return roleMap[role] || role
    }
    
    // جلب بيانات المستخدم عند تحميل الصفحة
    onMounted(() => {
      fetchUserData()
    })
    
    return {
      user,
      loading,
      error,
      success,
      form,
      showPasswordFields,
      userInitials,
      updateProfile,
      getRoleText
    }
  }
}
</script>

