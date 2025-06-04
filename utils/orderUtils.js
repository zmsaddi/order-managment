/**
 * دوال مشتركة لإدارة الطلبات
 */

import { supabase } from '@/services/supabase'
import { generateInvoice } from '@/utils/invoiceGenerator'

/**
 * دالة موحدة لحذف الطلب
 * @param {number} orderId - معرف الطلب
 * @param {Function} onSuccess - دالة يتم استدعاؤها عند النجاح
 * @param {Function} onError - دالة يتم استدعاؤها عند الخطأ
 * @returns {Promise<boolean>} - true إذا تم الحذف بنجاح
 */
export const deleteOrderById = async (orderId, onSuccess = null, onError = null) => {
  try {
    // حذف منتجات الطلب أولاً
    const { error: productsError } = await supabase
      .from('order_products')
      .delete()
      .eq('order_id', orderId)
    
    if (productsError) {
      console.warn('تحذير: لم يتم العثور على منتجات للطلب أو حدث خطأ في حذفها:', productsError)
    }
    
    // حذف الطلب
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)
    
    if (orderError) throw orderError
    
    // استدعاء دالة النجاح إذا تم تمريرها
    if (onSuccess && typeof onSuccess === 'function') {
      onSuccess()
    }
    
    return true
  } catch (error) {
    console.error('خطأ في حذف الطلب:', error)
    
    // استدعاء دالة الخطأ إذا تم تمريرها
    if (onError && typeof onError === 'function') {
      onError(error)
    } else {
      alert('حدث خطأ أثناء حذف الطلب')
    }
    
    return false
  }
}

/**
 * دالة موحدة لإنشاء فاتورة الطلب
 * @param {Object} order - بيانات الطلب
 * @param {Function} onSuccess - دالة يتم استدعاؤها عند النجاح
 * @param {Function} onError - دالة يتم استدعاؤها عند الخطأ
 * @returns {Promise<boolean>} - true إذا تم إنشاء الفاتورة بنجاح
 */
export const generateOrderInvoice = async (order, onSuccess = null, onError = null) => {
  try {
    if (!order) {
      throw new Error('بيانات الطلب غير متوفرة')
    }
    
    // جلب منتجات الطلب إذا لم تكن موجودة
    let products = order.products || []
    
    if (products.length === 0 && order.id) {
      // جلب المنتجات من قاعدة البيانات
      const { data: productsData, error: productsError } = await supabase
        .from('order_products')
        .select('*')
        .eq('order_id', order.id)
      
      if (!productsError && productsData && productsData.length > 0) {
        products = productsData
      } else {
        // استخدام البيانات القديمة إذا لم تكن هناك منتجات في الجدول الجديد
        products = [{
          name: order.product_description || 'منتج غير محدد',
          description: '',
          notes: '',
          quantity: order.quantity || 1,
          unit_price: order.unit_price || (order.subtotal / (order.quantity || 1)),
          subtotal: order.subtotal || 0
        }]
      }
    }
    
    // إنشاء الفاتورة باستخدام مولد الفواتير
    const doc = generateInvoice(order, products, null)
    
    // حفظ الفاتورة
    doc.save(`فاتورة_${order.id}.pdf`)
    
    // استدعاء دالة النجاح إذا تم تمريرها
    if (onSuccess && typeof onSuccess === 'function') {
      onSuccess()
    }
    
    return true
  } catch (error) {
    console.error('خطأ في إنشاء الفاتورة:', error)
    
    // استدعاء دالة الخطأ إذا تم تمريرها
    if (onError && typeof onError === 'function') {
      onError(error)
    } else {
      alert('حدث خطأ أثناء إنشاء الفاتورة. يرجى المحاولة مرة أخرى.')
    }
    
    return false
  }
}

/**
 * دالة موحدة للتحقق من صلاحيات تعديل الطلب
 * @param {Object} order - بيانات الطلب
 * @param {Object} user - بيانات المستخدم الحالي
 * @returns {boolean} - true إذا كان يمكن تعديل الطلب
 */
export const canEditOrder = (order, user) => {
  if (!order || !user) return false
  
  // المدير يمكنه تعديل جميع الطلبات
  if (user.role === 'admin') return true
  
  // مندوب المبيعات يمكنه تعديل طلباته فقط
  if (user.role === 'sales_rep' && order.sales_rep_id === user.id) {
    // يمكن تعديل الطلبات الجديدة والمعلقة فقط
    return ['new', 'pending'].includes(order.status)
  }
  
  return false
}

/**
 * دالة موحدة للتحقق من صلاحيات حذف الطلب
 * @param {Object} order - بيانات الطلب
 * @param {Object} user - بيانات المستخدم الحالي
 * @returns {boolean} - true إذا كان يمكن حذف الطلب
 */
export const canDeleteOrder = (order, user) => {
  if (!order || !user) return false
  
  // المدير يمكنه حذف جميع الطلبات
  if (user.role === 'admin') return true
  
  // مندوب المبيعات يمكنه حذف طلباته الجديدة فقط
  if (user.role === 'sales_rep' && order.sales_rep_id === user.id) {
    return order.status === 'new'
  }
  
  return false
}

/**
 * دالة موحدة لجلب بيانات الطلب مع المنتجات
 * @param {number} orderId - معرف الطلب
 * @returns {Promise<Object|null>} - بيانات الطلب مع المنتجات أو null
 */
export const fetchOrderWithProducts = async (orderId) => {
  try {
    // جلب بيانات الطلب الأساسية
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    
    if (orderError) throw orderError
    
    // جلب منتجات الطلب من الجدول المنفصل
    const { data: productsData, error: productsError } = await supabase
      .from('order_products')
      .select('id, order_id, name, description, notes, quantity, unit_price, subtotal')
      .eq('order_id', orderId)
    
    // إضافة المنتجات إلى بيانات الطلب
    if (!productsError && productsData && productsData.length > 0) {
      orderData.products = productsData
    } else {
      orderData.products = []
    }
    
    return orderData
  } catch (error) {
    console.error('خطأ في جلب بيانات الطلب:', error)
    return null
  }
}

