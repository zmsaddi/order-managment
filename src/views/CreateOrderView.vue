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
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">إنشاء طلب جديد</h1>
            <router-link to="/orders" class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              العودة إلى الطلبات
            </router-link>
          </div>
          
          <!-- نموذج إنشاء الطلب -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <form @submit.prevent="submitOrder">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- بيانات العميل -->
                <div class="col-span-1 md:col-span-2">
                  <h2 class="text-lg font-semibold text-gray-800 mb-4">بيانات العميل</h2>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label for="customer_name" class="form-label">اسم العميل <span class="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        id="customer_name" 
                        v-model="order.customer_name" 
                        class="form-input text-center" 
                        required
                      />
                    </div>
                    
                    <div>
                      <label for="customer_phone" class="form-label">رقم الهاتف</label>
                      <input 
                        type="text" 
                        id="customer_phone" 
                        v-model="order.customer_phone" 
                        class="form-input text-center"
                      />
                    </div>
                    
                    <div>
                      <label for="customer_address" class="form-label">العنوان</label>
                      <input 
                        type="text" 
                        id="customer_address" 
                        v-model="order.customer_address" 
                        class="form-input text-center"
                      />
                    </div>
                  </div>
                </div>
                
                <!-- بيانات المنتج -->
                <div class="col-span-1 md:col-span-2">
                  <h2 class="text-lg font-semibold text-gray-800 mb-4">بيانات المنتج</h2>
                  <div>
                    <label for="product_description" class="form-label">وصف المنتج <span class="text-red-500">*</span></label>
                    <textarea 
                      id="product_description" 
                      v-model="order.product_description" 
                      class="form-input text-center" 
                      rows="3" 
                      required
                    ></textarea>
                  </div>
                </div>
                
                <!-- بيانات السعر والكمية -->
                <div>
                  <h2 class="text-lg font-semibold text-gray-800 mb-4">السعر والكمية</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="quantity" class="form-label">الكمية <span class="text-red-500">*</span></label>
                      <input 
                        type="number" 
                        id="quantity" 
                        v-model="order.quantity" 
                        class="form-input text-center" 
                        min="0.01" 
                        step="0.01" 
                        required
                        @input="calculateTotals"
                      />
                    </div>
                    
                    <div>
                      <label for="unit_price" class="form-label">سعر الوحدة <span class="text-red-500">*</span></label>
                      <div class="relative">
                        <input 
                          type="number" 
                          id="unit_price" 
                          v-model="order.unit_price" 
                          class="form-input text-center pr-8" 
                          min="0.01" 
                          step="0.01" 
                          required
                          @input="calculateTotals"
                        />
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500">€</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label for="tax_rate" class="form-label">نسبة الضريبة (%)</label>
                      <input 
                        type="number" 
                        id="tax_rate" 
                        v-model="order.tax_rate" 
                        class="form-input text-center" 
                        min="0" 
                        step="0.01"
                        @input="calculateTotals"
                      />
                    </div>
                    
                    <div>
                      <label for="tax_amount" class="form-label">مبلغ الضريبة</label>
                      <div class="relative">
                        <input 
                          type="number" 
                          id="tax_amount" 
                          v-model="order.tax_amount" 
                          class="form-input text-center pr-8" 
                          readonly
                        />
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500">€</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- الإجماليات والملاحظات -->
                <div>
                  <h2 class="text-lg font-semibold text-gray-800 mb-4">الإجماليات والملاحظات</h2>
                  <div class="grid grid-cols-1 gap-4">
                    <div>
                      <label for="subtotal" class="form-label">المجموع الفرعي</label>
                      <div class="relative">
                        <input 
                          type="number" 
                          id="subtotal" 
                          v-model="order.subtotal" 
                          class="form-input text-center pr-8" 
                          readonly
                        />
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500">€</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label for="total" class="form-label">الإجمالي</label>
                      <div class="relative">
                        <input 
                          type="number" 
                          id="total" 
                          v-model="order.total" 
                          class="form-input text-center pr-8 font-bold" 
                          readonly
                        />
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500">€</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label for="notes" class="form-label">ملاحظات</label>
                      <textarea 
                        id="notes" 
                        v-model="order.notes" 
                        class="form-input text-center" 
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-8 flex justify-end">
                <button 
                  type="button" 
                  class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 ml-2"
                  @click="resetForm"
                >
                  إعادة تعيين
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="submitting"
                >
                  <span v-if="submitting">جاري الحفظ...</span>
                  <span v-else>حفظ الطلب</span>
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import SidebarMenu from '@/components/SidebarMenu.vue'
import { formatCurrency } from '@/utils/formatters'

export default {
  name: 'CreateOrderView',
  components: {
    SidebarMenu
  },
  setup() {
    const router = useRouter()
    const showMobileSidebar = ref(false)
    const submitting = ref(false)
    
    // الحصول على بيانات المستخدم الحالي من التخزين المحلي
    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // بيانات الطلب
    const order = reactive({
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
    
    // حساب الإجماليات
    const calculateTotals = () => {
      // حساب المجموع الفرعي
      order.subtotal = parseFloat(order.quantity) * parseFloat(order.unit_price)
      
      // حساب مبلغ الضريبة
      order.tax_amount = order.subtotal * (parseFloat(order.tax_rate) / 100)
      
      // حساب الإجمالي
      order.total = order.subtotal + order.tax_amount
    }
    
    // إعادة تعيين النموذج
    const resetForm = () => {
      Object.assign(order, {
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
    }
    
    // إرسال الطلب
    const submitOrder = async () => {
      submitting.value = true
      
      try {
        // حساب الإجماليات مرة أخرى للتأكد من صحتها
        calculateTotals()
        
        // إرسال الطلب إلى قاعدة البيانات
        const { data, error } = await supabase
          .from('orders')
          .insert([
            {
              customer_name: order.customer_name,
              customer_phone: order.customer_phone,
              customer_address: order.customer_address,
              product_description: order.product_description,
              quantity: parseFloat(order.quantity),
              unit_price: parseFloat(order.unit_price),
              subtotal: parseFloat(order.subtotal),
              tax_rate: parseFloat(order.tax_rate),
              tax_amount: parseFloat(order.tax_amount),
              total: parseFloat(order.total),
              notes: order.notes,
              status: order.status,
              sales_rep_id: order.sales_rep_id
            }
          ])
          .select()
        
        if (error) throw error
        
        // الانتقال إلى صفحة تفاصيل الطلب
        router.push({ name: 'order-details', params: { id: data[0].id } })
      } catch (error) {
        console.error('خطأ في إنشاء الطلب:', error)
        alert('حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.')
      } finally {
        submitting.value = false
      }
    }
    
    // تهيئة الصفحة
    onMounted(() => {
      calculateTotals()
    })
    
    return {
      user,
      showMobileSidebar,
      toggleSidebar,
      order,
      calculateTotals,
      resetForm,
      submitOrder,
      submitting,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm;
}

.btn {
  @apply inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500;
}
</style>
