// 验证工具函数
export interface ValidationResult {
  isValid: boolean
  message: string
}

// 用户名验证
export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, message: '用户名不能为空' }
  }
  
  if (username.length < 3) {
    return { isValid: false, message: '用户名至少需要3个字符' }
  }
  
  if (username.length > 20) {
    return { isValid: false, message: '用户名不能超过20个字符' }
  }
  
  // 只允许字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]+$/
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: '用户名只能包含字母、数字和下划线' }
  }
  
  return { isValid: true, message: '' }
}

// 邮箱验证
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: '邮箱地址不能为空' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, message: '请输入有效的邮箱地址' }
  }
  
  return { isValid: true, message: '' }
}

// 密码验证
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: '密码不能为空' }
  }
  
  if (password.length < 6) {
    return { isValid: false, message: '密码至少需要6个字符' }
  }
  
  if (password.length > 50) {
    return { isValid: false, message: '密码不能超过50个字符' }
  }
  
  // 检查是否包含至少一个字母和一个数字
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  
  if (!hasLetter || !hasNumber) {
    return { isValid: false, message: '密码必须包含至少一个字母和一个数字' }
  }
  
  return { isValid: true, message: '' }
}

// 确认密码验证
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: '请确认密码' }
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: '两次输入的密码不一致' }
  }
  
  return { isValid: true, message: '' }
}

// 获取密码强度
export const getPasswordStrength = (password: string): { strength: 'weak' | 'medium' | 'strong', message: string } => {
  if (!password) {
    return { strength: 'weak', message: '' }
  }
  
  let score = 0
  let feedback = []
  
  // 长度检查
  if (password.length >= 8) score += 1
  else feedback.push('至少8个字符')
  
  // 包含数字
  if (/\d/.test(password)) score += 1
  else feedback.push('包含数字')
  
  // 包含小写字母
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('包含小写字母')
  
  // 包含大写字母
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('包含大写字母')
  
  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
  else feedback.push('包含特殊字符')
  
  if (score <= 2) {
    return { strength: 'weak', message: `建议：${feedback.slice(0, 2).join('、')}` }
  } else if (score <= 4) {
    return { strength: 'medium', message: `建议：${feedback.slice(0, 1).join('、')}` }
  } else {
    return { strength: 'strong', message: '密码强度很好！' }
  }
}

// 实时验证状态
export interface FieldValidation {
  value: string
  isValid: boolean
  message: string
  isTouched: boolean
}

export const getFieldValidation = (
  value: string,
  validator: (value: string) => ValidationResult,
  isTouched: boolean
): FieldValidation => {
  const result = validator(value)
  return {
    value,
    isValid: result.isValid,
    message: isTouched ? result.message : '',
    isTouched
  }
} 