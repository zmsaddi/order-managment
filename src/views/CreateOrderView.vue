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
                  <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">بيانات العميل</h2>
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
                  <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">بيانات المنتجات</h2>
                  
                  <div v-for="(product, index) in products" :key="product.id" class="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div class="flex justify-between items-center mb-2">
                      <h3 class="text-md font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-md">المنتج {{ index + 1 }}</h3>
                      <div class="flex space-x-2 space-x-reverse">
                        <button 
                          v-if="products.length > 1" 
                          type="button" 
                          @click="removeProduct(index)" 
                          class="text-red-600 hover:text-red-800 bg-red-50 p-1 rounded-full"
                          title="حذف المنتج"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label :for="'product_name_' + index" class="form-label">اسم المنتج <span class="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          :id="'product_name_' + index" 
                          v-model="product.name" 
                          class="form-input text-center bg-white" 
                          required
                          placeholder="أدخل اسم المنتج"
                        />
                      </div>
                      
                      <div>
                        <label :for="'product_description_' + index" class="form-label">وصف المنتج</label>
                        <input 
                          type="text" 
                          :id="'product_description_' + index" 
                          v-model="product.description" 
                          class="form-input text-center bg-white" 
                          placeholder="وصف مختصر للمنتج"
                        />
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <label :for="'quantity_' + index" class="form-label">الكمية <span class="text-red-500">*</span></label>
                        <input 
                          type="number" 
                          :id="'quantity_' + index" 
                          v-model="product.quantity" 
                          class="form-input text-center bg-white" 
                          min="0.01" 
                          step="0.01" 
                          required
                          @input="calculateProductSubtotal(index)"
                        />
                      </div>
                      
                      <div>
                        <label :for="'unit_price_' + index" class="form-label">سعر الوحدة <span class="text-red-500">*</span></label>
                        <div class="relative">
                          <input 
                            type="number" 
                            :id="'unit_price_' + index" 
                            v-model="product.unit_price" 
                            class="form-input text-center pr-8 bg-white" 
                            min="0.01" 
                            step="0.01" 
                            required
                            @input="calculateProductSubtotal(index)"
                          />
                          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span class="text-gray-500">€</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label :for="'subtotal_' + index" class="form-label">المجموع</label>
                        <div class="relative">
                          <input 
                            type="number" 
                            :id="'subtotal_' + index" 
                            v-model="product.subtotal" 
                            class="form-input text-center pr-8 bg-gray-100 font-bold" 
                            readonly
                          />
                          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span class="text-gray-500">€</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label :for="'product_notes_' + index" class="form-label">ملاحظات المنتج</label>
                      <textarea 
                        :id="'product_notes_' + index" 
                        v-model="product.notes" 
                        class="form-input text-center bg-white" 
                        rows="2" 
                        placeholder="أي ملاحظات إضافية خاصة بالمنتج"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div class="mt-2">
                    <button 
                      type="button" 
                      @click="addProduct" 
                      class="btn bg-sky-100 text-sky-800 hover:bg-sky-200 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                      </svg>
                      إضافة منتج آخر
                    </button>
                  </div>
                </div>
                
                <!-- الإجماليات والملاحظات -->
                <div class="col-span-1 md:col-span-2">
                  <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">الإجماليات والملاحظات</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-1">
                      <div class="grid grid-cols-1 gap-4">
                        <div>
                          <label for="subtotal" class="form-label">المجموع الفرعي</label>
                          <div class="relative">
                            <input 
                              type="number" 
                              id="subtotal" 
                              v-model="order.subtotal" 
                              class="form-input text-center pr-8 bg-gray-100 font-bold" 
                              readonly
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
                            class="form-input text-center bg-white" 
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
                              class="form-input text-center pr-8 bg-gray-100" 
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
                              class="form-input text-center pr-8 bg-sky-50 font-bold text-sky-800 border-sky-200" 
                              readonly
                            />
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span class="text-gray-500">€</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="md:col-span-1">
                      <div>
                        <label for="notes" class="form-label">ملاحظات الطلب</label>
                        <textarea 
                          id="notes" 
                          v-model="order.notes" 
                          class="form-input text-center bg-white" 
                          rows="10"
                          placeholder="أي ملاحظات إضافية خاصة بالطلب بشكل عام"
                        ></textarea>
                      </div>
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
      notes: '',
      status: 'new',
      tax_rate: 0,
      tax_amount: 0,
      subtotal: 0,
      total: 0,
      sales_rep_id: user.value?.id || null
    })
    
    // مصفوفة المنتجات
    const products = ref([
      {
        id: 1,
        name: '',
        description: '',
        notes: '',
        quantity: 1,
        unit_price: 0,
        subtotal: 0
      }
    ])
    
    // تبديل حالة القائمة الجانبية للجوال
    const toggleSidebar = () => {
      showMobileSidebar.value = !showMobileSidebar.value
    }
    
    // حساب المجموع الفرعي للمنتج
    const calculateProductSubtotal = (index) => {
      const product = products.value[index]
      product.subtotal = parseFloat(product.quantity) * parseFloat(product.unit_price)
      
      // تحديث الإجماليات
      calculateTotals()
    }
    
    // حساب الإجماليات
    const calculateTotals = () => {
      // حساب المجموع الفرعي للطلب
      order.subtotal = products.value.reduce((total, product) => {
        return total + (parseFloat(product.subtotal) || 0)
      }, 0)
      
      // حساب مبلغ الضريبة
      order.tax_amount = order.subtotal * (parseFloat(order.tax_rate) / 100)
      
      // حساب الإجمالي
      order.total = order.subtotal + order.tax_amount
    }
    
    // إضافة منتج جديد
    const addProduct = () => {
      products.value.push({
        id: Date.now(), // استخدام الطابع الزمني كمعرف مؤقت
        name: '',
        description: '',
        notes: '',
        quantity: 1,
        unit_price: 0,
        subtotal: 0
      })
      
      // تحديث الإجماليات بعد إضافة منتج جديد
      calculateTotals();
    }
    
    // حذف منتج
    const removeProduct = (index) => {
      if (products.value.length > 1) {
        products.value.splice(index, 1);
        // تحديث الإجماليات بعد حذف منتج
        calculateTotals();
      }
    }
    
    // إعادة تعيين النموذج
    const resetForm = () => {
      Object.assign(order, {
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        notes: '',
        status: 'new',
        tax_rate: 0,
        tax_amount: 0,
        subtotal: 0,
        total: 0,
        sales_rep_id: user.value?.id || null
      });
      
      // إعادة تعيين المنتجات إلى منتج واحد فارغ
      products.value = [{
        id: 1,
        name: '',
        description: '',
        notes: '',
        quantity: 1,
        unit_price: 0,
        subtotal: 0
      }];
    }
    
    // إرسال الطلب
    const submitOrder = async () => {
      submitting.value = true
      
      try {
        // التحقق من وجود معرف المستخدم
        if (!order.sales_rep_id) {
          throw new Error('معرف المستخدم غير متوفر. يرجى تسجيل الخروج وإعادة تسجيل الدخول.')
        }
        
        // حساب الإجماليات مرة أخرى للتأكد من صحتها
        calculateTotals()
        
        // إنشاء الطلب الرئيسي
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert([
            {
              customer_name: order.customer_name,
              customer_phone: order.customer_phone,
              customer_address: order.customer_address,
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
        
        if (orderError) throw orderError
        
        const orderId = orderData[0].id
        
        // إضافة المنتجات المرتبطة بالطلب
        const orderProducts = products.value.map(product => ({
          order_id: orderId,
          name: product.name,
          description: product.description,
          notes: product.notes,
          quantity: parseFloat(product.quantity),
          unit_price: parseFloat(product.unit_price),
          subtotal: parseFloat(product.subtotal)
        }))
        
        const { error: productsError } = await supabase
          .from('order_products')
          .insert(orderProducts)
        
        if (productsError) throw productsError
        
        // الانتقال إلى صفحة تفاصيل الطلب
        router.push({ name: 'order-details', params: { id: orderId } })
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
      products,
      calculateProductSubtotal,
      calculateTotals,
      addProduct,
      removeProduct,
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
  @apply block text-sm font-medium text-gray-700 mb-1 text-center;
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
