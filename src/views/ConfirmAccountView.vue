<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">تأكيد الحساب</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        قم بإدخال بريدك الإلكتروني وكلمة المرور التي زودك بها المدير لتأكيد حسابك
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="message" :class="['rounded-md p-4 mb-4', messageClass]">
          <p class="text-sm">{{ message }}</p>
        </div>

        <form class="space-y-6" @submit.prevent="confirmAccount">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                class="form-input"
                :disabled="loading"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">كلمة المرور</label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                required
                class="form-input"
                :disabled="loading"
                placeholder="أدخل كلمة المرور"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full btn btn-primary"
              :disabled="loading"
            >
              <span v-if="loading">جاري التأكيد...</span>
              <span v-else>تأكيد الحساب</span>
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">أو</span>
            </div>
          </div>

          <div class="mt-6">
            <router-link to="/login" class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              العودة إلى تسجيل الدخول
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'

export default {
  name: 'ConfirmAccountView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const message = ref('')
    const messageClass = ref('')

    // استخراج معرف التأكيد من عنوان URL
    const token = route.query.token || ''
    const type = route.query.type || ''

    // تأكيد الحساب
    const confirmAccount = async () => {
      loading.value = true
      message.value = ''
      messageClass.value = ''

      try {
        // التحقق من وجود معرف التأكيد
        if (!token || type !== 'signup') {
          throw new Error('رابط التأكيد غير صالح')
        }

        // تأكيد الحساب باستخدام البريد الإلكتروني وكلمة المرور
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup',
          email: email.value,
          options: {
            password: password.value
          }
        })

        if (error) throw error

        // تسجيل الدخول بعد تأكيد الحساب
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value
        })

        if (loginError) throw loginError

        // جلب بيانات المستخدم من جدول المستخدمين
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (userError) {
          // إذا لم يكن المستخدم موجوداً في جدول المستخدمين، قم بإنشائه
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                name: data.user.email.split('@')[0], // اسم افتراضي من البريد الإلكتروني
                role: 'representative', // دور افتراضي
                status: 'active'
              }
            ])
            .select()
            .single()

          if (createError) throw createError

          // حفظ بيانات المستخدم في التخزين المحلي
          localStorage.setItem('user', JSON.stringify(newUser))
        } else {
          // حفظ بيانات المستخدم في التخزين المحلي
          localStorage.setItem('user', JSON.stringify(userData))
        }

        // عرض رسالة نجاح
        message.value = 'تم تأكيد الحساب بنجاح. جاري تحويلك إلى لوحة التحكم...'
        messageClass.value = 'bg-green-50 text-green-800'

        // الانتقال إلى لوحة التحكم بعد ثانيتين
        setTimeout(() => {
          router.push({ name: 'dashboard' })
        }, 2000)
      } catch (error) {
        console.error('خطأ في تأكيد الحساب:', error)
        message.value = error.message || 'حدث خطأ أثناء تأكيد الحساب'
        messageClass.value = 'bg-red-50 text-red-800'
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      loading,
      message,
      messageClass,
      confirmAccount
    }
  }
}
</script>

<style scoped>
.form-input {
  @apply appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm;
}

.btn {
  @apply flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply text-white bg-sky-600 hover:bg-sky-700 focus:ring-sky-500;
}
</style>
