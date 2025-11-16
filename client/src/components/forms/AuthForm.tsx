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
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = mode === 'login' ? form.email.split('@')[0] || 'Người dùng' : form.fullName
    dispatch(login({ fullName: name, email: form.email }))
    dispatch(showToast(`${mode === 'login' ? 'Đăng nhập' : 'Đăng ký'} thành công. Chào mừng ${name}!`))
    navigate(redirectPath)
    setForm({ fullName: '', email: '', phone: '', password: '' })
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md shadow-slate-900/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-600">Tài khoản</p>
          <h3 className="text-xl font-bold text-slate-900">
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản mới'}
          </h3>
        </div>
        <div className="inline-flex rounded-full bg-slate-100 p-1">
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
            onClick={() => dispatch(setMode('login'))}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
            onClick={() => dispatch(setMode('register'))}
          >
            Đăng ký
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {mode === 'register' && (
          <div className="sm:col-span-2 space-y-1">
            <label className="text-sm font-semibold text-slate-700">Họ và tên</label>
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </div>
        )}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            placeholder="you@example.com"
          />
        </div>
        {mode === 'register' && (
          <div className="sm:col-span-2 space-y-1">
            <label className="text-sm font-semibold text-slate-700">Số điện thoại</label>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              placeholder="09xx xxx xxx"
            />
          </div>
        )}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
        </div>
        <div className="sm:col-span-2 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {mode === 'login'
              ? 'Quên mật khẩu?'
              : 'Kích hoạt tài khoản để đăng tin và nhận thông báo nhanh.'}
          </p>
          <button
            type="submit"
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-600/25 transition hover:-translate-y-0.5 hover:bg-cyan-700"
          >
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AuthForm
