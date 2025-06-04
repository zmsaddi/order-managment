<template><div>
          <div v-if="loading" class="text-center py-8">
            <p>جاري تحميل البيانات...</p>
          </div>
          
          <div v-else-if="!order.id" class="text-center py-8">
            <p>لم يتم العثور على الطلب</p>
            <router-link to="/orders" class="btn btn-primary mt-4">العودة إلى الطلبات</router-link>
          </div>
          
          <div v-else>
            <div class="flex justify-between items-center mb-6">
              <h1 class="text-2xl font-bold text-gray-800">تعديل الطلب رقم #{{ order.id }}</h1>
              <router-link :to="`/orders/${order.id}`" class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                </svg>
                العودة إلى تفاصيل الطلب
              </router-link>
            </div>
            
            <!-- نموذج تعديل الطلب -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <form @submit.prevent="updateOrder">
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
                  
                  <!-- بيانات المنتجات -->
                  <div class="col-span-1 md:col-span-2">
                    <h2 class="text-lg font-semibold text-gray-800 mb-4">بيانات المنتجات</h2>
                    
                    <div v-for="(product, index) in products" :key="product.id" class="mb-4 p-4 border border-gray-200 rounded-lg">
                      <div class="flex justify-between items-center mb-2">
                        <h3 class="text-md font-semibold text-gray-700">المنتج {{ index + 1 }}</h3>
                        <div class="flex space-x-2 space-x-reverse">
                          <button 
                            v-if="products.length > 1" 
                            type="button" 
                            @click="removeProduct(index)" 
                            class="text-red-600 hover:text-red-800"
                            title="حذف المنتج"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label :for="'product_description_' + index" class="form-label">وصف المنتج <span class="text-red-500">*</span></label>
                          <textarea 
                            :id="'product_description_' + index" 
                            v-model="product.description" 
                            class="form-input text-center" 
                            rows="2" 
                            required
                          ></textarea>
                        </div>
                        <div>
                          <label :for="'product_notes_' + index" class="form-label">ملاحظات المنتج</label>
                          <textarea 
                            :id="'product_notes_' + index" 
                            v-model="product.notes" 
                            class="form-input text-center" 
                            rows="2" 
                            placeholder="أي ملاحظات إضافية خاصة بالمنتج"
                          ></textarea>
                        </div>
                      </div>
                      
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div>
                          <label :for="'quantity_' + index" class="form-label">الكمية <span class="text-red-500">*</span></label>
                          <input 
                            type="number" 
                            :id="'quantity_' + index" 
                            v-model="product.quantity" 
                            class="form-input text-center" 
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
                              class="form-input text-center pr-8" 
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
                        <label for="notes" class="form-label">ملاحظات الطلب</label>
                        <textarea 
                          id="notes" 
                          v-model="order.notes" 
                          class="form-input text-center" 
                          rows="3"
                          placeholder="أي ملاحظات إضافية خاصة بالطلب بشكل عام"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <!-- حالة الطلب -->
                  <div>
                    <h2 class="text-lg font-semibold text-gray-800 mb-4">حالة الطلب</h2>
                    <div class="grid grid-cols-1 gap-4">
                      <div>
                        <label for="status" class="form-label">الحالة <span class="text-red-500">*</span></label>
                        <select 
                          id="status" 
                          v-model="order.status" 
                          class="form-input text-center" 
                          required
                        >
                          <option value="new">جديد</option>
                          <option value="completed_pending_delivery">مكتمل بانتظار التسليم</option>
                          <option value="delivered">تم التسليم</option>
                          <option value="cancelled">ملغى</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-8 flex justify-end">
                  <router-link 
                    :to="`/orders/${order.id}`" 
                    class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 ml-2"
                  >
                    إلغاء
                  </router-link>
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="updating"
                  >
                    <span v-if="updating">جاري الحفظ...</span>
                    <span v-else>حفظ التغييرات</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
</div></template>
<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'
import { formatCurrency } from '@/utils/formatters'

export default {
  name: 'EditOrderView',
  components: {
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const loading = ref(true)
    const updating = ref(false)
    
    // الحصول على بيانات المستخدم الحالي من التخزين المحلي
    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // بيانات الطلب
    const order = reactive({
      id: null,
      customer_name: '',
      customer_phone: '',
      customer_address: '',
      notes: '',
      status: 'new',
      tax_rate: 0,
      tax_amount: 0,
      subtotal: 0,
      total: 0,
      sales_rep_id: null
    })
    
    // مصفوفة المنتجات
    const products = ref([])
    
    // حساب المجموع الفرعي للمنتج
    const calculateProductSubtotal = (index) => {
      const product = products.value[index]
      product.subtotal = parseFloat(product.quantity) * parseFloat(product.unit_price)
      // تحديث الإجماليات بعد تغيير أي منتج
      calculateTotals()
    }
    
    // حساب الإجماليات
    const calculateTotals = () => {
      // حساب المجموع الفرعي من جميع المنتجات
      order.subtotal = products.value.reduce((total, product) => {
        return total + parseFloat(product.subtotal || 0)
      }, 0)
      
      // حساب مبلغ الضريبة
      order.tax_amount = order.subtotal * (parseFloat(order.tax_rate) / 100)
      
      // حساب الإجمالي
      order.total = order.subtotal + order.tax_amount
    }
    
    // إضافة منتج جديد
    const addProduct = () => {
      const newId = products.value.length > 0 
        ? Math.max(...products.value.map(p => p.id)) + 1 
        : 1
        
      products.value.push({
        id: newId,
        description: '',
        notes: '',
        quantity: 1,
        unit_price: 0,
        subtotal: 0
      })
      
      // تحديث الإجماليات بعد إضافة منتج جديد
      calculateTotals()
    }
    
    // حذف منتج
    const removeProduct = (index) => {
      if (products.value.length > 1) {
        products.value.splice(index, 1)
        // تحديث الإجماليات بعد حذف منتج
        calculateTotals()
      }
    }
    
    // جلب بيانات الطلب
    const fetchOrder = async () => {
      try {
        loading.value = true
        const orderId = route.params.id
        
        // جلب بيانات الطلب الرئيسية
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()
        
        if (orderError) throw orderError
        
        if (!orderData) {
          console.error('لم يتم العثور على الطلب')
          return
        }
        
        // تعبئة بيانات الطلب
        Object.assign(order, orderData)
        
        // جلب منتجات الطلب
        const { data: productsData, error: productsError } = await supabase
          .from('order_products')
          .select('*')
          .eq('order_id', orderId)
        
        if (productsError) throw productsError
        
        if (productsData && productsData.length > 0) {
          // تعبئة بيانات المنتجات
          products.value = productsData.map(product => ({
            id: product.id,
            description: product.description,
            notes: product.notes || '',
            quantity: product.quantity,
            unit_price: product.unit_price,
            subtotal: product.subtotal
          }))
        } else {
          // إذا لم يكن هناك منتجات في الجدول الجديد، نستخدم البيانات القديمة
          products.value = [{
            id: 1,
            description: orderData.product_description || '',
            notes: orderData.product_notes || '',
            quantity: orderData.quantity || 1,
            unit_price: orderData.unit_price || 0,
            subtotal: orderData.subtotal || 0
          }]
        }
        
        // حساب الإجماليات
        calculateTotals()
      } catch (error) {
        console.error('خطأ في جلب بيانات الطلب:', error)
      } finally {
        loading.value = false
      }
    }
    
    // تحديث الطلب
    const updateOrder = async () => {
      try {
        updating.value = true
        
        // حساب الإجماليات مرة أخرى للتأكد من صحتها
        calculateTotals()
        
        // تحديث بيانات الطلب الرئيسية
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            customer_name: order.customer_name,
            customer_phone: order.customer_phone,
            customer_address: order.customer_address,
            subtotal: parseFloat(order.subtotal),
            tax_rate: parseFloat(order.tax_rate),
            tax_amount: parseFloat(order.tax_amount),
            total: parseFloat(order.total),
            notes: order.notes,
            status: order.status
          })
          .eq('id', order.id)
        
        if (orderError) throw orderError
        
        // حذف المنتجات القديمة
        const { error: deleteError } = await supabase
          .from('order_products')
          .delete()
          .eq('order_id', order.id)
        
        if (deleteError) throw deleteError
        
        // إضافة المنتجات المحدثة
        const orderProducts = products.value.map(product => ({
          order_id: order.id,
          name: product.description || 'منتج بدون اسم', // إضافة حقل name مع قيمة افتراضية إذا كان فارغاً
          description: product.description || 'منتج بدون وصف',
          notes: product.notes || '',
          quantity: parseFloat(product.quantity),
          unit_price: parseFloat(product.unit_price),
          subtotal: parseFloat(product.subtotal)
        }))
        
        const { error: productsError } = await supabase
          .from('order_products')
          .insert(orderProducts)
        
        if (productsError) throw productsError
        
        // الانتقال إلى صفحة تفاصيل الطلب
        router.push({ name: 'order-details', params: { id: order.id } })
      } catch (error) {
        console.error('خطأ في تحديث الطلب:', error)
        alert('حدث خطأ أثناء تحديث الطلب. يرجى المحاولة مرة أخرى.')
      } finally {
        updating.value = false
      }
    }
    
    // تهيئة الصفحة
    onMounted(() => {
      fetchOrder()
    })
    
    return {
      user,
      loading,
      updating,
      order,
      products,
      calculateProductSubtotal,
      calculateTotals,
      addProduct,
      removeProduct,
      updateOrder,
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
