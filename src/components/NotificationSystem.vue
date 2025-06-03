<template>
  <div class="notification-container">
    <transition-group name="notification">
      <div 
        v-for="notification in notifications" 
        :key="notification.id" 
        class="notification" 
        :class="[`notification-${notification.type}`]"
      >
        <div class="notification-icon">
          <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="notification.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else-if="notification.type === 'info'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="notification.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
        </div>
        <button @click="removeNotification(notification.id)" class="notification-close">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from '@/services/supabase'

export default {
  name: 'NotificationSystem',
  setup() {
    const notifications = ref([])
    let nextId = 1

    // إضافة إشعار جديد
    const addNotification = (notification) => {
      const id = nextId++
      notifications.value.push({
        id,
        title: notification.title || '',
        message: notification.message || '',
        type: notification.type || 'info',
        duration: notification.duration || 5000
      })

      // إزالة الإشعار تلقائياً بعد المدة المحددة
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }

    // إزالة إشعار
    const removeNotification = (id) => {
      const index = notifications.value.findIndex(notification => notification.id === id)
      if (index !== -1) {
        notifications.value.splice(index, 1)
      }
    }

    // الاستماع لتغييرات الطلبات في قاعدة البيانات
    onMounted(() => {
      // الاشتراك في تغييرات جدول الطلبات
      const ordersSubscription = supabase
        .channel('orders-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
          // تحديد نوع التغيير
          const eventType = payload.eventType
          const newRecord = payload.new
          const oldRecord = payload.old

          // إضافة طلب جديد
          if (eventType === 'INSERT') {
            addNotification({
              title: 'طلب جديد',
              message: `تم إضافة طلب جديد برقم #${newRecord.id}`,
              type: 'success'
            })
          }
          
          // تحديث طلب
          else if (eventType === 'UPDATE') {
            // تغيير حالة الطلب
            if (newRecord.status !== oldRecord.status) {
              let statusText = ''
              switch (newRecord.status) {
                case 'new':
                  statusText = 'جديد'
                  break
                case 'completed_pending_delivery':
                  statusText = 'مكتمل بانتظار التسليم'
                  break
                case 'delivered':
                  statusText = 'تم التسليم'
                  break
                case 'cancelled':
                  statusText = 'ملغى'
                  break
                default:
                  statusText = newRecord.status
              }
              
              addNotification({
                title: 'تغيير حالة الطلب',
                message: `تم تغيير حالة الطلب #${newRecord.id} إلى "${statusText}"`,
                type: 'info'
              })
            }
            // تحديث بيانات الطلب
            else {
              addNotification({
                title: 'تحديث الطلب',
                message: `تم تحديث بيانات الطلب #${newRecord.id}`,
                type: 'info'
              })
            }
          }
          
          // حذف طلب
          else if (eventType === 'DELETE') {
            addNotification({
              title: 'حذف الطلب',
              message: `تم حذف الطلب #${oldRecord.id}`,
              type: 'warning'
            })
          }
        })
        .subscribe()

      // تنظيف الاشتراكات عند إزالة المكون
      return () => {
        supabase.removeChannel(ordersSubscription)
      }
    })

    // تصدير الدوال والمتغيرات
    return {
      notifications,
      addNotification,
      removeNotification
    }
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.notification {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
  animation: slide-in 0.3s ease-out;
}

.notification-success {
  border-right: 4px solid #10b981;
}

.notification-error {
  border-right: 4px solid #ef4444;
}

.notification-info {
  border-right: 4px solid #3b82f6;
}

.notification-warning {
  border-right: 4px solid #f59e0b;
}

.notification-icon {
  margin-left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-success .notification-icon {
  color: #10b981;
}

.notification-error .notification-icon {
  color: #ef4444;
}

.notification-info .notification-icon {
  color: #3b82f6;
}

.notification-warning .notification-icon {
  color: #f59e0b;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.notification-message {
  font-size: 0.875rem;
  color: #4b5563;
}

.notification-close {
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  color: #4b5563;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
