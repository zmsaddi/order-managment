<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          تسجيل الدخول
        </h2>
      </div>
      
      <!-- حالة الاتصال بالإنترنت -->
      <div v-if="!isOnline" class="rounded-md bg-yellow-50 p-4 mb-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-yellow-800">
              تنبيه: أنت غير متصل بالإنترنت
            </h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>
                يرجى التحقق من اتصال الإنترنت الخاص بك والمحاولة مرة أخرى.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- رسالة الخطأ -->
      <div v-if="error" class="rounded-md bg-red-50 p-4 mb-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="mr-3">
            <h3 class="text-sm font-medium text-red-800">
              خطأ في تسجيل الدخول
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- نموذج تسجيل الدخول -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">البريد الإلكتروني</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="البريد الإلكتروني"
              v-model="email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">كلمة المرور</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="كلمة المرور"
              v-model="password"
            />
          </div>
        </div>

        <div>
          <button type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="loading || !isOnline"
            :class="{ 'opacity-50 cursor-not-allowed': loading || !isOnline }"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            <span v-if="loading">جاري تسجيل الدخول...</span>
            <span v-else>تسجيل الدخول</span>
          </button>
        </div>
        
        <!-- حالة الاتصال بالخادم -->
        <div v-if="connectionStatus" class="text-center text-sm">
          <p v-if="connectionStatus === 'checking'" class="text-gray-500">
            جاري التحقق من الاتصال بالخادم...
          </p>
          <p v-else-if="connectionStatus === 'connected'" class="text-green-600">
            متصل بالخادم
          </p>
          <p v-else-if="connectionStatus === 'disconnected'" class="text-red-600">
            غير متصل بالخادم. يرجى التحقق من اتصال الإنترنت الخاص بك.
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { checkSupabaseConnection, retryOperation } from '@/services/supabase'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const error = ref('')
    const isOnline = ref(navigator.onLine)
    const connectionStatus = ref('checking')
    
    // التحقق من حالة الاتصال بالإنترنت
    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine
      if (!isOnline.value) {
        connectionStatus.value = 'disconnected'
      } else {
        // إذا كان متصلاً بالإنترنت، تحقق من الاتصال بالخادم
        checkServerConnection()
      }
    }
    
    // التحقق من الاتصال بالخادم
    const checkServerConnection = async () => {
      connectionStatus.value = 'checking'
      try {
        const result = await checkSupabaseConnection()
        connectionStatus.value = result.connected ? 'connected' : 'disconnected'
        if (!result.connected) {
          console.warn('فشل الاتصال بالخادم:', result.error)
        }
      } catch (err) {
        connectionStatus.value = 'disconnected'
        console.error('خطأ في التحقق من الاتصال بالخادم:', err)
      }
    }
    
    // معالجة تسجيل الدخول
    const handleLogin = async () => {
      // إعادة التحقق من الاتصال قبل محاولة تسجيل الدخول
      if (!isOnline.value) {
        error.value = 'أنت غير متصل بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.'
        return
      }
      
      try {
        loading.value = true
        error.value = ''
        
        // استخدام آلية إعادة المحاولة
        const result = await retryOperation(async () => {
          return await authService.login(email.value, password.value)
        }, 3, 1000)
        
        // تم تسجيل الدخول بنجاح
        router.push('/dashboard')
      } catch (err) {
        console.error('خطأ في تسجيل الدخول:', err)
        
        // تحسين رسائل الخطأ للمستخدم
        if (err.message && err.message.includes('Failed to fetch')) {
          error.value = 'فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت الخاص بك والمحاولة مرة أخرى.'
        } else if (err.message && err.message.includes('ERR_NAME_NOT_RESOLVED')) {
          error.value = 'تعذر العثور على الخادم. قد تكون هناك مشكلة في خدمة DNS أو في الخادم نفسه.'
        } else if (err.message && err.message.includes('Invalid login credentials')) {
          error.value = 'بيانات تسجيل الدخول غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور.'
        } else {
          error.value = `حدث خطأ أثناء تسجيل الدخول: ${err.message || 'خطأ غير معروف'}`
        }
      } finally {
        loading.value = false
      }
    }
    
    // إضافة مستمعي الأحداث عند تحميل المكون
    onMounted(() => {
      window.addEventListener('online', updateOnlineStatus)
      window.addEventListener('offline', updateOnlineStatus)
      
      // التحقق من حالة الاتصال عند بدء التشغيل
      updateOnlineStatus()
      
      // التحقق من الاتصال بالخادم كل دقيقة
      const intervalId = setInterval(checkServerConnection, 60000)
      
      // تخزين معرف الفاصل الزمني للتنظيف لاحقاً
      onUnmounted(() => {
        window.removeEventListener('online', updateOnlineStatus)
        window.removeEventListener('offline', updateOnlineStatus)
        clearInterval(intervalId)
      })
    })
    
    return {
      email,
      password,
      loading,
      error,
      isOnline,
      connectionStatus,
      handleLogin
    }
  }
}
</script>
