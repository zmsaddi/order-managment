import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate, getOrderStatusText } from './formatters';

/**
 * توليد فاتورة PDF للطلب
 * @param {Object} order - بيانات الطلب
 * @param {Array} products - منتجات الطلب (اختياري)
 * @param {Object} salesRep - بيانات المندوب (اختياري)
 * @returns {jsPDF} - ملف PDF
 */
export const generateInvoice = (order, products, salesRep) => {
  // إنشاء مستند PDF
  const doc = new jsPDF();
  
  // إعداد الخط العربي
  doc.setFont('Helvetica');
  doc.setLanguage('ar');
  
  // إضافة عنوان الفاتورة
  doc.setFontSize(22);
  doc.text('فاتورة', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  
  // إضافة رقم الطلب والتاريخ
  doc.setFontSize(12);
  doc.text(`رقم الطلب: ${order.id}`, doc.internal.pageSize.width - 20, 30, { align: 'right' });
  doc.text(`التاريخ: ${formatDate(order.created_at)}`, doc.internal.pageSize.width - 20, 37, { align: 'right' });
  
  // إضافة حالة الطلب
  const statusText = getOrderStatusText(order.status);
  doc.text(`الحالة: ${statusText}`, doc.internal.pageSize.width - 20, 44, { align: 'right' });
  
  // إضافة بيانات العميل
  doc.setFontSize(14);
  doc.text('بيانات العميل', 20, 55);
  doc.setFontSize(12);
  doc.text(`الاسم: ${order.customer_name}`, 20, 63);
  doc.text(`رقم الهاتف: ${order.customer_phone || 'غير متوفر'}`, 20, 70);
  doc.text(`العنوان: ${order.customer_address || 'غير متوفر'}`, 20, 77);
  
  // إضافة بيانات المندوب
  doc.setFontSize(14);
  doc.text('بيانات المندوب', doc.internal.pageSize.width - 20, 55, { align: 'right' });
  doc.setFontSize(12);
  doc.text(`الاسم: ${salesRep?.name || 'غير متوفر'}`, doc.internal.pageSize.width - 20, 63, { align: 'right' });
  doc.text(`رقم الهاتف: ${salesRep?.phone || 'غير متوفر'}`, doc.internal.pageSize.width - 20, 70, { align: 'right' });
  doc.text(`البريد الإلكتروني: ${salesRep?.email || 'غير متوفر'}`, doc.internal.pageSize.width - 20, 77, { align: 'right' });
  
  // إضافة تفاصيل المنتج
  doc.setFontSize(14);
  doc.text('تفاصيل المنتج', doc.internal.pageSize.width / 2, 90, { align: 'center' });
  
  // إضافة وصف المنتج
  doc.setFontSize(12);
  doc.text(`الوصف: ${order.product_description}`, 20, 100);
  doc.text(`الكمية: ${order.quantity}`, 20, 107);
  doc.text(`سعر الوحدة: ${formatCurrency(order.unit_price)}`, 20, 114);
  
  // إضافة ملخص الطلب
  doc.setFontSize(14);
  doc.text('ملخص الطلب', doc.internal.pageSize.width - 20, 130, { align: 'right' });
  
  doc.setFontSize(12);
  doc.text(`المجموع الفرعي: ${formatCurrency(order.subtotal)}`, doc.internal.pageSize.width - 20, 140, { align: 'right' });
  doc.text(`قيمة الضريبة (${order.tax_rate}%): ${formatCurrency(order.tax_amount)}`, doc.internal.pageSize.width - 20, 147, { align: 'right' });
  
  doc.setFontSize(14);
  doc.text(`الإجمالي: ${formatCurrency(order.total)}`, doc.internal.pageSize.width - 20, 157, { align: 'right' });
  
  // إضافة تذييل الصفحة
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`الصفحة ${i} من ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    doc.text('نظام إدارة الطلبات', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 5, { align: 'center' });
  }
  
  // حفظ الفاتورة كملف PDF
  doc.save(`فاتورة_${order.id}.pdf`);
  
  return doc;
};

/**
 * توليد فاتورة من بيانات الطلب
 * @param {Object} order - بيانات الطلب
 * @param {Object} salesRep - بيانات المندوب (اختياري)
 */
export const generateInvoiceFromOrder = (order, salesRep) => {
  if (!order) return;
  
  // استدعاء دالة توليد الفاتورة
  return generateInvoice(order, null, salesRep);
};
