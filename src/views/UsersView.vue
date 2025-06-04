<template>
  <div class="min-h-screen bg-gray-50">
    <!-- عرض المستخدمين -->
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">إدارة المستخدمين</h1>
        <button 
          @click="openAddUserModal" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          إضافة مستخدم جديد
        </button>
      </div>
      
      <!-- جدول المستخدمين -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الاسم
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                البريد الإلكتروني
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الدور
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ getRoleName(user.role) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`">
                  {{ user.status === 'active' ? 'نشط' : 'غير نشط' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                <button 
                  @click="openEditUserModal(user)" 
                  class="text-indigo-600 hover:text-indigo-900 ml-3"
                >
                  تعديل
                </button>
                <button 
                  @click="confirmDeleteUser(user)" 
                  class="text-red-600 hover:text-red-900"
                  :disabled="user.role === 'admin' || (currentUser.role === 'sales_manager' && user.role === 'sales_manager')"
                  :class="{ 'opacity-50 cursor-not-allowed': user.role === 'admin' || (currentUser.role === 'sales_manager' && user.role === 'sales_manager') }"
                >
                  حذف
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- نافذة إضافة مستخدم جديد -->
    <div v-if="showAddUserModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-medium text-gray-900">إضافة مستخدم جديد</h3>
          <button @click="closeAddUserModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="addUser" class="p-4">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
            <input 
              type="text" 
              id="name" 
              v-model="newUser.name" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input 
              type="email" 
              id="email" 
              v-model="newUser.email" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input 
              type="password" 
              id="password" 
              v-model="newUser.password" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              minlength="6"
            >
            <p class="text-xs text-gray-500 mt-1">يجب أن تكون كلمة المرور 6 أحرف على الأقل</p>
          </div>
          <div class="mb-4">
            <label for="role" class="block text-sm font-medium text-gray-700 mb-1">الدور</label>
            <select 
              id="role" 
              v-model="newUser.role" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="representative">مندوب مبيعات</option>
              <option value="sales_manager" v-if="currentUser.role === 'admin'">مدير مبيعات</option>
              <option value="admin" v-if="currentUser.role === 'admin'">مدير عام</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
            <input 
              type="text" 
              id="phone" 
              v-model="newUser.phone" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div class="mb-4">
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
            <input 
              type="text" 
              id="address" 
              v-model="newUser.address" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div class="mb-4">
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
            <select 
              id="status" 
              v-model="newUser.status" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
          <div class="flex justify-end">
            <button 
              type="button" 
              @click="closeAddUserModal" 
              class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2 hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              :disabled="loading"
            >
              <span v-if="loading">جاري الإضافة...</span>
              <span v-else>إضافة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- نافذة تعديل المستخدم -->
    <div v-if="showEditUserModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-medium text-gray-900">تعديل المستخدم</h3>
          <button @click="closeEditUserModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="updateUser" class="p-4">
          <div class="mb-4">
            <label for="edit-name" class="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
            <input 
              type="text" 
              id="edit-name" 
              v-model="editingUser.name" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
          </div>
          <div class="mb-4">
            <label for="edit-email" class="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input 
              type="email" 
              id="edit-email" 
              v-model="editingUser.email" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
              disabled
            >
          </div>
          <div class="mb-4">
            <label for="edit-role" class="block text-sm font-medium text-gray-700 mb-1">الدور</label>
            <select 
              id="edit-role" 
              v-model="editingUser.role" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              :disabled="editingUser.role === 'admin' || (currentUser.role === 'sales_manager' && editingUser.role === 'sales_manager')"
            >
              <option value="representative">مندوب مبيعات</option>
              <option value="sales_manager" v-if="currentUser.role === 'admin'">مدير مبيعات</option>
              <option value="admin" v-if="currentUser.role === 'admin'">مدير عام</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="edit-phone" class="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
            <input 
              type="text" 
              id="edit-phone" 
              v-model="editingUser.phone" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div class="mb-4">
            <label for="edit-address" class="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
            <input 
              type="text" 
              id="edit-address" 
              v-model="editingUser.address" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div class="mb-4">
            <label for="edit-status" class="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
            <select 
              id="edit-status" 
              v-model="editingUser.status" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
          <div class="mb-4">
            <div class="flex items-center justify-between">
              <label for="edit-password" class="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الجديدة</label>
              <span class="text-xs text-gray-500">اتركها فارغة إذا لم ترغب في تغييرها</span>
            </div>
            <input 
              type="password" 
              id="edit-password" 
              v-model="editingUser.password" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              minlength="6"
            >
          </div>
          <div class="flex justify-end">
            <button 
              type="button" 
              @click="closeEditUserModal" 
              class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2 hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              :disabled="loading"
            >
              <span v-if="loading">جاري التحديث...</span>
              <span v-else>تحديث</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- نافذة تأكيد الحذف -->
    <div v-if="showDeleteConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-4">
          <div class="flex items-center justify-center mb-4 text-red-600">
            <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-center text-gray-900 mb-2">تأكيد الحذف</h3>
          <p class="text-sm text-gray-500 text-center mb-4">
            هل أنت متأكد من رغبتك في حذف المستخدم "{{ userToDelete?.name }}"؟
            <br>
            لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div class="flex justify-center">
            <button 
              type="button" 
              @click="closeDeleteConfirmModal" 
              class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2 hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button 
              type="button" 
              @click="deleteUser" 
              class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              :disabled="loading"
            >
              <span v-if="loading">جاري الحذف...</span>
              <span v-else>حذف</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { adminService } from '@/services/admin.service'

export default {
  name: 'UsersView',
  setup() {
    // حالة المستخدمين
    const users = ref([])
    const loading = ref(false)
    const error = ref(null)
    
    // حالة النوافذ المنبثقة
    const showAddUserModal = ref(false)
    const showEditUserModal = ref(false)
    const showDeleteConfirmModal = ref(false)
    
    // بيانات المستخدم الحالي
    const currentUser = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // بيانات المستخدم الجديد
    const newUser = ref({
      name: '',
      email: '',
      password: '',
      role: 'representative',
      phone: '',
      address: '',
      status: 'active'
    })
    
    // بيانات المستخدم الذي يتم تعديله
    const editingUser = ref({})
    
    // بيانات المستخدم الذي يتم حذفه
    const userToDelete = ref(null)
    
    // جلب قائمة المستخدمين
    const fetchUsers = async () => {
      try {
        loading.value = true
        error.value = null
        
        // استخدام خدمة الإدارة لجلب المستخدمين
        const data = await adminService.getUsers()
        users.value = data
      } catch (err) {
        console.error('خطأ في جلب المستخدمين:', err)
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
    
    // إضافة مستخدم جديد
    const addUser = async () => {
      try {
        loading.value = true
        error.value = null
        
        // التحقق من صلاحيات المستخدم الحالي
        if (!['admin', 'sales_manager'].includes(currentUser.value.role)) {
          throw new Error('ليس لديك صلاحية لإضافة مستخدمين جدد')
        }
        
        // استخدام خدمة الإدارة لإنشاء المستخدم
        await adminService.createUser(newUser.value)
        
        // إعادة تعيين نموذج المستخدم الجديد
        newUser.value = {
          name: '',
          email: '',
          password: '',
          role: 'representative',
          phone: '',
          address: '',
          status: 'active'
        }
        
        // إغلاق النافذة المنبثقة
        showAddUserModal.value = false
        
        // إعادة جلب قائمة المستخدمين
        await fetchUsers()
      } catch (err) {
        console.error('خطأ في إضافة المستخدم:', err)
        error.value = err.message
        alert(`خطأ في إضافة المستخدم: ${err.message}`)
      } finally {
        loading.value = false
      }
    }
    
    // تحديث بيانات المستخدم
    const updateUser = async () => {
      try {
        loading.value = true
        error.value = null
        
        // التحقق من صلاحيات المستخدم الحالي
        if (!['admin', 'sales_manager'].includes(currentUser.value.role) && currentUser.value.id !== editingUser.value.id) {
          throw new Error('ليس لديك صلاحية لتعديل بيانات هذا المستخدم')
        }
        
        // استخدام خدمة الإدارة لتحديث المستخدم
        await adminService.updateUser(editingUser.value.id, editingUser.value)
        
        // إغلاق النافذة المنبثقة
        showEditUserModal.value = false
        
        // إذا كان المستخدم يقوم بتحديث بياناته الشخصية، قم بتحديث localStorage
        if (currentUser.value.id === editingUser.value.id) {
          // جلب بيانات المستخدم المحدثة
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.value.id)
            .single()
          
          if (userData) {
            localStorage.setItem('user', JSON.stringify(userData))
            currentUser.value = userData
          }
        }
        
        // إعادة جلب قائمة المستخدمين
        await fetchUsers()
      } catch (err) {
        console.error('خطأ في تحديث المستخدم:', err)
        error.value = err.message
        alert(`خطأ في تحديث المستخدم: ${err.message}`)
      } finally {
        loading.value = false
      }
    }
    
    // حذف المستخدم
    const deleteUser = async () => {
      try {
        loading.value = true
        error.value = null
        
        // التحقق من صلاحيات المستخدم الحالي
        if (!['admin', 'sales_manager'].includes(currentUser.value.role)) {
          throw new Error('ليس لديك صلاحية لحذف المستخدمين')
        }
        
        // التحقق من أن المستخدم ليس مديراً عاماً
        if (userToDelete.value.role === 'admin') {
          throw new Error('لا يمكن حذف المدير العام')
        }
        
        // التحقق من أن مدير المبيعات لا يحاول حذف مدير مبيعات آخر
        if (currentUser.value.role === 'sales_manager' && userToDelete.value.role === 'sales_manager') {
          throw new Error('لا يمكن لمدير المبيعات حذف مدير مبيعات آخر')
        }
        
        // استخدام خدمة الإدارة لحذف المستخدم
        await adminService.deleteUser(userToDelete.value.id)
        
        // إغلاق النافذة المنبثقة
        showDeleteConfirmModal.value = false
        
        // إعادة جلب قائمة المستخدمين
        await fetchUsers()
      } catch (err) {
        console.error('خطأ في حذف المستخدم:', err)
        error.value = err.message
        alert(`خطأ في حذف المستخدم: ${err.message}`)
      } finally {
        loading.value = false
      }
    }
    
    // فتح نافذة إضافة مستخدم جديد
    const openAddUserModal = () => {
      showAddUserModal.value = true
    }
    
    // إغلاق نافذة إضافة مستخدم جديد
    const closeAddUserModal = () => {
      showAddUserModal.value = false
      newUser.value = {
        name: '',
        email: '',
        password: '',
        role: 'representative',
        phone: '',
        address: '',
        status: 'active'
      }
    }
    
    // فتح نافذة تعديل المستخدم
    const openEditUserModal = (user) => {
      editingUser.value = { ...user, password: '' }
      showEditUserModal.value = true
    }
    
    // إغلاق نافذة تعديل المستخدم
    const closeEditUserModal = () => {
      showEditUserModal.value = false
      editingUser.value = {}
    }
    
    // فتح نافذة تأكيد الحذف
    const confirmDeleteUser = (user) => {
      userToDelete.value = user
      showDeleteConfirmModal.value = true
    }
    
    // إغلاق نافذة تأكيد الحذف
    const closeDeleteConfirmModal = () => {
      showDeleteConfirmModal.value = false
      userToDelete.value = null
    }
    
    // الحصول على اسم الدور
    const getRoleName = (role) => {
      switch (role) {
        case 'admin':
          return 'مدير عام'
        case 'sales_manager':
          return 'مدير مبيعات'
        case 'representative':
          return 'مندوب مبيعات'
        default:
          return role
      }
    }
    
    // جلب قائمة المستخدمين عند تحميل المكون
    onMounted(async () => {
      await fetchUsers()
    })
    
    return {
      users,
      loading,
      error,
      currentUser,
      newUser,
      editingUser,
      userToDelete,
      showAddUserModal,
      showEditUserModal,
      showDeleteConfirmModal,
      fetchUsers,
      addUser,
      updateUser,
      deleteUser,
      openAddUserModal,
      closeAddUserModal,
      openEditUserModal,
      closeEditUserModal,
      confirmDeleteUser,
      closeDeleteConfirmModal,
      getRoleName
    }
  }
}
</script>
