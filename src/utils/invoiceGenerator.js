import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate, getOrderStatusText } from './formatters';

/**
 * توليد فاتورة PDF للطلب
 * @param {Object} order - بيانات الطلب
 * @param {Array} products - منتجات الطلب
 * @param {Object} salesRep - بيانات المندوب
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
  
  // إضافة جدول المنتجات
  doc.setFontSize(14);
  doc.text('تفاصيل المنتجات', doc.internal.pageSize.width / 2, 90, { align: 'center' });
  
  // إعداد بيانات الجدول
  const tableHeaders = [['#', 'الوصف', 'الكمية', 'سعر الوحدة', 'المجموع']];
  const tableData = products.map((product, index) => [
    index + 1,
    product.description,
    product.quantity,
    formatCurrency(product.unit_price),
    formatCurrency(product.subtotal)
  ]);
  
  // إضافة الجدول
  doc.autoTable({
    head: tableHeaders,
    body: tableData,
    startY: 95,
    theme: 'grid',
    styles: {
      font: 'Helvetica',
      halign: 'center',
      valign: 'middle',
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 25 },
      3: { cellWidth: 35 },
      4: { cellWidth: 35 },
    },
  });
  
  // الحصول على موضع Y بعد الجدول
  const finalY = doc.lastAutoTable.finalY + 10;
  
  // إضافة ملاحظات المنتجات إذا وجدت
  let currentY = finalY;
  let hasNotes = false;
  
  products.forEach((product, index) => {
    if (product.notes) {
      if (!hasNotes) {
        doc.setFontSize(12);
        doc.text('ملاحظات المنتجات:', 20, currentY);
        currentY += 7;
        hasNotes = true;
      }
      
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${product.description}: ${product.notes}`, 25, currentY);
      currentY += 7;
    }
  });
  
  // إضافة ملاحظات الطلب إذا وجدت
  if (order.notes) {
    currentY += 5;
    doc.setFontSize(12);
    doc.text('ملاحظات الطلب:', 20, currentY);
    currentY += 7;
    doc.setFontSize(10);
    doc.text(order.notes, 25, currentY);
    currentY += 10;
  }
  
  // إضافة ملخص الطلب
  currentY = Math.max(currentY + 5, finalY + 20);
  
  doc.setFontSize(12);
  doc.text('ملخص الطلب', doc.internal.pageSize.width - 20, currentY, { align: 'right' });
  currentY += 7;
  
  doc.text(`المجموع الفرعي: ${formatCurrency(order.subtotal)}`, doc.internal.pageSize.width - 20, currentY, { align: 'right' });
  currentY += 7;
  
  doc.text(`قيمة الضريبة (${order.tax_rate}%): ${formatCurrency(order.tax_amount)}`, doc.internal.pageSize.width - 20, currentY, { align: 'right' });
  currentY += 7;
  
  doc.setFontSize(14);
  doc.text(`الإجمالي: ${formatCurrency(order.total)}`, doc.internal.pageSize.width - 20, currentY, { align: 'right' });
  
  // إضافة تذييل الصفحة
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`الصفحة ${i} من ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    doc.text('نظام إدارة الطلبات', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 5, { align: 'center' });
  }
  
  return doc;
};
