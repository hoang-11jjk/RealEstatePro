import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { login, setMode } from '../../store/authSlice'
import { showToast } from '../../store/uiSlice'

type Props = {
  redirectPath?: string
}

function AuthForm({ redirectPath = '/' }: Props) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const mode = useAppSelector((state) => state.auth.mode)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (mode === 'register' && form.password !== form.confirmPassword) {
      setPasswordError('Mật khẩu không khớp')
      return
    }

    const name = mode === 'login' ? form.email.split('@')[0] || 'Người dùng' : form.fullName
    dispatch(login({ fullName: name, email: form.email }))
    dispatch(showToast(`${mode === 'login' ? 'Đăng nhập' : 'Đăng ký'} thành công. Chào mừng ${name}!`))
    navigate(redirectPath)
    navigate(redirectPath)
    setForm({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
    setPasswordError('')
  }

  return (
    <div className="animate-slide-in rounded-2xl bg-gradient-to-br from-white via-slate-50 to-white p-8 shadow-xl shadow-slate-900/10 transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-600 font-semibold">Tài khoản</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {mode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {mode === 'login' 
              ? 'Đăng nhập để đăng tin và quản lý bất động sản' 
              : 'Đăng ký để bắt đầu đăng tin miễn phí'}
          </p>
        </div>
        <div className="inline-flex rounded-full bg-slate-100 p-1.5 shadow-inner">
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
              mode === 'login' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => dispatch(setMode('login'))}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
              mode === 'register' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => dispatch(setMode('register'))}
          >
            Đăng ký
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === 'register' && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="text-cyan-600">●</span> Họ và tên đầy đủ
            </label>
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Nguyễn Văn A"
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300 placeholder:text-slate-400"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="text-blue-600">●</span> Địa chỉ Email
          </label>
          <div className="relative">
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="email@example.com"
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 pl-11 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300 placeholder:text-slate-400"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
        </div>

        {mode === 'register' && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="text-emerald-600">●</span> Số điện thoại
            </label>
            <div className="relative">
              <input
                required
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="0901 234 567"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 pl-11 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300 placeholder:text-slate-400"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="text-purple-600">●</span> Mật khẩu
          </label>
          <div className="relative">
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, password: e.target.value }))
                if (mode === 'register' && form.confirmPassword && e.target.value !== form.confirmPassword) {
                  setPasswordError('Mật khẩu không khớp')
                } else if (mode === 'register' && form.confirmPassword && e.target.value === form.confirmPassword) {
                  setPasswordError('')
                }
              }}
              placeholder="••••••••"
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 pl-11 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300 placeholder:text-slate-400"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {mode === 'register' && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="text-purple-600">●</span> Nhập lại mật khẩu
            </label>
            <div className="relative">
              <input
                required
                type="password"
                value={form.confirmPassword}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  if (form.password && e.target.value !== form.password) {
                    setPasswordError('Mật khẩu không khớp')
                  } else {
                    setPasswordError('')
                  }
                }}
                placeholder="••••••••"
                className={`w-full rounded-xl border-2 bg-white px-4 py-3 pl-11 text-sm outline-none transition-all duration-200 focus:ring-4 placeholder:text-slate-400 ${
                  passwordError 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                    : 'border-slate-200 focus:border-cyan-500 focus:ring-cyan-100 hover:border-slate-300'
                }`}
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            {passwordError && (
              <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {passwordError}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2 relative">
          {mode === 'login' && (
            <button type="button" className="absolute right-0 top-0 text-xs text-cyan-600 hover:text-cyan-700 font-semibold hover:underline transition-colors">
              Quên mật khẩu?
            </button>
          )}
        </div>

        {mode === 'register' && (
          <div className="rounded-xl bg-cyan-50 border border-cyan-100 p-4">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-cyan-800">
                <p className="font-semibold">Lợi ích khi đăng ký:</p>
                <ul className="mt-1 space-y-0.5 list-disc list-inside">
                  <li>Đăng tin bất động sản miễn phí không giới hạn</li>
                  <li>Quản lý tin đăng dễ dàng</li>
                  <li>Nhận thông báo về người quan tâm</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-600/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-600/40 active:translate-y-0"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {mode === 'login' ? (
              <>
                Đăng nhập ngay
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </>
            ) : (
              <>
                Tạo tài khoản
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </>
            )}
          </span>
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </button>

        <p className="text-center text-xs text-slate-500 pt-2">
          {mode === 'login' ? (
            <>
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => dispatch(setMode('register'))}
                className="font-semibold text-cyan-600 hover:text-cyan-700 hover:underline transition-colors"
              >
                Đăng ký ngay
              </button>
            </>
          ) : (
            <>
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => dispatch(setMode('login'))}
                className="font-semibold text-cyan-600 hover:text-cyan-700 hover:underline transition-colors"
              >
                Đăng nhập
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  )
}

export default AuthForm
