<template>
  <div class="min-h-screen bg-gray-50">
    <!-- القائمة الجانبية والشريط العلوي -->
    <div class="flex h-screen overflow-hidden">
      <!-- القائمة الجانبية -->
      <SidebarMenu 
        :user="user" 
        :mobile-open="mobileOpen"
        @close="mobileOpen = false"
      />
      
      <!-- المحتوى الرئيسي -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- الشريط العلوي -->
        <header class="bg-white shadow-sm z-10">
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center">
              <button @click="toggleSidebar" class="md:hidden ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 class="text-xl font-semibold text-gray-800">إدارة المستخدمين</h2>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-600 ml-2">{{ user.name }}</span>
              <div class="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white">
                {{ user.name.charAt(0) }}
              </div>
            </div>
          </div>
        </header>
        
        
        <!-- محتوى الصفحة -->
        <main class="flex-1 overflow-y-auto p-4">
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
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900">{{ user.name }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">{{ user.email }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">{{ getRoleName(user.role) }}</td>
                    <td class="px-4 py-3 text-sm">
                      <span :class="getStatusClass(user.status)" class="px-2 py-1 text-xs rounded-full">
                        {{ getStatusName(user.status) }}
                      </span>
                    </td>
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
        </main>
      </div>
    </div>
    
    <!-- نافذة إضافة مستخدم جديد -->
    <div v-if="showAddUserModal" class="fixed inset-0 z-30 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="closeAddUserModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right w-full">
                <h3 class="text-lg font-medium text-gray-900">إضافة مستخدم جديد</h3>
                <div class="mt-4">
                  <form @submit.prevent="addUser">
                    <div class="mb-4">
                      <label for="name" class="form-label">الاسم <span class="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        id="name" 
                        v-model="newUser.name" 
                        class="form-input" 
                        required
                      />
                    </div>
                    
                    <div class="mb-4">
                      <label for="email" class="form-label">البريد الإلكتروني <span class="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        id="email" 
                        v-model="newUser.email" 
                        class="form-input" 
                        required
                      />
                    </div>
                    
                    <div class="mb-4">
                      <label for="password" class="form-label">كلمة المرور <span class="text-red-500">*</span></label>
                      <input 
                        type="password" 
                        id="password" 
                        v-model="newUser.password" 
                        class="form-input" 
                        required
                      />
                    </div>
                    
                    <div class="mb-4">
                      <label for="phone" class="form-label">رقم الهاتف</label>
                      <input 
                        type="text" 
                        id="phone" 
                        v-model="newUser.phone" 
                        class="form-input"
                      />
                    </div>
                    
                    <div class="mb-4">
                      <label for="role" class="form-label">الدور <span class="text-red-500">*</span></label>
                      <select 
                        id="role" 
                        v-model="newUser.role" 
                        class="form-input" 
                        required
                      >
                        <option value="admin">مدير</option>
                        <option value="sales_manager">مدير مبيعات</option>
                        <option value="sales_rep">مندوب مبيعات</option>
                      </select>
                    </div>
                    
                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button 
                        type="submit" 
                        class="btn btn-primary w-full sm:w-auto sm:mr-3" 
                        :disabled="submitting"
                      >
                        <span v-if="submitting">جاري الإضافة...</span>
                        <span v-else>إضافة</span>
                      </button>
                      <button 
                        type="button" 
                        class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 mt-3 w-full sm:mt-0 sm:w-auto" 
                        @click="closeAddUserModal"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- نافذة تعديل مستخدم -->
    <div v-if="showEditUserModal" class="fixed inset-0 z-30 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="closeEditUserModal">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right w-full">
                <h3 class="text-lg font-medium text-gray-900">تعديل المستخدم</h3>
                <div class="mt-4">
                  <form @submit.prevent="updateUser">
                    <div class="mb-4">
                      <label for="edit-name" class="form-label">الاسم <span class="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        id="edit-name" 
                        v-model="editingUser.name" 
                        class="form-input" 
                        required
                      />
                    </div>
                    
                    <div class="mb-4">
                      <label for="edit-email" class="form-label">البريد الإلكتروني <span class="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        id="edit-email" 
                        v-model="editingUser.email" 
                        class="form-input" 
                        required
                        disabled
                      />
                    </div>
                    
                    <div class="mb-4">
                      <label for="edit-phone" class="form-label">رقم الهاتف</label>
                      <input 
                        type="text" 
                        id="edit-phone" 
                        v-model="editingUser.phone" 
                        class="form-input"
                      />
                    </div>
                    
                    <div class="mb-4">
                      <label for="edit-password" class="form-label">كلمة المرور (اتركها فارغة إذا لم ترغب في تغييرها)</label>
                      <input 
                        type="password" 
                        id="edit-password" 
                        v-model="editingUser.password" 
                        class="form-input text-center"
                        placeholder="أدخل كلمة المرور الجديدة"
                        minlength="6"
                      />
                      <p class="text-xs text-gray-500 mt-1 text-center">يجب أن تكون كلمة المرور 6 أحرف على الأقل</p>
                    </div>
                    
                    <div class="mb-4">
                      <label for="edit-role" class="form-label">الدور <span class="text-red-500">*</span></label>
                      <select 
                        id="edit-role" 
                        v-model="editingUser.role" 
                        class="form-input" 
                        required
                      >
                        <option value="admin">مدير</option>
                        <option value="sales_manager">مدير مبيعات</option>
                        <option value="sales_rep">مندوب مبيعات</option>
                      </select>
                    </div>
                    
                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button 
                        type="submit" 
                        class="btn btn-primary w-full sm:w-auto sm:mr-3" 
                        :disabled="submitting"
                      >
                        <span v-if="submitting">جاري الحفظ...</span>
                        <span v-else>حفظ التغييرات</span>
                      </button>
                      <button 
                        type="button" 
                        class="btn bg-gray-200 text-gray-800 hover:bg-gray-300 mt-3 w-full sm:mt-0 sm:w-auto" 
                        @click="closeEditUserModal"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
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
import { authService } from '@/services/auth.service'
import SidebarMenu from '@/components/SidebarMenu.vue'

export default {
  name: 'UsersView',
  components: {
    SidebarMenu
  },
  setup() {
    const mobileOpen = ref(false)
    const loading = ref(true)
    const users = ref([])
    const searchQuery = ref('')
    const sortField = ref('name')
    const sortDirection = ref('asc')
    
    // الحصول على بيانات المستخدم الحالي من التخزين المحلي
    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    
    // التحقق من صلاحيات المستخدم
    const isAdmin = computed(() => {
      return ['admin', 'sales_manager'].includes(user.value.role)
    })
    
    // تصفية المستخدمين حسب البحث
    const filteredUsers = computed(() => {
      let result = users.value
      
      // تصفية حسب البحث
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(user => 
          user.name.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query) ||
          getRoleName(user.role).toLowerCase().includes(query)
        )
      }
      
      // فرز النتائج
      result = [...result].sort((a, b) => {
        let valA, valB;
        
        // تحديد قيم المقارنة بناءً على حقل الفرز
        switch (sortField.value) {
          case 'name':
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
            break;
          case 'email':
            valA = a.email.toLowerCase();
            valB = b.email.toLowerCase();
            break;
          case 'role':
            valA = a.role;
            valB = b.role;
            break;
          case 'status':
            valA = a.status;
            valB = b.status;
            break;
          default:
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
            break;
        }
        
        // تطبيق اتجاه الفرز
        if (sortDirection.value === 'asc') {
          return valA > valB ? 1 : valA < valB ? -1 : 0;
        } else {
          return valA < valB ? 1 : valA > valB ? -1 : 0;
        }
      });
      
      return result;
    })
    
    // تبديل حالة القائمة الجانبية للجوال
    const toggleSidebar = () => {
      mobileOpen.value = !mobileOpen.value
    }
    
    // تغيير حقل الفرز
    const sortBy = (field) => {
      // إذا كان نفس الحقل، نعكس الاتجاه
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      } else {
        // إذا كان حقل جديد، نعين الحقل ونبدأ بالترتيب التصاعدي
        sortField.value = field
        sortDirection.value = 'asc'
      }
    }
    
    // جلب المستخدمين من قاعدة البيانات
    const fetchUsers = async () => {
      loading.value = true
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
        
        if (error) throw error
        
        users.value = data
      } catch (error) {
        console.error('خطأ في جلب المستخدمين:', error)
      } finally {
        loading.value = false
      }
    }
    
    // الحصول على اسم الدور
    const getRoleName = (role) => {
      switch (role) {
        case 'admin':
          return 'مدير'
        case 'sales_manager':
          return 'مدير مبيعات'
        case 'sales_rep':
          return 'مندوب مبيعات'
        default:
          return role
      }
    }
    
    // الحصول على اسم الحالة
    const getStatusName = (status) => {
      switch (status) {
        case 'active':
          return 'نشط'
        case 'inactive':
          return 'غير نشط'
        case 'pending':
          return 'معلق'
        default:
          return status
      }
    }
    
    // الحصول على فئة CSS للحالة
    const getStatusClass = (status) => {
      switch (status) {
        case 'active':
          return 'bg-green-100 text-green-800'
        case 'inactive':
          return 'bg-red-100 text-red-800'
        case 'pending':
          return 'bg-yellow-100 text-yellow-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    // تسجيل الخروج
    const logout = async () => {
      try {
        await authService.logout()
      } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error)
      }
    }
    
    // متغيرات إضافة مستخدم جديد
    const showAddUserModal = ref(false)
    const submitting = ref(false)
    const newUser = ref({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'sales_rep'
    })
    
    // فتح نافذة إضافة مستخدم جديد
    const openAddUserModal = () => {
      // إعادة تعيين النموذج
      newUser.value = {
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'sales_rep'
      }
      
      showAddUserModal.value = true
    }
    
    // إغلاق نافذة إضافة مستخدم جديد
    const closeAddUserModal = () => {
      showAddUserModal.value = false
    }
    
    // إضافة مستخدم جديد
    const addUser = async () => {
      submitting.value = true
      
      try {
        const result = await authService.createUser({
          name: newUser.value.name,
          email: newUser.value.email,
          password: newUser.value.password,
          phone: newUser.value.phone,
          role: newUser.value.role
        })
        
        if (result.error) throw result.error
        
        // إغلاق النافذة وإعادة تحميل المستخدمين
        closeAddUserModal()
        
        // إعادة تحميل المستخدمين وتحديث الواجهة
        await fetchUsers()
        
        // تأخير قصير لضمان تحديث واجهة المستخدم
        setTimeout(() => {
          // تحديث قائمة المستخدمين مرة أخرى للتأكد من التحديث
          fetchUsers()
        }, 500)
      } catch (error) {
        console.error('خطأ في إضافة المستخدم:', error)
        alert('حدث خطأ أثناء إضافة المستخدم. يرجى المحاولة مرة أخرى.')
      } finally {
        submitting.value = false
      }
    }
    
    // متغيرات تعديل المستخدم
    const showEditUserModal = ref(false)
    const editingUser = ref({
      id: null,
      name: '',
      email: '',
      phone: '',
      role: '',
      password: ''
    })
    
    // فتح نافذة تعديل المستخدم
    const editUser = (userToEdit) => {
      editingUser.value = { ...userToEdit }
      showEditUserModal.value = true
    }
    
    // إغلاق نافذة تعديل المستخدم
    const closeEditUserModal = () => {
      showEditUserModal.value = false
    }
    
    // تحديث المستخدم
    const updateUser = async () => {
      submitting.value = true
      
      try {
        // تحديث بيانات المستخدم الأساسية
        const { error } = await supabase
          .from('users')
          .update({
            name: editingUser.value.name,
            phone: editingUser.value.phone,
            role: editingUser.value.role
          })
          .eq('id', editingUser.value.id)
        
        if (error) throw error
        
        // إذا تم إدخال كلمة مرور جديدة، قم بتحديثها
        if (editingUser.value.password && editingUser.value.password.length >= 6) {
          const { error: passwordError } = await authService.updateUserPassword(
            editingUser.value.id,
            editingUser.value.password
          )
          
          if (passwordError) throw passwordError
        }
        
        // إغلاق النافذة وإعادة تحميل المستخدمين
        closeEditUserModal()
        await fetchUsers()
      } catch (error) {
        console.error('خطأ في تحديث المستخدم:', error)
        alert('حدث خطأ أثناء تحديث المستخدم. يرجى المحاولة مرة أخرى.')
      } finally {
        submitting.value = false
      }
    }
    
    // متغيرات حذف المستخدم
    const showDeleteModal = ref(false)
    const deleting = ref(false)
    const userToDelete = ref(null)
    
    // فتح نافذة تأكيد الحذف
    const confirmDeleteUser = (userToConfirmDelete) => {
      userToDelete.value = userToConfirmDelete
      showDeleteModal.value = true
    }
    
    // إغلاق نافذة تأكيد الحذف
    const closeDeleteModal = () => {
      showDeleteModal.value = false
    }
    
    // حذف المستخدم
    const deleteUser = async () => {
      if (!userToDelete.value) return
      
      deleting.value = true
      
      try {
        const result = await authService.deleteUser(userToDelete.value.id)
        
        if (result.error) throw result.error
        
        // إغلاق النافذة وإعادة تحميل المستخدمين
        closeDeleteModal()
        await fetchUsers()
      } catch (error) {
        console.error('خطأ في حذف المستخدم:', error)
        alert('حدث خطأ أثناء حذف المستخدم. يرجى المحاولة مرة أخرى.')
      } finally {
        deleting.value = false
      }
    }
    
    // تهيئة الصفحة
    onMounted(() => {
      fetchUsers()
    })
    
    return {
      user,
      isAdmin,
      mobileOpen,
      toggleSidebar,
      loading,
      users,
      searchQuery,
      filteredUsers,
      sortField,
      sortDirection,
      sortBy,
      getRoleName,
      getStatusName,
      getStatusClass,
      logout,
      showAddUserModal,
      submitting,
      newUser,
      openAddUserModal,
      closeAddUserModal,
      addUser,
      showEditUserModal,
      editingUser,
      editUser,
      closeEditUserModal,
      updateUser,
      showDeleteModal,
      deleting,
      userToDelete,
      confirmDeleteUser,
      closeDeleteModal,
      deleteUser
    }
  }
}
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm;
}

.btn {
  @apply inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
}
</style>
