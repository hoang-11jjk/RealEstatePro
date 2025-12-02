import { X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearToast } from '../store/uiSlice'

function Toast() {
  const dispatch = useAppDispatch()
  const toast = useAppSelector((state) => state.ui.toast)

  if (!toast) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in flex max-w-md items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-2xl shadow-slate-900/40 backdrop-blur-sm">
      <span className="text-sm">{toast}</span>
      <button
        type="button"
        aria-label="Đóng thông báo"
        className="rounded-full bg-white/10 p-1 transition-all duration-200 hover:bg-white/20 hover:rotate-90 active:scale-95"
        onClick={() => dispatch(clearToast())}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export default Toast
