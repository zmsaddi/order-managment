<template>
  <div>
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
          <UserProfileMenu :user="user" />
        </div>
      </div>
    </header>
    
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
                <p class="font-medium">{{ formatCurrency(order.unit_price) }}</p>
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
              <span class="font-medium">{{ formatCurrency(order.subtotal) }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600">قيمة الضريبة ({{ order.tax_rate }}%):</span>
              <span class="font-medium">{{ formatCurrency(order.tax_amount) }}</span>
            </div>
            <div class="flex justify-between py-2 border-t border-gray-200 mt-2">
              <span class="text-gray-800 font-semibold">الإجمالي:</span>
              <span class="text-xl font-bold text-sky-700">{{ formatCurrency(order.total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
    
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
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import UserProfileMenu from '@/components/UserProfileMenu.vue'
import { formatCurrency, formatDate, getOrderStatusText, getOrderStatusClass } from '@/utils/formatters'
import { generateInvoiceFromOrder } from '@/utils/invoiceGenerator'

export default {
  name: 'OrderDetailsView',
  components: {
    UserProfileMenu
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const loading = ref(true)
    const order = ref(null)
    const salesRep = ref(null)
    const newStatus = ref('')
    const showDeleteModal = ref(false)
    const deleting = ref(false)
    
    // الحصول على بيانات المستخدم الحالي من التخزين المحلي
    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // الحصول على وظيفة تبديل القائمة الجانبية من الأب
    const toggleSidebar = inject('toggleSidebar')
    
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
    
    // الحصول على نص حالة الطلب
    const getStatusText = (status) => {
      return getOrderStatusText(status)
    }
    
    // الحصول على فئة CSS لحالة الطلب
    const getStatusClass = (status) => {
      return getOrderStatusClass(status)
    }
    
    // جلب بيانات الطلب
    const fetchOrder = async () => {
      try {
        loading.value = true
        const orderId = route.params.id
        
        // جلب بيانات الطلب
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()
        
        if (orderError) throw orderError
        
        order.value = orderData
        newStatus.value = orderData.status
        
        // جلب بيانات المندوب
        if (orderData.sales_rep_id) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', orderData.sales_rep_id)
            .single()
          
          if (!userError) {
            salesRep.value = userData
          }
        }
        
        // تحديث عنوان الصفحة
        document.title = `الطلب رقم #${orderId} - نظام إدارة الطلبات`
      } catch (error) {
        console.error('خطأ في جلب بيانات الطلب:', error)
      } finally {
        loading.value = false
      }
    }
    
    // تحديث حالة الطلب
    const updateOrderStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({ 
            status: newStatus.value,
            updated_at: new Date()
          })
          .eq('id', order.value.id)
          .select()
          .single()
        
        if (error) throw error
        
        order.value = data
        alert('تم تحديث حالة الطلب بنجاح')
      } catch (error) {
        console.error('خطأ في تحديث حالة الطلب:', error)
        alert('حدث خطأ أثناء تحديث حالة الطلب')
      }
    }
    
    // مشاركة الطلب عبر واتساب
    const shareOnWhatsApp = () => {
      const text = `طلب رقم #${order.value.id}
العميل: ${order.value.customer_name}
المنتج: ${order.value.product_description}
الكمية: ${order.value.quantity}
الإجمالي: ${formatCurrency(order.value.total)}
الحالة: ${getStatusText(order.value.status)}`
      
      const encodedText = encodeURIComponent(text)
      window.open(`https://wa.me/?text=${encodedText}`, '_blank')
    }
    
    // إنشاء فاتورة
    const generateInvoice = () => {
      generateInvoiceFromOrder(order.value, salesRep.value)
    }
    
    // تأكيد حذف الطلب
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
        
        // حذف منتجات الطلب أولاً
        const { error: productsError } = await supabase
          .from('order_products')
          .delete()
          .eq('order_id', order.value.id)
        
        if (productsError) throw productsError
        
        // ثم حذف الطلب نفسه
        const { error: orderError } = await supabase
          .from('orders')
          .delete()
          .eq('id', order.value.id)
        
        if (orderError) throw orderError
        
        alert('تم حذف الطلب بنجاح')
        router.push('/orders')
      } catch (error) {
        console.error('خطأ في حذف الطلب:', error)
        alert('حدث خطأ أثناء حذف الطلب')
      } finally {
        deleting.value = false
        showDeleteModal.value = false
      }
    }
    
    onMounted(() => {
      fetchOrder()
    })
    
    return {
      user,
      loading,
      order,
      salesRep,
      newStatus,
      showDeleteModal,
      deleting,
      isAdmin,
      canEditOrder,
      canDeleteOrder,
      canChangeStatus,
      toggleSidebar,
      getStatusText,
      getStatusClass,
      updateOrderStatus,
      shareOnWhatsApp,
      generateInvoice,
      confirmDeleteOrder,
      closeDeleteModal,
      deleteOrder,
      formatCurrency,
      formatDate
    }
  }
}
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-md text-sm font-medium transition-colors;
}

.btn-primary {
  @apply bg-sky-600 text-white hover:bg-sky-700;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}

.form-input {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm;
}
</style>
