import { Building, MapPin, Phone } from 'lucide-react'
import type { Property } from '../types'
import { priceFormatter } from '../utils/format'

type Props = {
  properties: Property[]
  selectedId: number | null
  onSelect: (id: number) => void
  isLoading?: boolean
  error?: string | null
}

function PropertyGrid({ properties, selectedId, onSelect, isLoading, error }: Props) {
  const selected = properties.find((item) => item.id === selectedId) ?? properties[0] ?? null

  return (
    <section id="listings" className="animate-slide-in rounded-2xl bg-white p-6 shadow-md shadow-slate-900/5 transition-shadow duration-300 hover:shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-600">Tin đăng mới</p>
          <h3 className="text-xl font-bold text-slate-900">Khám phá các bất động sản nổi bật</h3>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Đăng tin miễn phí
        </span>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <div className="h-40 w-full skeleton" />
                <div className="space-y-3 p-3">
                  <div className="h-4 w-3/4 skeleton rounded" />
                  <div className="h-6 w-1/2 skeleton rounded" />
                  <div className="h-3 w-full skeleton rounded" />
                  <div className="flex gap-2">
                    <div className="h-8 w-16 skeleton rounded-lg" />
                    <div className="h-8 w-16 skeleton rounded-lg" />
                    <div className="h-8 w-16 skeleton rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-sm text-rose-700">
          {error}
        </div>
      ) : properties.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
          Không tìm thấy tin phù hợp. Hãy điều chỉnh bộ lọc.
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <article
              key={property.id}
              className={`group flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                selectedId === property.id
                  ? 'border-cyan-500 shadow-lg shadow-cyan-500/30 scale-[1.02]'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
              onClick={() => onSelect(property.id)}
            >
              <div
                className="relative h-40 w-full overflow-hidden bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${property.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute left-2 top-2 flex gap-2">
                  <span className="rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-black/90">
                    {property.status}
                  </span>
                  <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-slate-900 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/95">
                    {property.type}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                <h4 className="text-base font-semibold text-slate-900">{property.title}</h4>
                <p className="text-lg font-black text-slate-900">
                  {priceFormatter.format(property.price)}
                </p>
                <p className="flex items-center gap-1 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-cyan-600" />
                  {property.location}
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                  <span className="rounded-lg bg-white px-2 py-1 shadow-sm">{property.beds} PN</span>
                  <span className="rounded-lg bg-white px-2 py-1 shadow-sm">{property.baths} WC</span>
                  <span className="rounded-lg bg-white px-2 py-1 shadow-sm">{property.area} m²</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {property.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-cyan-50 px-2 py-1 text-[11px] font-semibold text-cyan-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between rounded-lg bg-white px-2 py-2 shadow-sm transition-all duration-300 group-hover:shadow-md">
                  <div className="text-sm text-slate-700">
                    <p className="font-semibold">{property.contactName}</p>
                    <p className="text-xs">{property.contactPhone}</p>
                  </div>
                  <a
                    href={`/listings/${property.id}`}
                    className="text-xs font-semibold text-cyan-700 transition-transform duration-300 group-hover:translate-x-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Xem chi tiết →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {selected && !isLoading && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-700">Chi tiết tin</p>
            <p className="text-lg font-bold text-slate-900">{selected.title}</p>
            <p className="flex items-center gap-1 text-sm text-slate-600">
              <Building className="h-4 w-4 text-cyan-600" />
              {selected.location}
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
              <span className="rounded-lg bg-white px-2 py-1 shadow-sm">{selected.beds} PN</span>
              <span className="rounded-lg bg-white px-2 py-1 shadow-sm">{selected.baths} WC</span>
              <span className="rounded-lg bg-white px-2 py-1 shadow-sm">{selected.area} m²</span>
              <span className="rounded-lg bg-white px-2 py-1 shadow-sm">{selected.status}</span>
            </div>
          </div>
          <div className="rounded-xl border border-cyan-100 bg-white px-4 py-3 text-sm shadow-sm">
            <p className="text-xl font-black text-slate-900">{priceFormatter.format(selected.price)}</p>
            <p className="flex items-center gap-2 text-slate-700">
              <Phone className="h-4 w-4 text-cyan-600" />
              {selected.contactName} · {selected.contactPhone}
            </p>
            <a
              href="#contact"
              className="mt-2 inline-block rounded-lg bg-cyan-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-cyan-700"
            >
              Gửi yêu cầu
            </a>
          </div>
        </div>
      )}
    </section>
  )
}

export default PropertyGrid
