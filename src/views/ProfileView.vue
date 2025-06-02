<template>
  <div class="min-h-screen bg-gray-50">
    <!-- قالب الملف الشخصي -->
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-sky-700 mb-6 text-center">الملف الشخصي</h1>
        
        <!-- معلومات المستخدم -->
        <div class="mb-8">
          <div class="flex flex-col items-center mb-6">
            <div class="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mb-4">
              <span class="text-4xl text-sky-600">{{ userInitials }}</span>
            </div>
            <h2 class="text-xl font-semibold text-gray-800">{{ user.name || 'المستخدم' }}</h2>
            <p class="text-gray-600">{{ getRoleText(user.role) }}</p>
          </div>
          
          <div v-if="loading" class="text-center py-4">
            <p>جاري تحميل البيانات...</p>
          </div>
          
          <form v-else @submit.prevent="updateProfile" class="max-w-lg mx-auto">
            <!-- الاسم -->
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2 text-center" for="name">
                الاسم
              </label>
              <input
                type="text"
                id="name"
                v-model="form.name"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                required
              />
            </div>
            
            <!-- البريد الإلكتروني -->
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2 text-center" for="email">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center bg-gray-100"
                readonly
              />
            </div>
            
            <!-- رقم الهاتف -->
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2 text-center" for="phone">
                رقم الهاتف
              </label>
              <input
                type="tel"
                id="phone"
                v-model="form.phone"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
              />
            </div>
            
            <!-- العنوان -->
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2 text-center" for="address">
                العنوان
              </label>
              <textarea
                id="address"
                v-model="form.address"
                rows="3"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
              ></textarea>
            </div>
            
            <!-- تغيير كلمة المرور -->
            <div class="mb-6">
              <div class="flex items-center justify-center">
                <input
                  type="checkbox"
                  id="change-password"
                  v-model="showPasswordFields"
                  class="mr-2"
                />
                <label class="text-gray-700 text-sm font-bold" for="change-password">
                  تغيير كلمة المرور
                </label>
              </div>
            </div>
            
            <!-- حقول كلمة المرور -->
            <div v-if="showPasswordFields">
              <!-- كلمة المرور الحالية -->
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2 text-center" for="current-password">
                  كلمة المرور الحالية
                </label>
                <input
                  type="password"
                  id="current-password"
                  v-model="form.currentPassword"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                  required
                />
              </div>
              
              <!-- كلمة المرور الجديدة -->
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2 text-center" for="new-password">
                  كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  id="new-password"
                  v-model="form.newPassword"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                  required
                />
              </div>
              
              <!-- تأكيد كلمة المرور الجديدة -->
              <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2 text-center" for="confirm-password">
                  تأكيد كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  v-model="form.confirmPassword"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                  required
                />
              </div>
            </div>
            
            <!-- رسالة الخطأ -->
            <div v-if="error" class="mb-4 text-center">
              <p class="text-red-500">{{ error }}</p>
            </div>
            
            <!-- رسالة النجاح -->
            <div v-if="success" class="mb-4 text-center">
              <p class="text-green-500">{{ success }}</p>
            </div>
            
            <!-- أزرار الإجراءات -->
            <div class="flex items-center justify-center">
              <button
                type="submit"
                class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                :disabled="loading"
              >
                حفظ التغييرات
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

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
