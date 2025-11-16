import { useState, type FormEvent } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useAppDispatch } from '../store/hooks'
import { showToast } from '../store/uiSlice'

function ContactSection() {
  const dispatch = useAppDispatch()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(
      showToast(`Đã nhận liên hệ từ ${form.name || 'bạn'}. Chúng tôi sẽ phản hồi sớm!`),
    )
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <section id="contact" className="grid gap-6 rounded-2xl bg-white p-6 shadow-md shadow-slate-900/5 lg:grid-cols-2">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-600">Liên hệ hỗ trợ</p>
        <h3 className="text-xl font-bold text-slate-900">Kết nối ngay với RealEstatePro</h3>
        <p className="text-sm text-slate-600">
          Đội ngũ trực 24/7, hỗ trợ đăng tin, tư vấn mua bán và các thủ tục pháp lý.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-slate-50 p-3 text-sm">
            <p className="flex items-center gap-2 font-semibold text-slate-900">
              <Phone className="h-4 w-4 text-cyan-600" />
              Hotline
            </p>
            <p className="text-slate-600">1900 6868</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm">
            <p className="flex items-center gap-2 font-semibold text-slate-900">
              <Mail className="h-4 w-4 text-cyan-600" />
              Email
            </p>
            <p className="text-slate-600">support@realestatepro.vn</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm">
            <p className="flex items-center gap-2 font-semibold text-slate-900">
              <MapPin className="h-4 w-4 text-cyan-600" />
              Văn phòng
            </p>
            <p className="text-slate-600">Quận 1, TP.HCM</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Họ và tên</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Số điện thoại</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            placeholder="Không bắt buộc"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Nội dung</label>
          <textarea
            required
            rows={3}
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            placeholder="Nhập câu hỏi hoặc nhu cầu của bạn..."
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-600/25 transition hover:-translate-y-0.5 hover:bg-cyan-700"
        >
          Gửi yêu cầu
        </button>
      </form>
    </section>
  )
}

export default ContactSection
