import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, User, Mail, Lock, Shield, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { 
  validateUsername, 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword, 
  getPasswordStrength 
} from '@/utils/validation'
import { useToast } from '@/hooks/useToast'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [usernameTouched, setUsernameTouched] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)
  const { register, isLoading, error, clearError } = useAuthStore()
  const { showSuccess, showError } = useToast()
  const navigate = useNavigate()

  // 验证状态
  const usernameValidation = validateUsername(username)
  const emailValidation = validateEmail(email)
  const passwordValidation = validatePassword(password)
  const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword)
  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    // 设置所有字段为已触摸状态
    setUsernameTouched(true)
    setEmailTouched(true)
    setPasswordTouched(true)
    setConfirmPasswordTouched(true)

    // 验证表单
    if (!usernameValidation.isValid || !emailValidation.isValid || 
        !passwordValidation.isValid || !confirmPasswordValidation.isValid) {
      showError('表单验证失败', '请检查所有输入信息是否正确')
      return
    }
    
    try {
      await register(username, email, password)
      showSuccess('注册成功', '欢迎加入我们的博客社区！')
      navigate('/')
    } catch (error) {
      // 错误已经在store中处理，这里可以显示额外的错误提示
      showError('注册失败', '请检查输入信息或稍后重试')
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case 'username':
        setUsername(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      case 'confirmPassword':
        setConfirmPassword(value)
        break
    }
    
    // 清除错误信息
    if (error) {
      clearError()
    }
  }

  const handleFieldBlur = (field: string) => {
    switch (field) {
      case 'username':
        setUsernameTouched(true)
        break
      case 'email':
        setEmailTouched(true)
        break
      case 'password':
        setPasswordTouched(true)
        break
      case 'confirmPassword':
        setConfirmPasswordTouched(true)
        break
    }
  }

  // 获取密码强度颜色
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak':
        return 'text-red-500'
      case 'medium':
        return 'text-yellow-500'
      case 'strong':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 头部 */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              创建账户
            </h2>
            <p className="text-gray-600">
              加入我们，开始您的博客之旅
            </p>
          </div>

          {/* 表单 */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 用户名输入 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                用户名 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    usernameTouched && !usernameValidation.isValid
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : usernameTouched && usernameValidation.isValid
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="请输入用户名（3-20个字符）"
                  value={username}
                  onChange={(e) => handleFieldChange('username', e.target.value)}
                  onBlur={() => handleFieldBlur('username')}
                />
                {usernameTouched && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {usernameValidation.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {/* 用户名验证提示 */}
              {usernameTouched && !usernameValidation.isValid && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {usernameValidation.message}
                </motion.p>
              )}
            </div>

            {/* 邮箱输入 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    emailTouched && !emailValidation.isValid
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : emailTouched && emailValidation.isValid
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="请输入邮箱地址"
                  value={email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onBlur={() => handleFieldBlur('email')}
                />
                {emailTouched && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {emailValidation.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {/* 邮箱验证提示 */}
              {emailTouched && !emailValidation.isValid && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {emailValidation.message}
                </motion.p>
              )}
            </div>

            {/* 密码输入 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    passwordTouched && !passwordValidation.isValid
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : passwordTouched && passwordValidation.isValid
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="请输入密码（至少6个字符）"
                  value={password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  onBlur={() => handleFieldBlur('password')}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1">
                  {passwordTouched && (
                    passwordValidation.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {/* 密码验证提示 */}
              {passwordTouched && !passwordValidation.isValid && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {passwordValidation.message}
                </motion.p>
              )}
              {/* 密码强度提示 */}
              {password && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">密码强度：</span>
                    <span className={`font-medium ${getStrengthColor(passwordStrength.strength)}`}>
                      {passwordStrength.strength === 'weak' && '弱'}
                      {passwordStrength.strength === 'medium' && '中'}
                      {passwordStrength.strength === 'strong' && '强'}
                    </span>
                  </div>
                  {passwordStrength.message && (
                    <p className={`text-xs mt-1 ${getStrengthColor(passwordStrength.strength)}`}>
                      {passwordStrength.message}
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            {/* 确认密码输入 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                确认密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    confirmPasswordTouched && !confirmPasswordValidation.isValid
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : confirmPasswordTouched && confirmPasswordValidation.isValid
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="请再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                  onBlur={() => handleFieldBlur('confirmPassword')}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1">
                  {confirmPasswordTouched && (
                    confirmPasswordValidation.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {/* 确认密码验证提示 */}
              {confirmPasswordTouched && !confirmPasswordValidation.isValid && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600 flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {confirmPasswordValidation.message}
                </motion.p>
              )}
            </div>

            {/* 错误信息 */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center"
              >
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* 注册按钮 */}
            <div>
              <button
                type="submit"
                disabled={
                  isLoading || 
                  (usernameTouched && !usernameValidation.isValid) ||
                  (emailTouched && !emailValidation.isValid) ||
                  (passwordTouched && !passwordValidation.isValid) ||
                  (confirmPasswordTouched && !confirmPasswordValidation.isValid)
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>注册中...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>注册</span>
                  </>
                )}
              </button>
            </div>

            {/* 登录链接 */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                已有账户？{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  立即登录
                </Link>
              </p>
            </div>

            {/* 返回首页 */}
            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回首页</span>
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Register 