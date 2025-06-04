<template>
  <div>
    <!-- عنوان الصفحة -->
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
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="customer-name" class="form-label">اسم العميل</label>
                <input 
                  type="text" 
                  id="customer-name" 
                  v-model="order.customer_name" 
                  class="form-input"
                  required
                />
              </div>
              
              <div>
                <label for="customer-phone" class="form-label">رقم الهاتف</label>
                <input 
                  type="tel" 
                  id="customer-phone" 
                  v-model="order.customer_phone" 
                  class="form-input"
                  required
                />
              </div>
              
              <div>
                <label for="customer-address" class="form-label">العنوان</label>
                <input 
                  type="text" 
                  id="customer-address" 
                  v-model="order.customer_address" 
                  class="form-input"
                  required
                />
              </div>
            </div>
          </div>
          
          <!-- المنتجات -->
          <div class="col-span-1 md:col-span-2">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">المنتجات</h2>
            
            <div v-for="(item, index) in order.items" :key="index" class="border border-gray-200 rounded-lg p-4 mb-4">
              <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label :for="`item-name-${index}`" class="form-label">اسم المنتج</label>
                  <input 
                    type="text" 
                    :id="`item-name-${index}`" 
                    v-model="item.name" 
                    class="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label :for="`item-quantity-${index}`" class="form-label">الكمية</label>
                  <input 
                    type="number" 
                    :id="`item-quantity-${index}`" 
                    v-model.number="item.quantity" 
                    class="form-input"
                    min="1"
                    required
                    @input="calculateItemTotal(index)"
                  />
                </div>
                
                <div>
                  <label :for="`item-price-${index}`" class="form-label">السعر</label>
                  <input 
                    type="number" 
                    :id="`item-price-${index}`" 
                    v-model.number="item.price" 
                    class="form-input"
                    min="0"
                    step="0.01"
                    required
                    @input="calculateItemTotal(index)"
                  />
                </div>
                
                <div>
                  <label class="form-label">الإجمالي</label>
                  <input 
                    type="text" 
                    :value="formatCurrency(item.total || 0)" 
                    class="form-input bg-gray-100"
                    readonly
                  />
                </div>
                
                <div>
                  <button 
                    type="button" 
                    @click="removeItem(index)" 
                    class="btn btn-danger w-full"
                    :disabled="order.items.length === 1"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              type="button" 
              @click="addItem" 
              class="btn bg-green-500 text-white hover:bg-green-600 mb-4"
            >
              إضافة منتج
            </button>
          </div>
          
          <!-- ملخص الطلب -->
          <div class="col-span-1 md:col-span-2">
            <h2 class="text-lg font-semibold text-gray-800 mb-4 bg-sky-50 p-2 rounded-md text-center">ملخص الطلب</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="subtotal" class="form-label">المجموع الفرعي</label>
                <input 
                  type="text" 
                  id="subtotal" 
                  :value="formatCurrency(order.subtotal || 0)" 
                  class="form-input bg-gray-100"
                  readonly
                />
              </div>
              
              <div>
                <label for="tax" class="form-label">الضريبة (15%)</label>
                <input 
                  type="text" 
                  id="tax" 
                  :value="formatCurrency(order.tax || 0)" 
                  class="form-input bg-gray-100"
                  readonly
                />
              </div>
              
              <div>
                <label for="total" class="form-label">الإجمالي النهائي</label>
                <input 
                  type="text" 
                  id="total" 
                  :value="formatCurrency(order.total || 0)" 
                  class="form-input bg-gray-100 font-bold"
                  readonly
                />
              </div>
            </div>
          </div>
          
          <!-- ملاحظات -->
          <div class="col-span-1 md:col-span-2">
            <label for="notes" class="form-label">ملاحظات</label>
            <textarea 
              id="notes" 
              v-model="order.notes" 
              class="form-input"
              rows="3"
              placeholder="ملاحظات إضافية..."
            ></textarea>
          </div>
        </div>
        
        <!-- أزرار الإجراءات -->
        <div class="flex justify-end space-x-4 space-x-reverse mt-6">
          <router-link to="/orders" class="btn bg-gray-200 text-gray-800 hover:bg-gray-300">
            إلغاء
          </router-link>
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
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import { formatCurrency } from '@/utils/formatters'

export default {
  name: 'CreateOrderView',
  setup() {
    const router = useRouter()
    const submitting = ref(false)
    
    // بيانات الطلب
    const order = ref({
      customer_name: '',
      customer_phone: '',
      customer_address: '',
      items: [
        {
          name: '',
          quantity: 1,
          price: 0,
          total: 0
        }
      ],
      subtotal: 0,
      tax: 0,
      total: 0,
      notes: '',
      status: 'new'
    })
    
    // حساب إجمالي المنتج
    const calculateItemTotal = (index) => {
      const item = order.value.items[index]
      item.total = (item.quantity || 0) * (item.price || 0)
      calculateOrderTotal()
    }
    
    // حساب إجمالي الطلب
    const calculateOrderTotal = () => {
      const subtotal = order.value.items.reduce((sum, item) => sum + (item.total || 0), 0)
      const tax = subtotal * 0.15 // ضريبة 15%
      const total = subtotal + tax
      
      order.value.subtotal = subtotal
      order.value.tax = tax
      order.value.total = total
    }
    
    // إضافة منتج جديد
    const addItem = () => {
      order.value.items.push({
        name: '',
        quantity: 1,
        price: 0,
        total: 0
      })
    }
    
    // حذف منتج
    const removeItem = (index) => {
      if (order.value.items.length > 1) {
        order.value.items.splice(index, 1)
        calculateOrderTotal()
      }
    }
    
    // إرسال الطلب
    const submitOrder = async () => {
      try {
        submitting.value = true
        
        // التحقق من صحة البيانات
        if (!order.value.customer_name || !order.value.customer_phone || !order.value.customer_address) {
          alert('يرجى ملء جميع بيانات العميل')
          return
        }
        
        if (order.value.items.some(item => !item.name || !item.quantity || !item.price)) {
          alert('يرجى ملء جميع بيانات المنتجات')
          return
        }
        
        // إنشاء الطلب في قاعدة البيانات
        const { data, error } = await supabase
          .from('orders')
          .insert([{
            customer_name: order.value.customer_name,
            customer_phone: order.value.customer_phone,
            customer_address: order.value.customer_address,
            items: order.value.items,
            subtotal: order.value.subtotal,
            tax: order.value.tax,
            total: order.value.total,
            notes: order.value.notes,
            status: order.value.status,
            created_by: JSON.parse(localStorage.getItem('user') || '{}').id
          }])
          .select()
        
        if (error) throw error
        
        alert('تم إنشاء الطلب بنجاح')
        router.push('/orders')
      } catch (error) {
        console.error('خطأ في إنشاء الطلب:', error)
        alert('حدث خطأ أثناء إنشاء الطلب')
      } finally {
        submitting.value = false
      }
    }
    
    // مراقبة تغييرات المنتجات
    watch(() => order.value.items, () => {
      calculateOrderTotal()
    }, { deep: true })
    
    return {
      order,
      submitting,
      calculateItemTotal,
      addItem,
      removeItem,
      submitOrder,
      formatCurrency
    }
  }
}
</script>

<style scoped>
/* تنسيقات إضافية إذا لزم الأمر */
</style>

