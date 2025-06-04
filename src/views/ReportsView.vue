<template>
  <div>
    <!-- عنوان الصفحة -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-sky-700 mb-6 text-center">تقارير المبيعات</h1>
      
      <!-- فلاتر التقارير -->
      <div class="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <label class="block text-gray-700 text-sm font-bold mb-2 text-center" for="status-filter">
            حالة الطلب
          </label>
          <select
            id="status-filter"
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
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2 text-center" for="user-filter">
            المستخدم
          </label>
          <select
            id="user-filter"
            v-model="filters.userId"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
          >
            <option value="">جميع المستخدمين</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }} ({{ user.role === 'admin' ? 'مدير عام' : user.role === 'sales_manager' ? 'مدير مبيعات' : 'مندوب مبيعات' }})
            </option>
          </select>
        </div>
      </div>
      
      <!-- أزرار الإجراءات -->
      <div class="flex justify-center space-x-4 space-x-reverse mb-6">
        <button
          @click="generateReport"
          class="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :disabled="loading"
        >
          <span v-if="loading">جاري التحميل...</span>
          <span v-else>إنشاء التقرير</span>
        </button>
        
        <button
          @click="exportToPDF"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :disabled="!reportData.length"
        >
          تصدير PDF (محسن)
        </button>
        
        <button
          @click="exportElementToPDF"
          class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :disabled="!reportData.length"
        >
          تصدير PDF (من الصفحة)
        </button>
        
        <button
          @click="resetFilters"
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          إعادة تعيين
        </button>
      </div>      
      <!-- ملخص التقرير -->
      <div id="report-content" v-if="reportData.length > 0" class="mb-8">
        <h2 class="text-xl font-bold text-gray-800 mb-4 text-center">ملخص التقرير</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-blue-100 p-4 rounded-lg text-center">
            <h3 class="text-lg font-semibold text-blue-800">إجمالي الطلبات</h3>
            <p class="text-2xl font-bold text-blue-900">{{ reportSummary.totalOrders }}</p>
          </div>
          
          <div class="bg-green-100 p-4 rounded-lg text-center">
            <h3 class="text-lg font-semibold text-green-800">إجمالي المبيعات</h3>
            <p class="text-2xl font-bold text-green-900">{{ formatCurrency(reportSummary.totalSales) }}</p>
          </div>
          
          <div class="bg-yellow-100 p-4 rounded-lg text-center">
            <h3 class="text-lg font-semibold text-yellow-800">متوسط قيمة الطلب</h3>
            <p class="text-2xl font-bold text-yellow-900">{{ formatCurrency(reportSummary.averageOrderValue) }}</p>
          </div>
          
          <div class="bg-purple-100 p-4 rounded-lg text-center">
            <h3 class="text-lg font-semibold text-purple-800">أعلى قيمة طلب</h3>
            <p class="text-2xl font-bold text-purple-900">{{ formatCurrency(reportSummary.highestOrderValue) }}</p>
          </div>
        </div>
      </div>
      
      <!-- جدول التقرير -->
      <div v-if="reportData.length > 0" class="overflow-x-auto">
        <table class="w-full bg-white border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-2 px-4 border-b text-center">رقم الطلب</th>
              <th class="py-2 px-4 border-b text-center">اسم العميل</th>
              <th class="py-2 px-4 border-b text-center">التاريخ</th>
              <th class="py-2 px-4 border-b text-center">الحالة</th>
              <th class="py-2 px-4 border-b text-center">المبلغ الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in reportData" :key="order.id" class="hover:bg-gray-50">
              <td class="py-2 px-4 border-b text-center">#{{ order.id }}</td>
              <td class="py-2 px-4 border-b text-center">{{ order.customer_name }}</td>
              <td class="py-2 px-4 border-b text-center">{{ formatDate(order.created_at) }}</td>
              <td class="py-2 px-4 border-b text-center">
                <span :class="getOrderStatusClass(order.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ getOrderStatusText(order.status) }}
                </span>
              </td>
              <td class="py-2 px-4 border-b text-center font-semibold">{{ formatCurrency(order.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- رسالة عدم وجود بيانات -->
      <div v-else-if="!loading" class="text-center py-8">
        <p class="text-gray-500">لا توجد بيانات لعرضها. يرجى تحديد الفلاتر وإنشاء التقرير.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import { supabase } from '@/services/supabase'
import { formatCurrency, formatDate, getOrderStatusText, getOrderStatusClass } from '@/utils/formatters'

export default {
  name: 'ReportsView',
  setup() {
    const loading = ref(false)
    const reportData = ref([])
    const users = ref([])
    const filters = ref({
      dateFrom: '',
      dateTo: '',
      status: '',
      userId: ''
    })
    
    // جلب قائمة المستخدمين
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, role')
          .order('name')
        
        if (error) throw error
        users.value = data || []
      } catch (error) {
        console.error('خطأ في جلب المستخدمين:', error)
      }
    }
    
    // ملخص التقرير
    const reportSummary = computed(() => {
      if (!reportData.value.length) {
        return {
          totalOrders: 0,
          totalSales: 0,
          averageOrderValue: 0,
          highestOrderValue: 0
        }
      }
      
      const totalOrders = reportData.value.length
      const totalSales = reportData.value.reduce((sum, order) => sum + parseFloat(order.total || 0), 0)
      const averageOrderValue = totalSales / totalOrders
      const highestOrderValue = Math.max(...reportData.value.map(order => parseFloat(order.total || 0)))
      
      return {
        totalOrders,
        totalSales,
        averageOrderValue,
        highestOrderValue
      }
    })
    
    // إنشاء التقرير
    const generateReport = async () => {
      try {
        loading.value = true
        
        let query = supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
        
        // تطبيق فلتر التاريخ (من)
        if (filters.value.dateFrom) {
          query = query.gte('created_at', filters.value.dateFrom)
        }
        
        // تطبيق فلتر التاريخ (إلى)
        if (filters.value.dateTo) {
          const toDate = new Date(filters.value.dateTo)
          toDate.setHours(23, 59, 59, 999)
          query = query.lte('created_at', toDate.toISOString())
        }
        
        // تطبيق فلتر الحالة
        if (filters.value.status) {
          query = query.eq('status', filters.value.status)
        }
        
        // تطبيق فلتر المستخدم
        if (filters.value.userId) {
          query = query.eq('created_by', filters.value.userId)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        
        reportData.value = data || []
      } catch (error) {
        console.error('خطأ في إنشاء التقرير:', error)
        alert('حدث خطأ أثناء إنشاء التقرير')
        reportData.value = []
      } finally {
        loading.value = false
      }
    }
    
    // تصدير إلى PDF
    const exportToPDF = async () => {
      try {
        if (!reportData.value.length) {
          alert('لا توجد بيانات لتصديرها')
          return
        }
        
        // استيراد دالة توليد PDF المحسنة
        const { generateReportPDF } = await import('@/utils/invoiceGenerator')
        
        // إعداد بيانات الفلاتر مع أسماء المستخدمين
        const filtersWithNames = {
          ...filters.value,
          userName: filters.value.userId ? 
            users.value.find(u => u.id === filters.value.userId)?.name : null
        }
        
        // توليد PDF
        await generateReportPDF(reportData.value, reportSummary.value, filtersWithNames)
        
        console.log('تم تصدير التقرير إلى PDF بنجاح')
      } catch (error) {
        console.error('خطأ في تصدير PDF:', error)
        alert('حدث خطأ أثناء تصدير التقرير إلى PDF: ' + error.message)
      }
    }
    
    // تصدير إلى PDF من العنصر (طريقة بديلة)
    const exportElementToPDF = async () => {
      try {
        if (!reportData.value.length) {
          alert('لا توجد بيانات لتصديرها')
          return
        }
        
        // استيراد دالة توليد PDF من العنصر
        const { createPdfFromElement } = await import('@/utils/invoiceGenerator')
        
        // انتظار تحديث DOM
        await nextTick()
        
        // توليد اسم الملف
        const dateFrom = filters.value.dateFrom || 'all'
        const dateTo = filters.value.dateTo || 'all'
        const filename = `sales-report-element-${dateFrom}-to-${dateTo}.pdf`
        
        // توليد PDF من العنصر
        await createPdfFromElement('report-content', {
          filename: filename,
          orientation: 'landscape'
        })
        
        console.log('تم تصدير التقرير إلى PDF بنجاح')
      } catch (error) {
        console.error('خطأ في تصدير PDF:', error)
        alert('حدث خطأ أثناء تصدير التقرير إلى PDF: ' + error.message)
      }
    }
    
    // إعادة تعيين الفلاتر
    const resetFilters = () => {
      filters.value = {
        dateFrom: '',
        dateTo: '',
        status: '',
        userId: ''
      }
      reportData.value = []
    }
    
    // تهيئة الصفحة
    onMounted(() => {
      // جلب قائمة المستخدمين
      fetchUsers()
      
      // تعيين التاريخ الافتراضي (آخر 30 يوم)
      const today = new Date()
      const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))
      
      filters.value.dateFrom = thirtyDaysAgo.toISOString().split('T')[0]
      filters.value.dateTo = today.toISOString().split('T')[0]
    })
    
    return {
      loading,
      reportData,
      users,
      filters,
      reportSummary,
      generateReport,
      exportToPDF,
      exportElementToPDF,
      resetFilters,
      formatCurrency,
      formatDate,
      getOrderStatusText,
      getOrderStatusClass
    }
  }
}
</script>

<style scoped>
/* تنسيقات إضافية إذا لزم الأمر */
</style>

