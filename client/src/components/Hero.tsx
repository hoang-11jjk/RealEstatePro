import { Building2 } from 'lucide-react'
import type { Property } from '../types'
import { priceFormatter } from '../utils/format'

type Props = {
  featured: Property | null
  total: number
  onSearchClick: () => void
}

function Hero({ featured, total, onSearchClick }: Props) {
  return (
    <section className="animate-slide-in rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-600 p-6 text-white shadow-xl shadow-slate-900/25 transition-all duration-300 hover:shadow-2xl">{" "}
      <div className="grid gap-8 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Website bất động sản</p>
          <h1 className="text-3xl font-black leading-tight md:text-4xl">
            Đăng tin nhà đất, tìm kiếm & liên hệ trên RealEstatePro
          </h1>
          <p className="max-w-2xl text-sm text-slate-200 md:text-base">
            Bộ lọc thông minh, tin đăng nổi bật, kết nối trực tiếp với môi giới và chủ nhà. Dữ liệu
            hiển thị tức thì, trải nghiệm nhanh và gọn.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onSearchClick}
              className="group rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/30 active:translate-y-0"
            >
              <span className="inline-block transition-transform duration-300 group-hover:scale-105">Bắt đầu tìm kiếm</span>
            </button>
            <a
              href="#listings"
              className="group rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white/10 hover:shadow-lg active:translate-y-0"
            >
              <span className="inline-block transition-transform duration-300 group-hover:scale-105">Xem tin đăng</span>
            </a>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="group rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg">
              <p className="text-lg font-black text-white transition-transform duration-300 group-hover:scale-110">{total}+</p>
              <p className="text-slate-200">Tin đang hiển thị</p>
            </div>
            <div className="group rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg">
              <p className="text-lg font-black text-white transition-transform duration-300 group-hover:scale-110">3 phút</p>
              <p className="text-slate-200">Để đăng tin mới</p>
            </div>
            <div className="group rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg">
              <p className="text-lg font-black text-white transition-transform duration-300 group-hover:scale-110">24/7</p>
              <p className="text-slate-200">Hỗ trợ khách hàng</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
            <Building2 className="h-4 w-4" />
            Tin nổi bật
          </div>
          {featured ? (
            <div className="space-y-3 pt-3">
              <p className="text-lg font-bold leading-tight">{featured.title}</p>
              <p className="text-sm text-cyan-100">
                {featured.location} · {featured.beds} PN · {featured.baths} WC · {featured.area} m²
              </p>
              <p className="text-2xl font-black text-white">{priceFormatter.format(featured.price)}</p>
              <div className="flex flex-wrap gap-2">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-200">{featured.description}</p>
              <div className="flex items-center justify-between rounded-xl border border-white/15 bg-slate-900/40 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-white">{featured.contactName}</p>
                  <p className="text-xs text-cyan-100">{featured.contactPhone}</p>
                </div>
                <a
                  href="#contact"
                  className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-md shadow-slate-900/25"
                >
                  Liên hệ ngay
                </a>
              </div>
            </div>
          ) : (
            <p className="pt-4 text-sm text-slate-200">Chưa có tin để hiển thị.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero
