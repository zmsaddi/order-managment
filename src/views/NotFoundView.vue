<template>
  <div class="simple-container text-center" style="max-width: 400px; margin: 100px auto;">
    <div class="simple-header">
      نظام إدارة الطلبات
    </div>
    
    <div style="padding: 30px;">
      <h1 style="font-size: 36px; margin-bottom: 10px;">404</h1>
      <h2 style="margin-bottom: 20px;">الصفحة غير موجودة</h2>
      
      <p style="margin-bottom: 30px; color: #666;">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو حذفها.
      </p>
      
      <router-link to="/" class="btn btn-primary" style="width: 100%;">
        العودة إلى الصفحة الرئيسية
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script>
