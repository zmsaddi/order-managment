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
              <h2 class="text-xl font-semibold text-gray-800">إنشاء طلب جديد</h2>
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
          <div class="card bg-white rounded-lg shadow-sm p-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-6">{{ isEditing ? 'تعديل الطلب' : 'إنشاء طلب جديد' }}</h1>
            
            <form @submit.prevent="saveOrder">
              <!-- بيانات العميل -->
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-700 mb-4">بيانات العميل</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="form-group">
                    <label for="customer-name" class="form-label">اسم العميل</label>
                    <input 
                      type="text" 
                      id="customer-name" 
                      v-model="orderForm.customer_name" 
                      class="form-input" 
                      placeholder="أدخل اسم العميل" 
                      required
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="customer-phone" class="form-label">رقم الهاتف</label>
                    <input 
                      type="text" 
                      id="customer-phone" 
                      v-model="orderForm.customer_phone" 
                      class="form-input" 
                      placeholder="أدخل رقم الهاتف" 
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="customer-address" class="form-label">العنوان</label>
                    <input 
                      type="text" 
                      id="customer-address" 
                      v-model="orderForm.customer_address" 
                      class="form-input" 
                      placeholder="أدخل العنوان" 
                    />
                  </div>
                </div>
              </div>
              
              <!-- تفاصيل الطلب -->
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-700 mb-4">تفاصيل الطلب</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div class="form-group">
                    <label for="product-description" class="form-label">وصف البضاعة</label>
                    <textarea 
                      id="product-description" 
                      v-model="orderForm.product_description" 
                      class="form-input h-24" 
                      placeholder="أدخل وصف البضاعة" 
                      required
                    ></textarea>
                  </div>
                  
                  <div class="form-group">
                    <label for="notes" class="form-label">ملاحظات</label>
                    <textarea 
                      id="notes" 
                      v-model="orderForm.notes" 
                      class="form-input h-24" 
                      placeholder="أدخل ملاحظات إضافية"
                    ></textarea>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="form-group">
                    <label for="quantity" class="form-label">الكمية</label>
                    <input 
                      type="number" 
                      id="quantity" 
                      v-model="orderForm.quantity" 
                      class="form-input" 
                      placeholder="أدخل الكمية" 
                      min="0.01" 
                      step="0.01" 
                      required
                      @input="calculateTotals"
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="unit-price" class="form-label">سعر الوحدة (ر.س)</label>
                    <input 
                      type="number" 
                      id="unit-price" 
                      v-model="orderForm.unit_price" 
                      class="form-input" 
                      placeholder="أدخل سعر الوحدة" 
                      min="0.01" 
                      step="0.01" 
                      required
                      @input="calculateTotals"
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="tax-rate" class="form-label">نسبة الضريبة (%)</label>
                    <input 
                      type="number" 
                      id="tax-rate" 
                      v-model="orderForm.tax_rate" 
                      class="form-input" 
                      placeholder="أدخل نسبة الضريبة" 
                      min="0" 
                      step="0.01"
                      @input="calculateTotals"
                    />
                  </div>
                </div>
              </div>
              
              <!-- حالة الطلب -->
              <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-700 mb-4">حالة الطلب</h2>
                <div class="form-group">
                  <label for="status" class="form-label">الحالة</label>
                  <select 
                    id="status" 
                    v-model="orderForm.status" 
                    class="form-input" 
                    required
                  >
                    <option value="new">جديد</option>
                    <option value="completed_pending_delivery">مكتمل بانتظار التسليم</option>
                    <option value="delivered">تم التسليم</option>
                    <option value="cancelled">ملغى</option>
                  </select>
                </div>
              </div>
              
              <!-- ملخص الطلب -->
              <div class="bg-gray-50 p-4 rounded-lg mb-6">
                <h2 class="text-lg font-semibold text-gray-700 mb-4">ملخص الطلب</h2>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">المجموع الفرعي:</p>
                    <p class="text-lg font-semibold">{{ formatCurrency(orderForm.subtotal) }} ر.س</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">قيمة الضريبة:</p>
                    <p class="text-lg font-semibold">{{ formatCurrency(orderForm.tax_amount) }} ر.س</p>
                  </div>
                  <div class="col-span-2">
                    <p class="text-sm text-gray-600">الإجمالي:</p>
                    <p class="text-xl font-bold text-sky-700">{{ formatCurrency(orderForm.total) }} ر.س</p>
                  </div>
                </div>
              </div>
              
              <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mb-4">
                {{ errorMessage }}
              </div>
              
              <div class="flex justify-end space-x-3 space-x-reverse">
                <router-link to="/orders" class="btn bg-gray-200 text-gray-800 hover:bg-gray-300">
                  إلغاء
                </router-link>
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  :disabled="saving"
                >
                  <span v-if="saving">جاري الحفظ...</span>
                  <span v-else>{{ isEditing ? 'تحديث الطلب' : 'إنشاء الطلب' }}</span>
                </button>
              </div>
            </form>
          </div>
        </main>
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
  name: 'CreateOrderView',
  components: {
    SidebarMenu
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const showMobileSidebar = ref(false)
    const saving = ref(false)
    const errorMessage = ref('')
    
    // الحصول على بيانات المستخدم الحالي من التخزين المحلي
    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // التحقق من صلاحيات المستخدم
    const isAdmin = computed(() => {
      return ['admin', 'sales_manager'].includes(user.value.role)
    })
    
    // التحقق مما إذا كان تعديل أم إنشاء جديد
    const isEditing = computed(() => {
      return !!route.params.id
    })
    
    // نموذج الطلب
    const orderForm = ref({
      id: null,
      customer_name: '',
      customer_phone: '',
      customer_address: '',
      product_description: '',
      quantity: 1,
      unit_price: 0,
      subtotal: 0,
      tax_rate: 0,
      tax_amount: 0,
      total: 0,
      notes: '',
      status: 'new',
      sales_rep_id: user.value.id
    })
    
    // تبديل حالة القائمة الجانبية للجوال
    const toggleSidebar = () => {
      showMobileSidebar.value = !showMobileSidebar.value
    }
    
    // حساب إجماليات الطلب
    const calculateTotals = () => {
      const quantity = parseFloat(orderForm.value.quantity) || 0
      const unitPrice = parseFloat(orderForm.value.unit_price) || 0
      const taxRate = parseFloat(orderForm.value.tax_rate) || 0
      
      const subtotal = quantity * unitPrice
      const taxAmount = subtotal * (taxRate / 100)
      const total = subtotal + taxAmount
      
      orderForm.value.subtotal = subtotal
      orderForm.value.tax_amount = taxAmount
      orderForm.value.total = total
    }
    
    // تنسيق العملة
    const formatCurrency = (value) => {
      return parseFloat(value).toFixed(2)
    }
    
    // جلب بيانات الطلب للتعديل
    const fetchOrder = async (id) => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) throw error
        
        if (data) {
          // التحقق من صلاحية الوصول للطلب
          if (user.value.role === 'representative' && data.sales_rep_id !== user.value.id) {
            router.push('/orders')
            return
          }
          
          orderForm.value = data
        }
      } catch (error) {
        console.error('خطأ في جلب بيانات الطلب:', error)
        errorMessage.value = 'خطأ في جلب بيانات الطلب'
        router.push('/orders')
      }
    }
    
    // حفظ الطلب
    const saveOrder = async () => {
      try {
        saving.value = true
        errorMessage.value = ''
        
        // حساب الإجماليات قبل الحفظ
        calculateTotals()
        
        if (isEditing.value) {
          // تحديث الطلب
          const { error } = await supabase
            .from('orders')
            .update({
              customer_name: orderForm.value.customer_name,
              customer_phone: orderForm.value.customer_phone,
              customer_address: orderForm.value.customer_address,
              product_description: orderForm.value.product_description,
              quantity: orderForm.value.quantity,
              unit_price: orderForm.value.unit_price,
              subtotal: orderForm.value.subtotal,
              tax_rate: orderForm.value.tax_rate,
              tax_amount: orderForm.value.tax_amount,
              total: orderForm.value.total,
              notes: orderForm.value.notes,
              status: orderForm.value.status,
              updated_at: new Date()
            })
            .eq('id', orderForm.value.id)
          
          if (error) throw error
          
          router.push(`/orders/${orderForm.value.id}`)
        } else {
          // إنشاء طلب جديد
          const { data, error } = await supabase
            .from('orders')
            .insert([
              {
                customer_name: orderForm.value.customer_name,
                customer_phone: orderForm.value.customer_phone,
                customer_address: orderForm.value.customer_address,
                product_description: orderForm.value.product_description,
                quantity: orderForm.value.quantity,
                unit_price: orderForm.value.unit_price,
                subtotal: orderForm.value.subtotal,
                tax_rate: orderForm.value.tax_rate,
                tax_amount: orderForm.value.tax_amount,
                total: orderForm.value.total,
                notes: orderForm.value.notes,
                status: orderForm.value.status,
                sales_rep_id: user.value.id,
                created_at: new Date(),
                updated_at: new Date()
              }
            ])
            .select()
          
          if (error) throw error
          
          if (data && data.length > 0) {
            router.push(`/orders/${data[0].id}`)
          } else {
            router.push('/orders')
          }
        }
      } catch (error) {
        console.error('خطأ في حفظ الطلب:', error)
        errorMessage.value = `خطأ في حفظ الطلب: ${error.message}`
      } finally {
        saving.value = false
      }
    }
    
    onMounted(() => {
      // إذا كان تعديل، جلب بيانات الطلب
      if (route.params.id) {
        fetchOrder(route.params.id)
      } else {
        // حساب الإجماليات للطلب الجديد
        calculateTotals()
      }
    })
    
    return {
      user,
      isAdmin,
      showMobileSidebar,
      toggleSidebar,
      saving,
      errorMessage,
      isEditing,
      orderForm,
      calculateTotals,
      formatCurrency,
      saveOrder
    }
  }
}
</script>
