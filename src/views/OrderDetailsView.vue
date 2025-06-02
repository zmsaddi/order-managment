<template>
  <div class="min-h-screen bg-gray-50">
    <!-- القائمة الجانبية والشريط العلوي -->
    <div class="flex h-screen overflow-hidden">
      <!-- القائمة الجانبية -->
      <SidebarMenu :user="user" />
      
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
              <h2 class="text-xl font-semibold text-gray-800">تفاصيل الطلب</h2>
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
            <SidebarMenu :user="user" mobile @item-click="toggleSidebar" />
          </div>
        </div>
        
        <!-- محتوى الصفحة -->
        <main class="flex-1 overflow-y-auto p-4">
          <div v-if="loading" class="text-center py-8">
            <p>جاري تحميل البيانات...</p>
          </div>
          
          <div v-else-if="!order" class="text-center py-8">
            <p>لم يتم العثور على الطلب</p>
            <router-link to="/orders" class="btn btn-primary mt-4">العودة إلى الطلبات</router-link>
          </div>
          
          <div v-else>
            <!-- رأس الصفحة -->
            <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <div>
                <h1 class="text-2xl font-bold text-gray-800">الطلب رقم #{{ order.id }}</h1>
                <p class="text-gray-600">{{ formatDate(order.created_at) }}</p>
              </div>
              
              <div class="flex flex-wrap gap-2 mt-4 md:mt-0">
                <button 
                  @click="shareOnWhatsApp" 
                  class="btn bg-green-600 hover:bg-green-700 text-white flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  مشاركة عبر واتساب
                </button>
                
                <button 
                  @click="generateInvoice" 
                  class="btn bg-purple-600 hover:bg-purple-700 text-white flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clip-rule="evenodd" />
                  </svg>
                  إنشاء فاتورة
                </button>
                
                <router-link 
                  v-if="canEditOrder" 
                  :to="`/orders/edit/${order.id}`" 
                  class="btn bg-sky-600 hover:bg-sky-700 text-white flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  تعديل الطلب
                </router-link>
                
                <button 
                  v-if="canDeleteOrder" 
                  @click="confirmDeleteOrder" 
                  class="btn bg-red-600 hover:bg-red-700 text-white flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  حذف الطلب
                </button>
              </div>
            </div>
            
            <!-- حالة الطلب -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div class="flex flex-col md:flex-row md:justify-between md:items-center">
                <div class="flex items-center mb-4 md:mb-0">
                  <span class="text-gray-700 ml-2">حالة الطلب:</span>
                  <span :class="getStatusClass(order.status)" class="px-3 py-1 text-sm rounded-full">
                    {{ getStatusText(order.status) }}
                  </span>
                </div>
                
                <div v-if="canChangeStatus" class="flex items-center">
                  <span class="text-gray-700 ml-2">تغيير الحالة:</span>
                  <select 
                    v-model="newStatus" 
                    class="form-input w-auto"
                    @change="updateOrderStatus"
                  >
                    <option value="new">جديد</option>
                    <option value="completed_pending_delivery">مكتمل بانتظار التسليم</option>
                    <option value="delivered">تم التسليم</option>
                    <option value="cancelled">ملغى</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- تفاصيل الطلب -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- بيانات العميل -->
              <div class="bg-white rounded-lg shadow-sm p-4">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">بيانات العميل</h2>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-600">الاسم:</span>
                    <span class="font-medium block">{{ order.customer_name }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">رقم الهاتف:</span>
                    <span class="font-medium block">{{ order.customer_phone || 'غير متوفر' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">العنوان:</span>
                    <span class="font-medium block">{{ order.customer_address || 'غير متوفر' }}</span>
                  </div>
                </div>
              </div>
              
              <!-- بيانات المندوب -->
              <div class="bg-white rounded-lg shadow-sm p-4">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">بيانات المندوب</h2>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-600">الاسم:</span>
                    <span class="font-medium block">{{ salesRep?.name || 'غير متوفر' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">البريد الإلكتروني:</span>
                    <span class="font-medium block">{{ salesRep?.email || 'غير متوفر' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">رقم الهاتف:</span>
                    <span class="font-medium block">{{ salesRep?.phone || 'غير متوفر' }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- تفاصيل المنتج -->
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">تفاصيل المنتج</h2>
              <div class="space-y-4">
                <div>
                  <span class="text-gray-600">وصف البضاعة:</span>
                  <p class="mt-1">{{ order.product_description }}</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span class="text-gray-600">الكمية:</span>
                    <p class="font-medium">{{ order.quantity }}</p>
                  </div>
                  <div>
                    <span class="text-gray-600">سعر الوحدة:</span>
                    <p class="font-medium">{{ formatCurrency(order.unit_price) }} ر.س</p>
                  </div>
                  <div>
                    <span class="text-gray-600">نسبة الضريبة:</span>
                    <p class="font-medium">{{ order.tax_rate }}%</p>
                  </div>
                </div>
                
                <div v-if="order.notes">
                  <span class="text-gray-600">ملاحظات:</span>
                  <p class="mt-1">{{ order.notes }}</p>
                </div>
              </div>
            </div>
            
            <!-- ملخص الطلب -->
            <div class="bg-white rounded-lg shadow-sm p-4">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">ملخص الطلب</h2>
              <div class="border-t border-gray-200 pt-4">
                <div class="flex justify-between py-2">
                  <span class="text-gray-600">المجموع الفرعي:</span>
                  <span class="font-medium">{{ formatCurrency(order.subtotal) }} ر.س</span>
                </div>
                <div class="flex justify-between py-2">
                  <span class="text-gray-600">قيمة الضريبة ({{ order.tax_rate }}%):</span>
                  <span class="font-medium">{{ formatCurrency(order.tax_amount) }} ر.س</span>
                </div>
                <div class="flex justify-between py-2 border-t border-gray-200 mt-2">
                  <span class="text-gray-800 font-semibold">الإجمالي:</span>
                  <span class="text-xl font-bold text-sky-700">{{ formatCurrency(order.total) }} ر.س</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    
    <!-- نافذة تأكيد الحذف -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-30 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="closeDeleteModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right">
                <h3 class="text-lg font-medium text-gray-900">تأكيد الحذف</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    هل أنت متأكد من رغبتك في حذف الطلب رقم "{{ order?.id }}"؟
                    <br />
                    لا يمكن التراجع عن هذا الإجراء.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                class="btn btn-danger w-full sm:w-auto sm:mr-3" 
                @click="deleteOrder"
                :disabled="deleting"
              >
                <span v-if="deleting">جاري الحذف...</span>
                <span v-else>حذف</span>
              </button>
              <button 
                type="button" 
                class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 mt-3 w-full sm:mt-0 sm:w-auto" 
                @click="closeDeleteModal"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import SidebarMenu from '@/components/SidebarMenu.vue'

export default {
  name: 'OrderDetailsView',
  components: {
    SidebarMenu
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const showMobileSidebar = ref(false)
    const loading = ref(true)
    const order = ref(null)
    const salesRep = ref(null)
    const newStatus = ref('')
    
    // الحصول على بيانات المستخدم الحالي من التخزين المحلي
    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // التحقق من صلاحيات المستخدم
    const isAdmin = computed(() => {
      return ['admin', 'sales_manager'].includes(user.value.role)
    })
    
    // التحقق من إمكانية تعديل الطلب
    const canEditOrder = computed(() => {
      if (!order.value) return false
      
      // المدراء يمكنهم تعديل أي طلب
      if (isAdmin.value) return true
      
      // المندوب يمكنه تعديل طلباته فقط
      return user.value.id === order.value.sales_rep_id
    })
    
    // التحقق من إمكانية حذف الطلب
    const canDeleteOrder = computed(() => {
      // فقط المدراء يمكنهم حذف الطلبات
      return isAdmin.value
    })
    
    // التحقق من إمكانية تغيير حالة الطلب
    const canChangeStatus = computed(() => {
      if (!order.value) return false
      
      // المدراء يمكنهم تغيير حالة أي طلب
      if (isAdmin.value) return true
      
      // المندوب يمكنه تغيير حالة طلباته فقط
      return user.value.id === order.value.sales_rep_id
    })
    
    // تبديل حالة القائمة الجانبية للجوال
    const toggleSidebar = () => {
      showMobileSidebar.value = !showMobileSidebar.value
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
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date)
    }
    
    // تنسيق العملة
    const formatCurrency = (value) => {
      return parseFloat(value).toFixed(2)
    }
    
    // جلب بيانات الطلب
    const fetchOrder = async () => {
      try {
        loading.value = true
        
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', route.params.id)
          .single()
        
        if (error) throw error
        
        if (data) {
          // التحقق من صلاحية الوصول للطلب
          if (user.value.role === 'representative' && data.sales_rep_id !== user.value.id) {
            router.push('/orders')
            return
          }
          
          order.value = data
          newStatus.value = data.status
          
          // جلب بيانات المندوب
          if (data.sales_rep_id) {
            await fetchSalesRep(data.sales_rep_id)
          }
        } else {
          router.push('/orders')
        }
      } catch (error) {
        console.error('خطأ في جلب بيانات الطلب:', error)
      } finally {
        loading.value = false
      }
    }
    
    // جلب بيانات المندوب
    const fetchSalesRep = async (salesRepId) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email, phone')
          .eq('id', salesRepId)
          .single()
        
        if (error) throw error
        
        salesRep.value = data
      } catch (error) {
        console.error('خطأ في جلب بيانات المندوب:', error)
      }
    }
    
    // تحديث حالة الطلب
    const updateOrderStatus = async () => {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus.value, updated_at: new Date() })
          .eq('id', order.value.id)
        
        if (error) throw error
        
        // تحديث حالة الطلب محلياً
        order.value.status = newStatus.value
      } catch (error) {
        console.error('خطأ في تحديث حالة الطلب:', error)
        alert(`خطأ في تحديث حالة الطلب: ${error.message}`)
        
        // إعادة تعيين الحالة
        newStatus.value = order.value.status
      }
    }
    
    // مشاركة الطلب عبر واتساب
    const shareOnWhatsApp = () => {
      const message = `
طلب رقم: ${order.value.id}
العميل: ${order.value.customer_name}
الهاتف: ${order.value.customer_phone || 'غير متوفر'}
العنوان: ${order.value.customer_address || 'غير متوفر'}
المنتج: ${order.value.product_description}
الكمية: ${order.value.quantity}
السعر: ${order.value.unit_price} ر.س
الإجمالي: ${order.value.total} ر.س
الحالة: ${getStatusText(order.value.status)}
      `.trim()
      
      const encodedMessage = encodeURIComponent(message)
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
    }
    
    // إنشاء فاتورة للطلب
    const generateInvoice = () => {
      // سيتم تنفيذ هذه الوظيفة لاحقاً
      alert('سيتم تنفيذ هذه الوظيفة قريباً')
    }
    
    // متغيرات نافذة تأكيد الحذف
    const showDeleteModal = ref(false)
    const deleting = ref(false)
    
    // فتح نافذة تأكيد الحذف
    const confirmDeleteOrder = () => {
      showDeleteModal.value = true
    }
    
    // إغلاق نافذة تأكيد الحذف
    const closeDeleteModal = () => {
      showDeleteModal.value = false
    }
    
    // حذف الطلب
    const deleteOrder = async () => {
      try {
        deleting.value = true
        
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', order.value.id)
        
        if (error) throw error
        
        // إغلاق النافذة والعودة إلى صفحة الطلبات
        closeDeleteModal()
        router.push('/orders')
      } catch (error) {
        console.error('خطأ في حذف الطلب:', error)
        alert(`خطأ في حذف الطلب: ${error.message}`)
      } finally {
        deleting.value = false
      }
    }
    
    onMounted(() => {
      fetchOrder()
    })
    
    return {
      user,
      isAdmin,
      showMobileSidebar,
      toggleSidebar,
      loading,
      order,
      salesRep,
      newStatus,
      canEditOrder,
      canDeleteOrder,
      canChangeStatus,
      getStatusText,
      getStatusClass,
      formatDate,
      formatCurrency,
      updateOrderStatus,
      shareOnWhatsApp,
      generateInvoice,
      
      // حذف طلب
      showDeleteModal,
      deleting,
      confirmDeleteOrder,
      closeDeleteModal,
      deleteOrder
    }
  }
}
</script>
