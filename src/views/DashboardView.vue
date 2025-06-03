<template>
  <div class="min-h-screen bg-gray-50">
    <!-- القائمة الجانبية والشريط العلوي -->
    <div class="flex h-screen overflow-hidden">
      <!-- القائمة الجانبية -->
      <aside class="bg-sky-800 text-white w-64 flex-shrink-0 hidden md:block">
        <div class="p-4 border-b border-sky-700">
          <h1 class="text-xl font-bold">نظام إدارة الطلبات</h1>
        </div>
        <nav class="mt-4">
          <ul class="space-y-1">
            <li>
              <router-link to="/dashboard" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/dashboard' }">
                <span class="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </span>
                <span>لوحة التحكم</span>
              </router-link>
            </li>
            <li v-if="isAdmin">
              <router-link to="/users" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/users' }">
                <span class="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </span>
                <span>المستخدمين</span>
              </router-link>
            </li>
            <li>
              <router-link to="/orders" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/orders' }">
                <span class="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span>الطلبات</span>
              </router-link>
            </li>
            <li>
              <router-link to="/reports" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/reports' }">
                <span class="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span>التقارير</span>
              </router-link>
            </li>
            <li>
              <router-link to="/profile" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/profile' }">
                <span class="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span>الملف الشخصي</span>
              </router-link>
            </li>
            <li>
              <button @click="logout" class="w-full flex items-center px-4 py-3 hover:bg-sky-700 transition-colors text-left">
                <span class="ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span>تسجيل الخروج</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      <!-- المحتوى الرئيسي -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- الشريط العلوي -->
        <header class="bg-white shadow-sm z-10">
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center">
              <button @click="toggleSidebar" class="md:hidden ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 class="text-xl font-semibold text-gray-800">لوحة التحكم</h2>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-600 ml-2">{{ user.name }}</span>
              <div class="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white">
                {{ user.name.charAt(0) }}
              </div>
            </div>
          </div>
        </header>
        
        <!-- القائمة الجانبية للجوال -->
        <div v-if="showMobileSidebar" class="fixed inset-0 z-20 md:hidden">
          <div class="absolute inset-0 bg-black opacity-50" @click="toggleSidebar"></div>
          <div class="absolute inset-y-0 right-0 w-64 bg-sky-800 text-white">
            <div class="p-4 border-b border-sky-700 flex justify-between items-center">
              <h1 class="text-xl font-bold">نظام إدارة الطلبات</h1>
              <button @click="toggleSidebar">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav class="mt-4">
              <ul class="space-y-1">
                <li>
                  <router-link to="/dashboard" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/dashboard' }" @click="toggleSidebar">
                    <span class="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </span>
                    <span>لوحة التحكم</span>
                  </router-link>
                </li>
                <li v-if="isAdmin">
                  <router-link to="/users" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/users' }" @click="toggleSidebar">
                    <span class="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </span>
                    <span>المستخدمين</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/orders" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/orders' }" @click="toggleSidebar">
                    <span class="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span>الطلبات</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/reports" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/reports' }" @click="toggleSidebar">
                    <span class="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span>التقارير</span>
                  </router-link>
                </li>
                <li>
                  <router-link to="/profile" class="flex items-center px-4 py-3 hover:bg-sky-700 transition-colors" :class="{ 'bg-sky-700': $route.path === '/profile' }" @click="toggleSidebar">
                    <span class="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span>الملف الشخصي</span>
                  </router-link>
                </li>
                <li>
                  <button @click="logout" class="w-full flex items-center px-4 py-3 hover:bg-sky-700 transition-colors text-left">
                    <span class="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span>تسجيل الخروج</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        <!-- محتوى الصفحة -->
        <main class="flex-1 overflow-y-auto p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="card bg-white p-4 rounded-lg shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">إجمالي الطلبات</p>
                  <h3 class="text-2xl font-bold text-gray-800">{{ stats.totalOrders }}</h3>
                </div>
                <div class="bg-sky-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="card bg-white p-4 rounded-lg shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">طلبات جديدة</p>
                  <h3 class="text-2xl font-bold text-gray-800">{{ stats.newOrders }}</h3>
                </div>
                <div class="bg-green-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="card bg-white p-4 rounded-lg shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">طلبات مكتملة</p>
                  <h3 class="text-2xl font-bold text-gray-800">{{ stats.completedOrders }}</h3>
                </div>
                <div class="bg-blue-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="card bg-white p-4 rounded-lg shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">إجمالي المبيعات</p>
                  <h3 class="text-2xl font-bold text-gray-800">{{ stats.totalSales }} ر.س</h3>
                </div>
                <div class="bg-purple-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- الطلبات الأخيرة -->
            <div class="card bg-white rounded-lg shadow-sm">
              <div class="border-b border-gray-200 p-4">
                <h2 class="text-lg font-semibold text-gray-800">الطلبات الأخيرة</h2>
              </div>
              <div class="p-4">
                <div v-if="loading" class="text-center py-4">
                  <p>جاري تحميل البيانات...</p>
                </div>
                <div v-else-if="recentOrders.length === 0" class="text-center py-4">
                  <p>لا توجد طلبات حديثة</p>
                </div>
                <div v-else class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="bg-gray-50">
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الطلب</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-sm text-gray-900">#{{ order.id }}</td>
                        <td class="px-4 py-3 text-sm text-gray-900">{{ order.customer_name }}</td>
                        <td class="px-4 py-3 text-sm text-gray-900">{{ order.total }} ر.س</td>
                        <td class="px-4 py-3 text-sm">
                          <span :class="getStatusClass(order.status)" class="px-2 py-1 text-xs rounded-full">
                            {{ getStatusText(order.status) }}
                          </span>
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(order.created_at) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="mt-4 text-center">
                  <router-link to="/orders" class="text-sky-600 hover:text-sky-800 text-sm font-medium">
                    عرض جميع الطلبات
                  </router-link>
                </div>
              </div>
            </div>
            
            <!-- أداء المندوبين -->
            <div v-if="isAdmin" class="card bg-white rounded-lg shadow-sm">
              <div class="border-b border-gray-200 p-4">
                <h2 class="text-lg font-semibold text-gray-800">أداء المندوبين</h2>
              </div>
              <div class="p-4">
                <div v-if="loading" class="text-center py-4">
                  <p>جاري تحميل البيانات...</p>
                </div>
                <div v-else-if="salesReps.length === 0" class="text-center py-4">
                  <p>لا يوجد مندوبين</p>
                </div>
                <div v-else>
                  <div v-for="rep in salesReps" :key="rep.id" class="mb-4">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-sm font-medium text-gray-700">{{ rep.name }}</span>
                      <span class="text-sm text-gray-600">{{ rep.total_sales }} ر.س</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                      <div class="bg-sky-600 h-2.5 rounded-full" :style="{ width: `${rep.percentage}%` }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import { authService } from '@/services/auth.service'

export default {
  name: 'DashboardView',
  setup() {
    const router = useRouter()
    const showMobileSidebar = ref(false)
    const loading = ref(true)
    const recentOrders = ref([])
    const salesReps = ref([])
    const stats = ref({
      totalOrders: 0,
      newOrders: 0,
      completedOrders: 0,
      totalSales: 0
    })
    
    // الحصول على بيانات المستخدم من التخزين المحلي
    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // التحقق من صلاحيات المستخدم
    const isAdmin = computed(() => {
      return ['admin', 'sales_manager'].includes(user.value.role)
    })
    
    // تبديل حالة القائمة الجانبية للجوال
    const toggleSidebar = () => {
      showMobileSidebar.value = !showMobileSidebar.value
    }
    
    // تسجيل الخروج
    const logout = async () => {
      try {
        await authService.logout()
        localStorage.removeItem('user')
        router.push({ name: 'login' })
      } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error)
      }
    }
    
    // الحصول على نص حالة الطلب
    const getStatusText = (status) => {
      const statusMap = {
        'new': 'جديد',
        'completed_pending_delivery': 'مكتمل بانتظار التسليم',
        'delivered': 'تم التسليم',
        'cancelled': 'ملغى'
      }
      return statusMap[status] || status
    }
    
    // الحصول على فئة CSS لحالة الطلب
    const getStatusClass = (status) => {
      const statusClassMap = {
        'new': 'bg-yellow-100 text-yellow-800',
        'completed_pending_delivery': 'bg-blue-100 text-blue-800',
        'delivered': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
      }
      return statusClassMap[status] || 'bg-gray-100 text-gray-800'
    }
    
    // تنسيق التاريخ
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    }
    
    // جلب البيانات
    const fetchData = async () => {
      try {
        loading.value = true
        
        // جلب الإحصائيات
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, status, total')
          .order('created_at', { ascending: false })
        
        if (ordersError) throw ordersError
        
        // حساب الإحصائيات
        if (ordersData) {
          stats.value.totalOrders = ordersData.length
          stats.value.newOrders = ordersData.filter(order => order.status === 'new').length
          stats.value.completedOrders = ordersData.filter(order => ['completed_pending_delivery', 'delivered'].includes(order.status)).length
          stats.value.totalSales = ordersData.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0).toFixed(2)
        }
        
        // جلب الطلبات الأخيرة
        let query = supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
        
        // إذا كان المستخدم مندوباً، فقط اعرض طلباته
        if (user.value.role === 'representative') {
          query = query.eq('sales_rep_id', user.value.id)
        }
        
        const { data: recentOrdersData, error: recentOrdersError } = await query
        
        if (recentOrdersError) throw recentOrdersError
        
        recentOrders.value = recentOrdersData || []
        
        // جلب أداء المندوبين (للمدراء فقط)
        if (isAdmin.value) {
          const { data: repsData, error: repsError } = await supabase
            .from('users')
            .select('id, name, role')
            .eq('role', 'representative')
          
          if (repsError) throw repsError
          
          if (repsData) {
            // جلب إجمالي المبيعات لكل مندوب
            const repsWithSales = await Promise.all(repsData.map(async (rep) => {
              const { data: repOrders, error: repOrdersError } = await supabase
                .from('orders')
                .select('total')
                .eq('sales_rep_id', rep.id)
              
              if (repOrdersError) throw repOrdersError
              
              const totalSales = repOrders
                ? repOrders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0)
                : 0
              
              return {
                ...rep,
                total_sales: totalSales.toFixed(2),
                total_orders: repOrders ? repOrders.length : 0
              }
            }))
            
            // حساب النسبة المئوية لكل مندوب
            const maxSales = Math.max(...repsWithSales.map(rep => parseFloat(rep.total_sales) || 0))
            
            salesReps.value = repsWithSales.map(rep => ({
              ...rep,
              percentage: maxSales > 0 ? (parseFloat(rep.total_sales) / maxSales) * 100 : 0
            }))
          }
        }
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error)
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      fetchData()
    })
    
    return {
      user,
      isAdmin,
      showMobileSidebar,
      toggleSidebar,
      logout,
      loading,
      recentOrders,
      salesReps,
      stats,
      getStatusText,
      getStatusClass,
      formatDate
    }
  }
}
</script>
