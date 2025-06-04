import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate, getOrderStatusText } from './formatters';

/**
 * فحص إذا كان المستخدم على جهاز محمول
 */
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * توليد فاتورة PDF للطلب
 * @param {Object} order - بيانات الطلب
 * @param {Array} products - منتجات الطلب
 * @param {Object} salesRep - بيانات المندوب
 * @returns {jsPDF} - ملف PDF
 */
export const generateInvoice = (order, products, salesRep) => {
  try {
    // إنشاء مستند PDF
    const doc = new jsPDF();
    
    // إعداد الخط
    doc.setFont('helvetica');
    
    // إضافة عنوان الفاتورة
    doc.setFontSize(20);
    doc.text('INVOICE', doc.internal.pageSize.width / 2, 20, { align: 'center' });
    
    // إضافة رقم الطلب والتاريخ
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, doc.internal.pageSize.width - 20, 30, { align: 'right' });
    doc.text(`Date: ${formatDate(order.created_at)}`, doc.internal.pageSize.width - 20, 37, { align: 'right' });
    
    // إضافة حالة الطلب
    const statusText = getOrderStatusText(order.status);
    const statusMap = {
      'جديد': 'New',
      'مكتمل بانتظار التسليم': 'Completed - Pending Delivery',
      'تم التسليم': 'Delivered',
      'ملغى': 'Cancelled'
    };
    const englishStatus = statusMap[statusText] || statusText;
    doc.text(`Status: ${englishStatus}`, doc.internal.pageSize.width - 20, 44, { align: 'right' });
    
    // إضافة بيانات العميل
    doc.setFontSize(14);
    doc.text('Customer Information', 20, 55);
    doc.setFontSize(10);
    doc.text(`Name: ${order.customer_name}`, 20, 63);
    doc.text(`Phone: ${order.customer_phone || 'N/A'}`, 20, 70);
    doc.text(`Address: ${order.customer_address || 'N/A'}`, 20, 77);
    
    // إضافة بيانات المندوب
    if (salesRep && salesRep.name) {
      doc.setFontSize(14);
      doc.text('Sales Representative', doc.internal.pageSize.width - 20, 55, { align: 'right' });
      doc.setFontSize(10);
      doc.text(`Name: ${salesRep.name}`, doc.internal.pageSize.width - 20, 63, { align: 'right' });
      doc.text(`Phone: ${salesRep.phone || 'N/A'}`, doc.internal.pageSize.width - 20, 70, { align: 'right' });
      doc.text(`Email: ${salesRep.email || 'N/A'}`, doc.internal.pageSize.width - 20, 77, { align: 'right' });
    }
    
    // إضافة جدول المنتجات
    doc.setFontSize(14);
    doc.text('Product Details', doc.internal.pageSize.width / 2, 90, { align: 'center' });
    
    // إعداد بيانات الجدول
    const tableHeaders = [['#', 'Description', 'Qty', 'Unit Price', 'Total']];
    const tableData = products.map((product, index) => [
      index + 1,
      product.name || product.description || 'N/A',
      product.quantity,
      formatCurrency(product.unit_price || product.price),
      formatCurrency(product.subtotal || product.total)
    ]);
    
    // إضافة الجدول باستخدام الدالة المستوردة مباشرة
    autoTable(doc, {
      head: tableHeaders,
      body: tableData,
      startY: 95,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        halign: 'center',
        valign: 'middle',
        fontSize: isMobileDevice() ? 8 : 10,
        cellPadding: isMobileDevice() ? 2 : 3,
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
    
    // إضافة الإجماليات
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    
    // المجموع الفرعي
    const subtotal = products.reduce((sum, product) => sum + (product.subtotal || product.total || 0), 0);
    doc.text(`Subtotal: ${formatCurrency(subtotal)}`, doc.internal.pageSize.width - 20, finalY, { align: 'right' });
    
    // الضريبة
    const taxRate = order.tax_rate || 0;
    const taxAmount = order.tax_amount || (subtotal * taxRate / 100);
    if (taxRate > 0) {
      doc.text(`Tax (${taxRate}%): ${formatCurrency(taxAmount)}`, doc.internal.pageSize.width - 20, finalY + 7, { align: 'right' });
    }
    
    // الإجمالي النهائي
    const total = order.total || (subtotal + taxAmount);
    doc.setFontSize(14);
    doc.text(`Total: ${formatCurrency(total)}`, doc.internal.pageSize.width - 20, finalY + (taxRate > 0 ? 14 : 7), { align: 'right' });
    
    return doc;
    
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw new Error(`Failed to generate invoice: ${error.message}`);
  }
};

/**
 * توليد تقرير PDF للطلبات
 * @param {Array} orders - قائمة الطلبات
 * @param {Object} filters - فلاتر التقرير
 * @returns {jsPDF} - ملف PDF
 */
export const generateReportPDF = (orders, filters = {}) => {
  try {
    // إنشاء مستند PDF
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4'
    });
    
    // إعداد الخط
    doc.setFont('helvetica');
    
    // إضافة عنوان التقرير
    doc.setFontSize(18);
    doc.text('Sales Report', doc.internal.pageSize.width / 2, 20, { align: 'center' });
    
    // إضافة تاريخ التقرير
    doc.setFontSize(10);
    const currentDate = new Date().toLocaleDateString('en-US');
    doc.text(`Generated on: ${currentDate}`, doc.internal.pageSize.width - 20, 30, { align: 'right' });
    
    // إضافة معلومات الفلاتر
    let yPosition = 40;
    if (filters.startDate || filters.endDate) {
      doc.text(`Period: ${filters.startDate || 'N/A'} to ${filters.endDate || 'N/A'}`, 20, yPosition);
      yPosition += 7;
    }
    if (filters.status) {
      doc.text(`Status: ${filters.status}`, 20, yPosition);
      yPosition += 7;
    }
    
    // إعداد بيانات الجدول
    const tableHeaders = [['Order ID', 'Customer', 'Date', 'Status', 'Total']];
    const tableData = orders.map(order => [
      order.id,
      order.customer_name,
      formatDate(order.created_at),
      getOrderStatusText(order.status),
      formatCurrency(order.total)
    ]);
    
    // إضافة الجدول باستخدام الدالة المستوردة مباشرة
    autoTable(doc, {
      head: tableHeaders,
      body: tableData,
      startY: yPosition + 10,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: isMobileDevice() ? 7 : 8,
        cellPadding: isMobileDevice() ? 1 : 2,
        halign: 'center',
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });
    
    // إضافة إحصائيات
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.text('Summary:', 20, finalY);
    
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    doc.setFontSize(10);
    doc.text(`Total Orders: ${totalOrders}`, 20, finalY + 7);
    doc.text(`Total Amount: ${formatCurrency(totalAmount)}`, 20, finalY + 14);
    
    return doc;
    
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error(`Failed to generate report: ${error.message}`);
  }
};

