import { useLocation } from 'react-router-dom'
import AuthForm from '../components/forms/AuthForm'

function AuthPage() {
  const location = useLocation()
  const redirectPath = (location.state as { from?: string } | null)?.from ?? '/'

  return (
    <div className="space-y-4">
      {location.state?.from && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Bạn cần đăng nhập để truy cập: {location.state.from}
        </div>
      )}
      <AuthForm redirectPath={redirectPath} />
    </div>
  )
}

export default AuthPage
