<template>
  <div class="min-h-screen bg-gray-50">
    <!-- القائمة الجانبية والشريط العلوي -->
    <div class="flex h-screen overflow-hidden">
      <!-- القائمة الجانبية -->
      <SidebarMenu 
        :user="user" 
        :mobile-open="mobileOpen"
        @close="mobileOpen = false"
      />
      
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
              <h2 class="text-xl font-semibold text-gray-800">تقارير المبيعات</h2>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-600 ml-2">{{ user.name }}</span>
              <div class="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white">
                {{ user.name.charAt(0) }}
              </div>
            </div>
          </div>
        </header>
        
        
        <!-- محتوى الصفحة -->
        <main class="flex-1 overflow-y-auto p-4">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold text-sky-700 mb-6 text-center">تقارير المبيعات</h1>
            
            <!-- فلاتر التقارير -->
            <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2 text-center" for="date-from">
                  من تاريخ
                </label>
                <input
                  type="date"
                  id="date-from"
                  v-model="filters.dateFrom"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2 text-center" for="date-to">
                  إلى تاريخ
                </label>
                <input
                  type="date"
                  id="date-to"
                  v-model="filters.dateTo"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2 text-center" for="status">
                  حالة الطلب
                </label>
                <select
                  id="status"
                  v-model="filters.status"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                >
                  <option value="">جميع الحالات</option>
                  <option value="new">جديد</option>
                  <option value="completed_pending_delivery">مكتمل بانتظار التسليم</option>
                  <option value="delivered">تم التسليم</option>
                  <option value="cancelled">ملغى</option>
                </select>
              </div>
            </div>
            
            <!-- زر تطبيق الفلتر -->
            <div class="flex justify-center mb-8">
              <button
                @click="applyFilters"
                class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
              >
                تطبيق الفلتر
              </button>
            </div>
            
            <!-- جدول التقارير -->
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead>
                  <tr>
                    <th class="py-3 px-4 bg-sky-100 text-center text-sky-800 font-semibold">رقم الطلب</th>
                    <th class="py-3 px-4 bg-sky-100 text-center text-sky-800 font-semibold">اسم العميل</th>
                    <th class="py-3 px-4 bg-sky-100 text-center text-sky-800 font-semibold">تاريخ الطلب</th>
                    <th class="py-3 px-4 bg-sky-100 text-center text-sky-800 font-semibold">المبلغ الإجمالي</th>
                    <th class="py-3 px-4 bg-sky-100 text-center text-sky-800 font-semibold">حالة الطلب</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading" class="text-center">
                    <td colspan="5" class="py-4">جاري تحميل البيانات...</td>
                  </tr>
                  <tr v-else-if="orders.length === 0" class="text-center">
                    <td colspan="5" class="py-4">لا توجد بيانات متاحة</td>
                  </tr>
                  <template v-else>
                    <tr v-for="order in orders" :key="order.id" class="border-b hover:bg-gray-50">
                      <td class="py-3 px-4 text-center">{{ order.id }}</td>
                      <td class="py-3 px-4 text-center">{{ order.customer_name }}</td>
                      <td class="py-3 px-4 text-center">{{ formatDate(order.created_at) }}</td>
                      <td class="py-3 px-4 text-center">{{ formatCurrency(order.total) }}</td>
                      <td class="py-3 px-4 text-center">
                        <span :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</span>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            
            <!-- ملخص التقرير -->
            <div class="mt-8 p-4 bg-sky-50 rounded-lg">
              <h2 class="text-xl font-bold text-sky-700 mb-4 text-center">ملخص التقرير</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-lg shadow text-center">
                  <p class="text-gray-600 mb-2">إجمالي عدد الطلبات</p>
                  <p class="text-2xl font-bold text-sky-700">{{ summary.totalOrders }}</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow text-center">
                  <p class="text-gray-600 mb-2">إجمالي المبيعات</p>
                  <p class="text-2xl font-bold text-sky-700">{{ formatCurrency(summary.totalSales) }}</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow text-center">
                  <p class="text-gray-600 mb-2">متوسط قيمة الطلب</p>
                  <p class="text-2xl font-bold text-sky-700">{{ formatCurrency(summary.averageOrderValue) }}</p>
                </div>
              </div>
            </div>
            
            <!-- زر طباعة التقرير -->
            <div class="flex justify-center mt-8">
              <button
                @click="printReport"
                class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
              >
                طباعة التقرير
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { supabase } from '@/services/supabase'
import SidebarMenu from '@/components/SidebarMenu.vue'
import { formatCurrency, formatDate } from '@/utils/formatters'

export default {
  name: 'ReportsView',
  components: {
    SidebarMenu
  },
  setup() {
    const orders = ref([])
    const loading = ref(true)
    const mobileOpen = ref(false)
    
    // الحصول على بيانات المستخدم الحالي من التخزين المحلي
    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // تبديل حالة القائمة الجانبية للجوال
    const toggleSidebar = () => {
      mobileOpen.value = !mobileOpen.value
    }
    
    const filters = reactive({
      dateFrom: '',
      dateTo: '',
      status: ''
    })
    
    const summary = reactive({
      totalOrders: 0,
      totalSales: 0,
      averageOrderValue: 0
    })
    
    // جلب الطلبات
    const fetchOrders = async () => {
      loading.value = true
      
      try {
        // جلب بيانات المستخدم الحالي
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          loading.value = false
          return
        }
        
        // التحقق من وجود معرف المستخدم
        if (!session.user || !session.user.id) {
          console.error('معرف المستخدم غير متوفر')
          loading.value = false
          return
        }
        
        // جلب بيانات المستخدم من جدول المستخدمين
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()
        
        let query = supabase.from('orders').select('*')
        
        // إذا كان المستخدم مندوباً، يجلب طلباته فقط
        if (userData && userData.role === 'representative') {
          query = query.eq('sales_rep_id', session.user.id)
        }
        
        // تطبيق الفلاتر
        if (filters.dateFrom) {
          query = query.gte('created_at', filters.dateFrom)
        }
        
        if (filters.dateTo) {
          // إضافة يوم واحد لتضمين اليوم المحدد بالكامل
          const nextDay = new Date(filters.dateTo)
          nextDay.setDate(nextDay.getDate() + 1)
          query = query.lt('created_at', nextDay.toISOString())
        }
        
        if (filters.status) {
          query = query.eq('status', filters.status)
        }
        
        // ترتيب النتائج حسب تاريخ الإنشاء (الأحدث أولاً)
        query = query.order('created_at', { ascending: false })
        
        const { data, error } = await query
        
        if (error) throw error
        
        orders.value = data || []
        
        // حساب ملخص التقرير
        calculateSummary()
      } catch (error) {
        console.error('خطأ في جلب الطلبات:', error)
      } finally {
        loading.value = false
      }
    }
    
    // حساب ملخص التقرير
    const calculateSummary = () => {
      summary.totalOrders = orders.value.length
      
      if (summary.totalOrders > 0) {
        const totalSales = orders.value.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0)
        summary.totalSales = totalSales.toFixed(2)
        summary.averageOrderValue = (totalSales / summary.totalOrders).toFixed(2)
      } else {
        summary.totalSales = '0.00'
        summary.averageOrderValue = '0.00'
      }
    }
    
    // تطبيق الفلاتر
    const applyFilters = () => {
      fetchOrders()
    }
    
    // تنسيق التاريخ
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA')
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
        'new': 'bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs',
        'completed_pending_delivery': 'bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs',
        'delivered': 'bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs',
        'cancelled': 'bg-red-100 text-red-800 py-1 px-2 rounded-full text-xs'
      }
      return statusClassMap[status] || ''
    }
    
    // طباعة التقرير
    const printReport = () => {
      window.print()
    }
    
    // جلب الطلبات عند تحميل الصفحة
    onMounted(() => {
      fetchOrders()
    })
    
    return {
      orders,
      loading,
      filters,
      summary,
      user,
      mobileOpen,
      toggleSidebar,
      applyFilters,
      formatDate,
      formatCurrency,
      getStatusText,
      getStatusClass,
      printReport
    }
  }
}
</script>

<style>
@media print {
  button {
    display: none;
  }
}
</style>
