<template>
  <div class="reset-container">
    <div class="reset-card">
      <h2 class="text-center">إعادة تعيين كلمة المرور</h2>
      
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
      
      <form @submit.prevent="handleResetPassword" v-if="!successMessage">
        <div class="form-group">
          <label for="password">كلمة المرور الجديدة</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            class="form-input" 
            placeholder="أدخل كلمة المرور الجديدة" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">تأكيد كلمة المرور</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            class="form-input" 
            placeholder="أدخل كلمة المرور مرة أخرى" 
            required
          />
        </div>
        
        <div class="form-group text-center">
          <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading">
            {{ isLoading ? 'جاري إعادة التعيين...' : 'إعادة تعيين كلمة المرور' }}
          </button>
        </div>
      </form>
      
      <div class="text-center mt-3" v-if="successMessage">
        <button class="btn btn-primary" @click="goToLogin">العودة إلى تسجيل الدخول</button>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/auth.service';

export default {
  name: 'ResetPasswordView',
  data() {
    return {
      password: '',
      confirmPassword: '',
      errorMessage: '',
      successMessage: '',
      isLoading: false
    };
  },
  methods: {
    async handleResetPassword() {
      this.errorMessage = '';
      
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'كلمات المرور غير متطابقة';
        return;
      }
      
      if (this.password.length < 6) {
        this.errorMessage = 'يجب أن تكون كلمة المرور 6 أحرف على الأقل';
        return;
      }
      
      this.isLoading = true;
      
      try {
        await authService.changePassword(this.password);
        this.successMessage = 'تم إعادة تعيين كلمة المرور بنجاح';
        this.password = '';
        this.confirmPassword = '';
      } catch (error) {
        console.error('خطأ في إعادة تعيين كلمة المرور:', error);
        this.errorMessage = error.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور';
      } finally {
        this.isLoading = false;
      }
    },
    
    goToLogin() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.reset-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.reset-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-block {
  width: 100%;
}

.mt-3 {
  margin-top: 1rem;
}

.alert {
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
</style>
