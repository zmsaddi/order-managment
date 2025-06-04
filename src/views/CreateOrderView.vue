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
                <label for="customer-name" class="form-label">اسم العميل <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="customer-name" 
                  v-model="order.customer_name" 
                  class="form-input"
                  required
                  placeholder="أدخل اسم العميل الكامل"
                  maxlength="100"
                />
              </div>
              
              <div>
                <label for="customer-phone" class="form-label">رقم الهاتف <span class="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  id="customer-phone" 
                  v-model="order.customer_phone" 
                  class="form-input"
                  required
                  placeholder="مثال: 0501234567"
                  pattern="[0-9+\-\s()]{8,15}"
                  title="يرجى إدخال رقم هاتف صحيح (8-15 رقم)"
                />
              </div>
              
              <div>
                <label for="customer-address" class="form-label">العنوان <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="customer-address" 
                  v-model="order.customer_address" 
                  class="form-input"
                  required
                  placeholder="أدخل العنوان الكامل"
                  maxlength="200"
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
                  <label :for="`item-name-${index}`" class="form-label">اسم المنتج <span class="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    :id="`item-name-${index}`" 
                    v-model="item.name" 
                    class="form-input"
                    required
                    placeholder="أدخل اسم المنتج"
                    maxlength="100"
                  />
                </div>
                
                <div>
                  <label :for="`item-quantity-${index}`" class="form-label">الكمية <span class="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    :id="`item-quantity-${index}`" 
                    v-model.number="item.quantity" 
                    class="form-input"
                    min="1"
                    max="9999"
                    required
                    placeholder="1"
                    @input="calculateItemTotal(index)"
                  />
                </div>
                
                <div>
                  <label :for="`item-price-${index}`" class="form-label">السعر (ريال) <span class="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    :id="`item-price-${index}`" 
                    v-model.number="item.price" 
                    class="form-input"
                    min="0.01"
                    max="999999"
                    step="0.01"
                    required
                    placeholder="0.00"
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
                <label for="tax-rate" class="form-label">نسبة الضريبة (%)</label>
                <input 
                  type="number" 
                  id="tax-rate" 
                  v-model.number="order.taxRate" 
                  class="form-input"
                  min="0"
                  max="100"
                  step="0.1"
                  @input="calculateOrderTotal"
                />
              </div>
              
              <div>
                <label for="tax" class="form-label">قيمة الضريبة</label>
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
      taxRate: 15, // نسبة الضريبة القابلة للتعديل
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
      const taxRate = (order.value.taxRate || 0) / 100 // تحويل النسبة المئوية إلى عدد عشري
      const tax = subtotal * taxRate
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
        
        // التحقق من صحة بيانات العميل
        if (!order.value.customer_name || order.value.customer_name.trim() === '') {
          alert('يرجى إدخال اسم العميل')
          return
        }
        
        if (!order.value.customer_phone || order.value.customer_phone.trim() === '') {
          alert('يرجى إدخال رقم هاتف العميل')
          return
        }
        
        if (!order.value.customer_address || order.value.customer_address.trim() === '') {
          alert('يرجى إدخال عنوان العميل')
          return
        }
        
        // التحقق من صحة رقم الهاتف (يجب أن يحتوي على أرقام فقط ويكون بطول مناسب)
        const phoneRegex = /^[0-9+\-\s()]{8,15}$/
        if (!phoneRegex.test(order.value.customer_phone.trim())) {
          alert('يرجى إدخال رقم هاتف صحيح (8-15 رقم)')
          return
        }
        
        // التحقق من صحة بيانات المنتجات
        if (!order.value.items || order.value.items.length === 0) {
          alert('يرجى إضافة منتج واحد على الأقل')
          return
        }
        
        for (let i = 0; i < order.value.items.length; i++) {
          const item = order.value.items[i]
          
          if (!item.name || item.name.trim() === '') {
            alert(`يرجى إدخال اسم المنتج رقم ${i + 1}`)
            return
          }
          
          if (!item.quantity || item.quantity <= 0) {
            alert(`يرجى إدخال كمية صحيحة للمنتج رقم ${i + 1}`)
            return
          }
          
          if (!item.price || item.price <= 0) {
            alert(`يرجى إدخال سعر صحيح للمنتج رقم ${i + 1}`)
            return
          }
        }
        
        // التحقق من أن الإجمالي أكبر من صفر
        if (!order.value.total || order.value.total <= 0) {
          alert('إجمالي الطلب يجب أن يكون أكبر من صفر')
          return
        }
        
        // إعداد بيانات الطلب للحفظ
        const orderData = {
          customer_name: order.value.customer_name.trim(),
          customer_phone: order.value.customer_phone.trim(),
          customer_address: order.value.customer_address.trim(),
          // حفظ بيانات المنتج الأول فقط في الحقول الأساسية للتوافق مع النظام القديم
          product_description: order.value.items[0]?.name?.trim() || '',
          quantity: Number(order.value.items[0]?.quantity || 1),
          unit_price: Number(order.value.items[0]?.price || 0),
          subtotal: Number(order.value.subtotal),
          tax_rate: Number(order.value.taxRate), // نسبة الضريبة القابلة للتعديل
          tax_amount: Number(order.value.tax),
          total: Number(order.value.total),
          notes: order.value.notes ? order.value.notes.trim() : '',
          status: order.value.status,
          sales_rep_id: JSON.parse(localStorage.getItem('user') || '{}').id
        }
        
        // إنشاء الطلب في قاعدة البيانات
        const { data, error } = await supabase
          .from('orders')
          .insert([orderData])
          .select()
        
        if (error) throw error
        
        alert('تم إنشاء الطلب بنجاح')
        router.push('/orders')
      } catch (error) {
        console.error('خطأ في إنشاء الطلب:', error)
        alert('حدث خطأ أثناء إنشاء الطلب: ' + (error.message || 'خطأ غير معروف'))
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

