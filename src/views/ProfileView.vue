<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- عنوان الصفحة -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">الملف الشخصي</h1>
      <p class="text-gray-600 mt-1">إدارة بيانات حسابك الشخصي</p>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="mr-3 text-gray-600">جاري التحميل...</span>
    </div>

    <!-- محتوى الصفحة -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- بطاقة معلومات المستخدم -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm p-6 text-center">
          <!-- صورة المستخدم -->
          <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-white text-xl font-bold">{{ userInitials }}</span>
          </div>
          
          <!-- اسم المستخدم -->
          <h2 class="text-xl font-semibold text-gray-800 mb-1">{{ user.name || 'غير محدد' }}</h2>
          <p class="text-gray-600 mb-2">{{ user.email }}</p>
          <span class="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            {{ getRoleText(user.role) }}
          </span>
          
          <!-- معلومات إضافية -->
          <div class="mt-6 space-y-3 text-sm text-gray-600">
            <div class="flex items-center justify-center">
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              {{ user.phone || 'لم يتم تحديد رقم الهاتف' }}
            </div>
            <div class="flex items-center justify-center">
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {{ user.address || 'لم يتم تحديد العنوان' }}
            </div>
          </div>
        </div>
      </div>

      <!-- نموذج تعديل البيانات -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-6">تعديل البيانات الشخصية</h3>
          
          <!-- رسائل النجاح والخطأ -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {{ error }}
          </div>
          <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {{ success }}
          </div>

          <form @submit.prevent="updateProfile" class="space-y-6">
            <!-- الاسم الكامل -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
              <input
                type="text"
                id="name"
                v-model="form.name"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل اسمك الكامل"
                required
              />
            </div>

            <!-- البريد الإلكتروني -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                disabled
                title="لا يمكن تغيير البريد الإلكتروني"
              />
              <p class="text-xs text-gray-500 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
            </div>

            <!-- رقم الهاتف -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
              <input
                type="tel"
                id="phone"
                v-model="form.phone"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: +966501234567"
              />
            </div>

            <!-- العنوان -->
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
              <textarea
                id="address"
                v-model="form.address"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل عنوانك الكامل"
              ></textarea>
            </div>

            <!-- تغيير كلمة المرور -->
            <div class="border-t pt-6">
              <button
                type="button"
                @click="showPasswordFields = !showPasswordFields"
                class="flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
                تغيير كلمة المرور
                <svg class="w-4 h-4 mr-1 transform transition-transform" :class="{ 'rotate-180': showPasswordFields }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- حقول كلمة المرور -->
              <div v-if="showPasswordFields" class="mt-4 space-y-4">
                <div>
                  <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    id="newPassword"
                    v-model="form.newPassword"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل كلمة المرور الجديدة"
                    minlength="6"
                  />
                </div>
                <div>
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">تأكيد كلمة المرور</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    minlength="6"
                  />
                </div>
              </div>
            </div>

            <!-- أزرار الحفظ -->
            <div class="flex justify-end space-x-3 space-x-reverse pt-6">
              <button
                type="submit"
                :disabled="loading"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <svg v-if="loading" class="animate-spin -ml-1 ml-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="loading">جاري الحفظ...</span>
                <span v-else>حفظ التعديلات</span>
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

