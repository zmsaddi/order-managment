<template>
  <div class="number-input-wrapper">
    <input
      :type="inputType"
      :value="displayValue"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :class="inputClass"
      :inputmode="inputMode"
      :pattern="pattern"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      ref="input"
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { convertToEnglishNumbers, parseEnglishNumber } from '../utils/formatters';

export default {
  name: 'NumberInput',
  props: {
    // القيمة المرتبطة بالحقل
    modelValue: {
      type: [Number, String],
      default: ''
    },
    // نوع الحقل (text أو number)
    type: {
      type: String,
      default: 'text'
    },
    // النص التوضيحي
    placeholder: {
      type: String,
      default: ''
    },
    // القيمة الدنيا (للأرقام)
    min: {
      type: [Number, String],
      default: null
    },
    // القيمة القصوى (للأرقام)
    max: {
      type: [Number, String],
      default: null
    },
    // خطوة الزيادة/النقصان (للأرقام)
    step: {
      type: [Number, String],
      default: 'any'
    },
    // عدد المنازل العشرية
    decimals: {
      type: Number,
      default: null
    },
    // تعطيل الحقل
    disabled: {
      type: Boolean,
      default: false
    },
    // للقراءة فقط
    readonly: {
      type: Boolean,
      default: false
    },
    // إلزامي
    required: {
      type: Boolean,
      default: false
    },
    // فئات CSS إضافية
    inputClass: {
      type: String,
      default: ''
    },
    // نوع لوحة المفاتيح على الموبايل
    inputMode: {
      type: String,
      default: 'numeric'
    },
    // نمط التحقق
    pattern: {
      type: String,
      default: '[0-9]*'
    },
    // تحديد النص عند التركيز
    selectOnFocus: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['update:modelValue', 'input', 'change', 'blur', 'focus'],
  
  setup(props, { emit }) {
    const input = ref(null);
    const internalValue = ref(props.modelValue);
    
    // القيمة المعروضة (مع تحويل الأرقام العربية إلى إنجليزية)
    const displayValue = computed(() => {
      if (internalValue.value === null || internalValue.value === undefined || internalValue.value === '') {
        return '';
      }
      
      // تحويل الأرقام العربية إلى إنجليزية
      return convertToEnglishNumbers(internalValue.value.toString());
    });
    
    // نوع الحقل (text للموبايل، number للكمبيوتر)
    const inputType = computed(() => {
      // استخدام text على الموبايل لتجنب مشاكل التوافق
      return 'text';
    });
    
    // مراقبة تغيرات القيمة من الخارج
    watch(() => props.modelValue, (newValue) => {
      internalValue.value = newValue;
    });
    
    // معالجة الإدخال (تحويل تلقائي للأرقام العربية إلى إنجليزية)
    const handleInput = (event) => {
      const rawValue = event.target.value;
      
      // تحويل الأرقام العربية إلى إنجليزية
      const convertedValue = convertToEnglishNumbers(rawValue);
      
      // تحديث القيمة الداخلية
      internalValue.value = convertedValue;
      
      // إرسال القيمة المحولة للأعلى
      emit('update:modelValue', convertedValue);
      emit('input', convertedValue);
      
      // تحديث قيمة الحقل مباشرة لضمان عرض الأرقام الإنجليزية
      if (input.value && input.value.value !== convertedValue) {
        input.value.value = convertedValue;
      }
    };
    
    // معالجة فقدان التركيز
    const handleBlur = (event) => {
      const rawValue = event.target.value;
      
      // تحويل الأرقام العربية إلى إنجليزية
      const convertedValue = convertToEnglishNumbers(rawValue);
      
      // تطبيق التنسيق حسب نوع الحقل
      let formattedValue = convertedValue;
      
      // إذا كان الحقل رقمي وله منازل عشرية محددة
      if (props.decimals !== null && convertedValue !== '') {
        const numericValue = parseEnglishNumber(convertedValue);
        formattedValue = numericValue.toFixed(props.decimals);
      }
      
      // تحديث القيمة الداخلية
      internalValue.value = formattedValue;
      
      // إرسال القيمة المنسقة للأعلى
      emit('update:modelValue', formattedValue);
      emit('change', formattedValue);
      emit('blur', event);
      
      // تحديث قيمة الحقل مباشرة
      if (input.value && input.value.value !== formattedValue) {
        input.value.value = formattedValue;
      }
    };
    
    // معالجة التركيز
    const handleFocus = (event) => {
      emit('focus', event);
      
      // تحديد النص عند التركيز إذا كان مطلوباً
      if (props.selectOnFocus && input.value) {
        input.value.select();
      }
    };
    
    // عند تركيب المكون
    onMounted(() => {
      // تحويل القيمة الأولية إذا كانت تحتوي على أرقام عربية
      if (internalValue.value) {
        const convertedValue = convertToEnglishNumbers(internalValue.value.toString());
        if (convertedValue !== internalValue.value.toString()) {
          internalValue.value = convertedValue;
          emit('update:modelValue', convertedValue);
        }
      }
    });
    
    return {
      input,
      displayValue,
      inputType,
      handleInput,
      handleBlur,
      handleFocus
    };
  }
};
</script>

<style scoped>
.number-input-wrapper {
  display: inline-block;
  width: 100%;
}
</style>

