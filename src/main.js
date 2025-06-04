import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import './assets/css/ui-enhancements.css'

// إنشاء تطبيق Vue
const app = createApp(App)

// إضافة Pinia لإدارة الحالة
app.use(createPinia())

// إضافة Vue Router للتنقل بين الصفحات
app.use(router)

// تثبيت التطبيق على العنصر الجذر
app.mount('#app')
