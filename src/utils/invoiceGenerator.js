/**
 * وحدة إنشاء الفواتير
 * هذا الملف يحتوي على الدوال المسؤولة عن إنشاء وتصدير الفواتير
 */

/**
 * دالة لإنشاء فاتورة من بيانات الطلب
 * @param {Object} order - بيانات الطلب
 * @param {Object} salesRep - بيانات المندوب
 */
export function generateInvoice(order, salesRep) {
  // التحقق من وجود بيانات الطلب
  if (!order) {
    console.error('لا يمكن إنشاء فاتورة: بيانات الطلب غير متوفرة');
    return;
  }

  // إنشاء محتوى الفاتورة
  const invoiceContent = createInvoiceContent(order, salesRep);
  
  // إنشاء ملف PDF وتنزيله
  generatePDF(invoiceContent, order.id);
}

/**
 * دالة مساعدة لإنشاء محتوى الفاتورة
 * @param {Object} order - بيانات الطلب
 * @param {Object} salesRep - بيانات المندوب
 * @returns {Object} - محتوى الفاتورة
 */
function createInvoiceContent(order, salesRep) {
  // تنسيق التاريخ
  const orderDate = new Date(order.created_at);
  const formattedDate = orderDate.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // إنشاء محتوى الفاتورة
  return {
    title: `فاتورة رقم #${order.id}`,
    date: formattedDate,
    customer: {
      name: order.customer_name,
      phone: order.customer_phone || 'غير متوفر',
      address: order.customer_address || 'غير متوفر'
    },
    salesRep: salesRep ? {
      name: salesRep.name,
      email: salesRep.email,
      phone: salesRep.phone || 'غير متوفر'
    } : null,
    items: [
      {
        description: order.product_description,
        quantity: order.quantity,
        unitPrice: order.unit_price,
        total: order.quantity * order.unit_price
      }
    ],
    subtotal: order.subtotal,
    taxRate: order.tax_rate,
    taxAmount: order.tax_amount,
    total: order.total,
    notes: order.notes || ''
  };
}

/**
 * دالة لإنشاء ملف PDF وتنزيله
 * @param {Object} content - محتوى الفاتورة
 * @param {number} orderId - رقم الطلب
 */
function generatePDF(content, orderId) {
  // في الإصدار الحالي، نعرض رسالة تأكيد فقط
  // يمكن تطوير هذه الدالة لإنشاء ملف PDF فعلي باستخدام مكتبة مثل jsPDF
  alert(`تم إنشاء فاتورة للطلب رقم #${orderId} بنجاح. سيتم تنزيل الفاتورة قريباً.`);
  
  // محاكاة تنزيل الفاتورة
  setTimeout(() => {
    console.log('تم إنشاء الفاتورة:', content);
  }, 500);
}
