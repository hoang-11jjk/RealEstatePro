import { LogOut, ShieldHalf } from 'lucide-react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Toast from '../Toast'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout } from '../../store/authSlice'

function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const isAdmin = user?.email === 'admin@realestatepro.local'
  const navItems = [
    { to: '/', label: 'Trang chủ' },
    { to: '/listings', label: 'Danh sách' },
    { to: '/post', label: 'Đăng tin' },
    ...(user ? [{ to: '/me/listings', label: 'Tin của tôi' }] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Quản trị' }] : []),
  ]

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-600 pb-10 text-white shadow-xl shadow-slate-900/30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <ShieldHalf className="h-6 w-6 text-cyan-300" />
            RealEstatePro
          </Link>
          <nav className="flex items-center gap-2 text-sm font-semibold">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-3 py-2 transition-all duration-200 ${
                  location.pathname === item.to ? 'bg-white/20 text-white scale-105' : 'text-slate-100 hover:bg-white/15 hover:scale-105'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-2 backdrop-blur-sm">
                <span className="text-sm">{user.fullName}</span>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-xs font-semibold transition-all duration-200 hover:bg-white/25 hover:scale-105 active:scale-95"
                  onClick={() => {
                    dispatch(logout())
                    navigate('/auth')
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Thoát
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="rounded-full bg-white px-3 py-2 text-slate-900 shadow-sm shadow-slate-900/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
              >
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
        <div className="mx-auto h-px max-w-6xl bg-white/15" />
      </div>

      <main className="mx-auto max-w-6xl space-y-12 px-4 pb-12 pt-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-slate-600">
          <p>RealEstatePro · Kết nối người mua và người bán an toàn.</p>
          <div className="flex gap-4">
            <a href="#listings" className="transition-colors duration-200 hover:text-slate-900 hover:underline underline-offset-4">
              Tin đăng
            </a>
            <a href="#contact" className="transition-colors duration-200 hover:text-slate-900 hover:underline underline-offset-4">
              Liên hệ
            </a>
            <Link to="/auth" className="transition-colors duration-200 hover:text-slate-900 hover:underline underline-offset-4">
              Tài khoản
            </Link>
          </div>
        </div>
      </footer>

      <Toast />
    </div>
  )
}

export default MainLayout
