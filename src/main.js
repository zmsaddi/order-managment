import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import './assets/css/ui-enhancements.css'

// إنشاء تطبيق Vue
const app = createApp(App)

// إضافة Pinia لإدارة الحالة
const pinia = createPinia()
app.use(pinia)

// إضافة Vue Router للتنقل بين الصفحات
app.use(router)

// استيراد supabase ومتجر المصادقة
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'

// تثبيت التطبيق على العنصر الجذر
app.mount('#app')

// الحصول على متجر المصادقة
const authStore = useAuthStore()

/* ينفَّذ عند F5 أو إعادة فتح التبويب */
supabase.auth.getSession().then(({ data: { session } }) => {
  authStore.setSession(session)
})

/* يتفاعل مع تسجيل الدخول/الخروج وتجديد التوكين في أي تبويب */
supabase.auth.onAuthStateChange((_event, session) => {
  authStore.setSession(session)
})
