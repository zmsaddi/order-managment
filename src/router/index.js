import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/services/supabase'

// استيراد الصفحات
import LoginView from '@/views/LoginView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UsersView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/OrdersView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/create',
    name: 'create-order',
    component: () => import('@/views/CreateOrderView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/:id',
    name: 'order-details',
    component: () => import('@/views/OrderDetailsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/views/ReportsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// حماية المسارات التي تتطلب المصادقة
router.beforeEach(async (to, from, next) => {
  // التحقق من وجود جلسة مستخدم
  const { data: { session } } = await supabase.auth.getSession()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  // إذا كان المسار يتطلب المصادقة ولا توجد جلسة، توجيه المستخدم إلى صفحة تسجيل الدخول
  if (requiresAuth && !session) {
    next({ name: 'login' })
    return
  }

  // إذا كان المستخدم مسجل الدخول ويحاول الوصول إلى صفحة تسجيل الدخول، توجيهه إلى لوحة التحكم
  if (session && to.name === 'login') {
    next({ name: 'dashboard' })
    return
  }

  // إذا كان المسار يتطلب صلاحيات المدير، تحقق من دور المستخدم
  if (requiresAdmin && session) {
    // جلب بيانات المستخدم من جدول المستخدمين
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (error || !userData || !['admin', 'sales_manager'].includes(userData.role)) {
      // إذا لم يكن المستخدم مديراً، توجيهه إلى لوحة التحكم
      next({ name: 'dashboard' })
      return
    }
  }

  // السماح بالمتابعة
  next()
})

export default router
