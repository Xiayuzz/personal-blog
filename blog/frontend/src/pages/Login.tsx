import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { validateEmail, validatePassword, FieldValidation } from '@/utils/validation'
import { useToast } from '@/hooks/useToast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const { login, isLoading, error, clearError } = useAuthStore()
  const { showSuccess, showError } = useToast()
  const navigate = useNavigate()

  // 验证状态
  const emailValidation = validateEmail(email)
  const passwordValidation = validatePassword(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    // 设置所有字段为已触摸状态
    setEmailTouched(true)
    setPasswordTouched(true)
    
    // 验证表单
    if (!emailValidation.isValid || !passwordValidation.isValid) {
      showError('表单验证失败', '请检查输入信息是否正确')
      return
    }
    
    try {
      await login(email, password)
      showSuccess('登录成功', '欢迎回来！')
      navigate('/')
    } catch (error) {
      // 错误已经在store中处理，这里可以显示额外的错误提示
      showError('登录失败', '请检查邮箱和密码是否正确')
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailTouched) {
      clearError()
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (passwordTouched) {
      clearError()
    }
  }

  const handleEmailBlur = () => {
    setEmailTouched(true)
  }

  const handlePasswordBlur = () => {
    setPasswordTouched(true)
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
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              欢迎回来
            </h2>
            <p className="text-gray-600">
              登录您的账户以继续
            </p>
          </div>

          {/* 表单 */}
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
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
                  autoComplete="current-password"
                  required
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    passwordTouched && !passwordValidation.isValid
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : passwordTouched && passwordValidation.isValid
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="请输入密码"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
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

            {/* 登录按钮 */}
            <div>
              <button
                type="submit"
                disabled={isLoading || (emailTouched && !emailValidation.isValid) || (passwordTouched && !passwordValidation.isValid)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>登录中...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>登录</span>
                  </>
                )}
              </button>
            </div>

            {/* 注册链接 */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                还没有账户？{' '}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  立即注册
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

export default Login 