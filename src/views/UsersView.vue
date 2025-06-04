<template>
  <div>
    <!-- عنوان الصفحة وزر الإضافة -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">إدارة المستخدمين</h1>
      <button @click="openAddUserModal" class="btn btn-primary flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        إضافة مستخدم جديد
      </button>
    </div>
    
    <!-- جدول المستخدمين -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="p-4 border-b border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 class="text-lg font-semibold text-gray-800 mb-2 md:mb-0">قائمة المستخدمين</h2>
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="بحث..." 
              class="form-input pr-8 w-full md:w-64"
            />
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <p>جاري تحميل البيانات...</p>
      </div>
      
      <div v-else-if="filteredUsers.length === 0" class="text-center py-8">
        <p v-if="searchQuery">لا توجد نتائج مطابقة للبحث</p>
        <p v-else>لا يوجد مستخدمين</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('name')">
                الاسم
                <span v-if="sortField === 'name'" class="mr-1">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('email')">
                البريد الإلكتروني
                <span v-if="sortField === 'email'" class="mr-1">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('role')">
                الدور
                <span v-if="sortField === 'role'" class="mr-1">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('status')">
                الحالة
                <span v-if="sortField === 'status'" class="mr-1">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('created_at')">
                تاريخ الإنشاء
                <span v-if="sortField === 'created_at'" class="mr-1">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-900">{{ user.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ user.email }}</td>
              <td class="px-4 py-3 text-sm">
                <span :class="getRoleClass(user.role)" class="px-2 py-1 text-xs rounded-full">
                  {{ getRoleText(user.role) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm">
                <span :class="getStatusClass(user.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ getStatusText(user.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(user.created_at) }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">
                <div class="flex space-x-2 space-x-reverse">
                  <button 
                    @click="editUser(user)" 
                    class="text-sky-600 hover:text-sky-800"
                    title="تعديل"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  
                  <button 
                    v-if="user.status === 'active'" 
                    @click="toggleUserStatus(user)" 
                    class="text-yellow-600 hover:text-yellow-800"
                    title="إيقاف"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  
                  <button 
                    v-else 
                    @click="toggleUserStatus(user)" 
                    class="text-green-600 hover:text-green-800"
                    title="تفعيل"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  
                  <button 
                    v-if="canDeleteUser(user)" 
                    @click="confirmDeleteUser(user)" 
                    class="text-red-600 hover:text-red-800"
                    title="حذف"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- نافذة إضافة/تعديل مستخدم -->
    <div v-if="showUserModal" class="fixed inset-0 z-30 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="closeUserModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد' }}
            </h3>
            
            <form @submit.prevent="saveUser">
              <div class="mb-4">
                <label for="user-name" class="form-label">الاسم</label>
                <input 
                  type="text" 
                  id="user-name" 
                  v-model="userForm.name" 
                  class="form-input"
                  required
                />
              </div>
              
              <div class="mb-4">
                <label for="user-email" class="form-label">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  id="user-email" 
                  v-model="userForm.email" 
                  class="form-input"
                  required
                />
              </div>
              
              <div class="mb-4" v-if="!editingUser">
                <label for="user-password" class="form-label">كلمة المرور</label>
                <input 
                  type="password" 
                  id="user-password" 
                  v-model="userForm.password" 
                  class="form-input"
                  required
                />
              </div>
              
              <div class="mb-4">
                <label for="user-role" class="form-label">الدور</label>
                <select id="user-role" v-model="userForm.role" class="form-input" required>
                  <option value="">اختر الدور</option>
                  <option value="admin">مدير عام</option>
                  <option value="sales_manager">مدير مبيعات</option>
                  <option value="sales_rep">مندوب مبيعات</option>
                </select>
              </div>
              
              <div class="flex justify-end space-x-2 space-x-reverse">
                <button 
                  type="button" 
                  class="btn bg-gray-200 text-gray-800 hover:bg-gray-300" 
                  @click="closeUserModal"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="saving"
                >
                  <span v-if="saving">جاري الحفظ...</span>
                  <span v-else>{{ editingUser ? 'تحديث' : 'إضافة' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- نافذة تأكيد الحذف -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-30 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="closeDeleteModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right">
                <h3 class="text-lg font-medium text-gray-900">تأكيد الحذف</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    هل أنت متأكد من رغبتك في حذف المستخدم "{{ userToDelete?.name }}"؟
                    <br />
                    لا يمكن التراجع عن هذا الإجراء.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                class="btn btn-danger w-full sm:w-auto sm:mr-3" 
                @click="deleteUser"
                :disabled="deleting"
              >
                <span v-if="deleting">جاري الحذف...</span>
                <span v-else>حذف</span>
              </button>
              <button 
                type="button" 
                class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 mt-3 w-full sm:mt-0 sm:w-auto" 
                @click="closeDeleteModal"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/services/supabase'
import { formatDate } from '@/utils/formatters'

export default {
  name: 'UsersView',
  setup() {
    const loading = ref(true)
    const users = ref([])
    const searchQuery = ref('')
    const sortField = ref('created_at')
    const sortDirection = ref('desc')
    
    // الحصول على بيانات المستخدم الحالي
    const currentUser = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // متغيرات النوافذ المنبثقة
    const showUserModal = ref(false)
    const showDeleteModal = ref(false)
    const editingUser = ref(null)
    const userToDelete = ref(null)
    const saving = ref(false)
    const deleting = ref(false)
    
    // نموذج المستخدم
    const userForm = ref({
      name: '',
      email: '',
      password: '',
      role: ''
    })
    
    // تصفية المستخدمين
    const filteredUsers = computed(() => {
      let result = users.value
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(user => 
          user.name.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
        )
      }
      
      // ترتيب النتائج
      result.sort((a, b) => {
        let aValue = a[sortField.value]
        let bValue = b[sortField.value]
        
        if (sortField.value === 'created_at') {
          aValue = new Date(aValue)
          bValue = new Date(bValue)
        }
        
        if (sortDirection.value === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
      
      return result
    })
    
    // جلب المستخدمين
    const fetchUsers = async () => {
      try {
        loading.value = true
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        users.value = data || []
      } catch (error) {
        console.error('خطأ في جلب المستخدمين:', error)
        users.value = []
      } finally {
        loading.value = false
      }
    }
    
    // ترتيب حسب الحقل
    const sortBy = (field) => {
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortField.value = field
        sortDirection.value = 'asc'
      }
    }
    
    // فتح نافذة إضافة مستخدم
    const openAddUserModal = () => {
      editingUser.value = null
      userForm.value = {
        name: '',
        email: '',
        password: '',
        role: ''
      }
      showUserModal.value = true
    }
    
    // تعديل مستخدم
    const editUser = (user) => {
      editingUser.value = user
      userForm.value = {
        name: user.name,
        email: user.email,
        password: '',
        role: user.role
      }
      showUserModal.value = true
    }
    
    // إغلاق نافذة المستخدم
    const closeUserModal = () => {
      showUserModal.value = false
      editingUser.value = null
    }
    
    // حفظ المستخدم
    const saveUser = async () => {
      try {
        saving.value = true
        
        if (editingUser.value) {
          // تحديث مستخدم موجود
          const { error } = await supabase
            .from('users')
            .update({
              name: userForm.value.name,
              email: userForm.value.email,
              role: userForm.value.role
            })
            .eq('id', editingUser.value.id)
          
          if (error) throw error
          
          // تحديث القائمة المحلية
          const index = users.value.findIndex(u => u.id === editingUser.value.id)
          if (index !== -1) {
            users.value[index] = {
              ...users.value[index],
              name: userForm.value.name,
              email: userForm.value.email,
              role: userForm.value.role
            }
          }
        } else {
          // إضافة مستخدم جديد
          const { data, error } = await supabase.auth.signUp({
            email: userForm.value.email,
            password: userForm.value.password,
            options: {
              data: {
                name: userForm.value.name,
                role: userForm.value.role
              }
            }
          })
          
          if (error) throw error
          
          // إعادة جلب المستخدمين
          await fetchUsers()
        }
        
        closeUserModal()
      } catch (error) {
        console.error('خطأ في حفظ المستخدم:', error)
        alert('حدث خطأ أثناء حفظ المستخدم')
      } finally {
        saving.value = false
      }
    }
    
    // تبديل حالة المستخدم
    const toggleUserStatus = async (user) => {
      try {
        const newStatus = user.status === 'active' ? 'inactive' : 'active'
        
        const { error } = await supabase
          .from('users')
          .update({ status: newStatus })
          .eq('id', user.id)
        
        if (error) throw error
        
        // تحديث القائمة المحلية
        const index = users.value.findIndex(u => u.id === user.id)
        if (index !== -1) {
          users.value[index].status = newStatus
        }
      } catch (error) {
        console.error('خطأ في تغيير حالة المستخدم:', error)
        alert('حدث خطأ أثناء تغيير حالة المستخدم')
      }
    }
    
    // التحقق من إمكانية حذف المستخدم
    const canDeleteUser = (user) => {
      return currentUser.value.role === 'admin' && user.id !== currentUser.value.id
    }
    
    // تأكيد حذف المستخدم
    const confirmDeleteUser = (user) => {
      userToDelete.value = user
      showDeleteModal.value = true
    }
    
    // إغلاق نافذة الحذف
    const closeDeleteModal = () => {
      showDeleteModal.value = false
      userToDelete.value = null
    }
    
    // حذف المستخدم
    const deleteUser = async () => {
      if (!userToDelete.value) return
      
      try {
        deleting.value = true
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userToDelete.value.id)
        
        if (error) throw error
        
        // إزالة المستخدم من القائمة
        users.value = users.value.filter(user => user.id !== userToDelete.value.id)
        
        closeDeleteModal()
      } catch (error) {
        console.error('خطأ في حذف المستخدم:', error)
        alert('حدث خطأ أثناء حذف المستخدم')
      } finally {
        deleting.value = false
      }
    }
    
    // دوال المساعدة
    const getRoleText = (role) => {
      const roles = {
        admin: 'مدير عام',
        sales_manager: 'مدير مبيعات',
        sales_rep: 'مندوب مبيعات'
      }
      return roles[role] || role
    }
    
    const getRoleClass = (role) => {
      const classes = {
        admin: 'bg-purple-100 text-purple-800',
        sales_manager: 'bg-blue-100 text-blue-800',
        sales_rep: 'bg-green-100 text-green-800'
      }
      return classes[role] || 'bg-gray-100 text-gray-800'
    }
    
    const getStatusText = (status) => {
      return status === 'active' ? 'نشط' : 'غير نشط'
    }
    
    const getStatusClass = (status) => {
      return status === 'active' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }
    
    // تهيئة الصفحة
    onMounted(() => {
      fetchUsers()
    })
    
    return {
      loading,
      users,
      filteredUsers,
      searchQuery,
      sortField,
      sortDirection,
      showUserModal,
      showDeleteModal,
      editingUser,
      userToDelete,
      saving,
      deleting,
      userForm,
      fetchUsers,
      sortBy,
      openAddUserModal,
      editUser,
      closeUserModal,
      saveUser,
      toggleUserStatus,
      canDeleteUser,
      confirmDeleteUser,
      closeDeleteModal,
      deleteUser,
      getRoleText,
      getRoleClass,
      getStatusText,
      getStatusClass,
      formatDate
    }
  }
}
</script>

<style scoped>
/* تنسيقات إضافية إذا لزم الأمر */
</style>

