<template>
  <div id="app">
    <div v-if="loading" class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="text-center">
        <div class="spinner mb-4"></div>
        <p class="text-gray-600">جاري تحميل النظام...</p>
      </div>
    </div>
    
    <div v-else-if="!user" class="min-h-screen">
      <router-view />
    </div>
    
    <div v-else class="min-h-screen">
      <router-view />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from './services/supabase'

export default {
  name: 'App',
  setup() {
    const loading = ref(true)
    const user = ref(null)
    const router = useRouter()
    
    // توفير بيانات المستخدم لجميع المكونات
    provide('user', user)
    
    // التحقق من حالة المصادقة عند تحميل التطبيق
    onMounted(async () => {
      // استعادة بيانات المستخدم من localStorage
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
      }
      
      // التحقق من جلسة المستخدم
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // إذا لم تكن هناك جلسة، قم بمسح بيانات المستخدم من localStorage
        localStorage.removeItem('user')
        user.value = null
        
        // إذا كان المستخدم في صفحة تتطلب المصادقة، قم بتوجيهه إلى صفحة تسجيل الدخول
        const requiresAuth = router.currentRoute.value.meta.requiresAuth
        if (requiresAuth) {
          router.push({ name: 'login' })
        }
      } else {
        // إذا كانت هناك جلسة، قم بجلب بيانات المستخدم من قاعدة البيانات
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (error || !userData) {
          // إذا لم يكن المستخدم موجوداً في قاعدة البيانات، قم بتسجيل الخروج
          await supabase.auth.signOut()
          localStorage.removeItem('user')
          user.value = null
          router.push({ name: 'login' })
        } else {
          // تحديث بيانات المستخدم في localStorage وفي الحالة
          localStorage.setItem('user', JSON.stringify(userData))
          user.value = userData
          
          // إذا كان المستخدم في صفحة تسجيل الدخول، قم بتوجيهه إلى الصفحة الرئيسية
          if (router.currentRoute.value.name === 'login') {
            router.push({ name: 'dashboard' })
          }
        }
      }
      
      // الاستماع لتغييرات حالة المصادقة
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          // إذا قام المستخدم بتسجيل الخروج، قم بمسح بيانات المستخدم من localStorage
          localStorage.removeItem('user')
          user.value = null
          router.push({ name: 'login' })
        } else if (event === 'SIGNED_IN' && session) {
          // إذا قام المستخدم بتسجيل الدخول، قم بجلب بيانات المستخدم من قاعدة البيانات
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (!error && userData) {
            // تحديث بيانات المستخدم في localStorage وفي الحالة
            localStorage.setItem('user', JSON.stringify(userData))
            user.value = userData
          }
        }
      })
      
      loading.value = false
    })
    
    return {
      loading,
      user
    }
  }
}
</script>

<style>
@import './assets/css/main.css';
@import './assets/css/ui-enhancements.css';

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #3b82f6;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
