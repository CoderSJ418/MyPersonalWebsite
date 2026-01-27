/**
 * 实时表单验证 Composable
 * 提供表单验证的各种功能
 */

import { ref, computed, watch, type Ref } from 'vue'

/**
 * 验证规则类型
 */
export type ValidationRule<T = any> = {
  /**
   * 验证函数
   * @param value 字段值
   * @param formData 整个表单数据
   * @returns 验证结果
   */
  validator: (value: T, formData?: Record<string, any>) => boolean | string
  
  /**
   * 错误消息
   */
  message?: string
  
  /**
   * 是否在用户输入后才开始验证
   * @default true
   */
  validateOnBlur?: boolean
  
  /**
   * 是否在值改变时立即验证
   * @default false
   */
  validateOnChange?: boolean
  
  /**
   * 是否在表单提交时验证
   * @default true
   */
  validateOnSubmit?: boolean
}

/**
 * 字段验证状态
 */
export interface FieldValidation<T = any> {
  /**
   * 字段值
   */
  value: Ref<T>
  
  /**
   * 是否已触摸（用户已交互过）
   */
  touched: Ref<boolean>
  
  /**
   * 是否已脏（值已改变）
   */
  dirty: Ref<boolean>
  
  /**
   * 是否有效
   */
  valid: Ref<boolean>
  
  /**
   * 错误消息
   */
  error: Ref<string | null>
  
  /**
   * 验证规则
   */
  rules: Ref<ValidationRule<T>[]>
  
  /**
   * 验证字段
   */
  validate: () => boolean
  
  /**
   * 重置字段
   */
  reset: () => void
  
  /**
   * 清除错误
   */
  clearError: () => void
  
  /**
   * 标记为已触摸
   */
  touch: () => void
}

/**
 * 表单验证状态
 */
export interface FormValidation {
  /**
   * 是否有效
   */
  valid: Ref<boolean>
  
  /**
   * 是否已提交
   */
  submitted: Ref<boolean>
  
  /**
   * 所有字段
   */
  fields: Record<string, FieldValidation>
  
  /**
   * 验证所有字段
   */
  validate: () => boolean
  
  /**
   * 验证特定字段
   */
  validateField: (fieldName: string) => boolean
  
  /**
   * 重置表单
   */
  reset: () => void
  
  /**
   * 提交表单
   */
  submit: (callback: (formData: Record<string, any>) => void | Promise<void>) => Promise<void>
  
  /**
   * 获取表单数据
   */
  getData: () => Record<string, any>
  
  /**
   * 设置表单数据
   */
  setData: (data: Record<string, any>) => void
}

/**
 * 常用验证规则
 */
export const validationRules = {
  /**
   * 必填
   */
  required: (message = '此字段为必填项'): ValidationRule => ({
    validator: (value) => {
      if (value === null || value === undefined || value === '') {
        return false
      }
      if (Array.isArray(value) && value.length === 0) {
        return false
      }
      return true
    },
    message,
    validateOnChange: true,
  }),
  
  /**
   * 最小长度
   */
  minLength: (min: number, message?: string): ValidationRule => ({
    validator: (value) => {
      if (typeof value !== 'string') return true
      return value.length >= min
    },
    message: message || `最少需要 ${min} 个字符`,
    validateOnChange: true,
  }),
  
  /**
   * 最大长度
   */
  maxLength: (max: number, message?: string): ValidationRule => ({
    validator: (value) => {
      if (typeof value !== 'string') return true
      return value.length <= max
    },
    message: message || `最多只能 ${max} 个字符`,
    validateOnChange: true,
  }),
  
  /**
   * 邮箱格式
   */
  email: (message = '请输入有效的邮箱地址'): ValidationRule => ({
    validator: (value) => {
      if (!value) return true
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    message,
    validateOnChange: true,
  }),
  
  /**
   * 手机号码
   */
  phone: (message = '请输入有效的手机号码'): ValidationRule => ({
    validator: (value) => {
      if (!value) return true
      const phoneRegex = /^1[3-9]\d{9}$/
      return phoneRegex.test(value)
    },
    message,
    validateOnChange: true,
  }),
  
  /**
   * URL 格式
   */
  url: (message = '请输入有效的 URL'): ValidationRule => ({
    validator: (value) => {
      if (!value) return true
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
    message,
    validateOnChange: true,
  }),
  
  /**
   * 数字
   */
  number: (message = '请输入有效的数字'): ValidationRule => ({
    validator: (value) => {
      if (!value) return true
      return !isNaN(Number(value))
    },
    message,
    validateOnChange: true,
  }),
  
  /**
   * 最小值
   */
  min: (min: number, message?: string): ValidationRule => ({
    validator: (value) => {
      if (!value) return true
      return Number(value) >= min
    },
    message: message || `最小值为 ${min}`,
    validateOnChange: true,
  }),
  
  /**
   * 最大值
   */
  max: (max: number, message?: string): ValidationRule => ({
    validator: (value) => {
      if (!value) return true
      return Number(value) <= max
    },
    message: message || `最大值为 ${max}`,
    validateOnChange: true,
  }),
  
  /**
   * 正则表达式
   */
  pattern: (regex: RegExp, message = '格式不正确'): ValidationRule => ({
    validator: (value) => {
      if (!value) return true
      return regex.test(value)
    },
    message,
    validateOnChange: true,
  }),
  
  /**
   * 自定义验证
   */
  custom: (
    validator: (value: any, formData?: Record<string, any>) => boolean | string,
    message?: string
  ): ValidationRule => ({
    validator,
    message,
    validateOnChange: true,
  }),
  
  /**
   * 确认密码
   */
  confirmPassword: (
    passwordFieldName: string,
    message = '两次输入的密码不一致'
  ): ValidationRule => ({
    validator: (value, formData) => {
      if (!value) return true
      return value === formData?.[passwordFieldName]
    },
    message,
    validateOnChange: true,
  }),
} as const

/**
 * 创建字段验证
 */
function createFieldValidation<T = any>(
  initialValue: T,
  rules: ValidationRule<T>[] = [],
  formData?: Ref<Record<string, any>>
): FieldValidation<T> {
  const value = ref(initialValue) as Ref<T>
  const touched = ref(false)
  const dirty = ref(false)
  const error = ref<string | null>(null)
  
  const valid = computed(() => !error.value)
  
  /**
   * 验证字段
   */
  function validate(): boolean {
    if (rules.length === 0) {
      error.value = null
      return true
    }
    
    for (const rule of rules) {
      const result = rule.validator(value.value, formData?.value)
      
      if (result === false) {
        error.value = rule.message || '验证失败'
        return false
      }
      
      if (typeof result === 'string') {
        error.value = result
        return false
      }
    }
    
    error.value = null
    return true
  }
  
  /**
   * 重置字段
   */
  function reset(): void {
    value.value = initialValue
    touched.value = false
    dirty.value = false
    error.value = null
  }
  
  /**
   * 清除错误
   */
  function clearError(): void {
    error.value = null
  }
  
  /**
   * 标记为已触摸
   */
  function touch(): void {
    touched.value = true
  }
  
  // 监听值变化
  watch(
    value,
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        dirty.value = true
        
        // 如果配置了 validateOnChange，立即验证
        if (rules.some((rule) => rule.validateOnChange)) {
          validate()
        }
      }
    },
    { deep: true }
  )
  
  return {
    value,
    touched,
    dirty,
    valid,
    error,
    rules: ref(rules),
    validate,
    reset,
    clearError,
    touch,
  }
}

/**
 * 使用表单验证
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, ValidationRule[]> = {} as any
): FormValidation {
  const formData = ref<T>({ ...initialValues })
  const submitted = ref(false)
  
  // 创建字段验证
  const fields = Object.keys(initialValues).reduce((acc, key) => {
    acc[key] = createFieldValidation(
      initialValues[key],
      validationRules[key] || [],
      formData
    )
    return acc
  }, {} as Record<string, FieldValidation>)
  
  /**
   * 是否有效
   */
  const valid = computed(() => {
    return Object.values(fields).every((field) => field.valid.value)
  })
  
  /**
   * 验证所有字段
   */
  function validate(): boolean {
    return Object.values(fields).every((field) => field.validate())
  }
  
  /**
   * 验证特定字段
   */
  function validateField(fieldName: string): boolean {
    return fields[fieldName]?.validate() ?? true
  }
  
  /**
   * 重置表单
   */
  function reset(): void {
    submitted.value = false
    Object.values(fields).forEach((field) => field.reset())
    formData.value = { ...initialValues }
  }
  
  /**
   * 提交表单
   */
  async function submit(
    callback: (formData: Record<string, any>) => void | Promise<void>
  ): Promise<void> {
    submitted.value = true
    
    // 验证所有字段
    const isValid = validate()
    
    if (!isValid) {
      throw new Error('表单验证失败')
    }
    
    // 执行回调
    await callback(getData())
  }
  
  /**
   * 获取表单数据
   */
  function getData(): Record<string, any> {
    const data: Record<string, any> = {}
    Object.keys(fields).forEach((key) => {
      data[key] = fields[key].value.value
    })
    return data
  }
  
  /**
   * 设置表单数据
   */
  function setData(data: Record<string, any>): void {
    Object.keys(data).forEach((key) => {
      if (fields[key]) {
        fields[key].value.value = data[key]
      }
    })
    formData.value = { ...getData() }
  }
  
  // 监听所有字段值变化，更新 formData
  watch(
    () => getData(),
    (newData) => {
      formData.value = newData
    },
    { deep: true }
  )
  
  return {
    valid,
    submitted,
    fields,
    validate,
    validateField,
    reset,
    submit,
    getData,
    setData,
  }
}